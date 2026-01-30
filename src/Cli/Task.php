<?php
namespace Microstorm\Cli;

use Exception;
use Exception\ObjectException;
use Module\Core;
use Module\Data;
use Module\Dir;
use Module\File;
use Module\Sort;
use Module\Filter;
use Plugin;

class Task {
    use Plugin\Config;
    use Plugin\Request;
    use Plugin\Flags;
    use Plugin\Options;

    const PENDING = 'pending';
    const IN_PROGRESS = 'in_progress';
    const COMPLETED = 'completed';
    const ERROR = 'error';

    protected ?object $config = null;

    /**
     * @throws Exception
     */
    public function run(Data $config): string
    {
        $this->config($config);
        $module = $this->request('module');
        switch($module){
            case 'create':
                $command = $this->options('command');
                $controller = $this->options('controller');
                if(is_array($command)){
                    //nothing
                }
                elseif(is_array($controller)){
                    //nothing
                }
                elseif(is_array($command) && is_array($controller)){
                    //nothing
                } else {
                    throw new Exception('option -command[] or -controller[] is not an array.');
                }
                $task = $this->task_create($config);
                return Core::object($task, Core::OBJECT_JSON) . PHP_EOL;
                //create a task
                break;
            case 'list':
                //list all tasks
                break;
            case 'run':
                $this->task_run($config);
                return '';
                break;
            case 'monitor':
                return $this->task_monitor($config);
            case 'info':
            default:
                $info = [];
                $info[] = 'Task info...';
                $info[] = 'Module: ' . $module;
                $info[] = 'Modules:';
                $info[] = '    - create';
                $info[] = '    - list';
                $info[] = '    - run';
                return implode(PHP_EOL, $info) . PHP_EOL;
        }
        return '';
    }

    /**
     * @throws ObjectException
     * @throws Exception
     */
    public function task_create(Data $config): object
    {
        $command = $this->options('command') ?? [];
        $controller = $this->options('controller') ?? [];

        $task = (object) [
            'uuid' => Core::uuid(),
            'status' => self::PENDING,
            'command' => $command,
            'controller' => $controller,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ];
        $dir_task = $config->get('directory.temp') . 'Task' . DIRECTORY_SEPARATOR;
        if(!Dir::is($dir_task)){
            Dir::create($dir_task, Dir::CHMOD);
        }
        $url_task = $dir_task . 'Task.json';
        if(!File::exists($url_task)){
            $data = new Data();
            $data->set('task.' . $task->uuid, $task);
            $data->write($url_task);
        } else {
            $data = new Data(Core::object(File::read($url_task)));
            $data->set('task.' . $task->uuid, $task);
            $data->write($url_task);
        }
        return $task;
    }

    /**
     * @throws Exception
     */
    public function task_get_pending(Data $config): bool|object
    {
        $url_task = $config->get('directory.temp') . 'Task/Task.json';
        if(!File::exists($url_task)){
            return false;
        }
        $data = new Data(Core::object(File::read($url_task)));
        $filter = Filter::list($data->get('task'))->where([
            'status' => [
                'value' => self::PENDING,
                'operator' => '==='
            ]
        ]);
        $sort = Sort::list($filter)->with(['created_at' => 'desc']);
        foreach($sort as $task){
            if($task->status === self::PENDING){
                return $task;
            }
        }
        return false;
    }

    /**
     * @throws Exception
     */
    public function task_get_by_uuid(Data $config): bool|object
    {
        $url_task = $config->get('directory.temp') . 'Task/Task.json';
        if(!File::exists($url_task)){
            return false;
        }
        $data = new Data(Core::object(File::read($url_task)));
        return $data->get('task.' . $this->options('task.uuid'));
    }

    /**
     * @throws Exception
     */
    private function task_run(Data $config): void
    {
        $time_start = time();
        while(true) {
            $is_busy = false;
            $record = $this->task_get_pending($config);
            if($record && property_exists($record, 'uuid')){
                $record->status = self::IN_PROGRESS;
                $is_busy = true;
            }
            if ($is_busy === false) {
                sleep(5);
            } else {
                $dir_package = $config->get('directory.temp') . 'Task' . DIRECTORY_SEPARATOR;
                $dir_stdout = $dir_package . 'stdout' . DIRECTORY_SEPARATOR;
                $dir_stderr = $dir_package . 'stderr' . DIRECTORY_SEPARATOR;
                Dir::create($dir_stdout, Dir::CHMOD);
                Dir::create($dir_stderr, Dir::CHMOD);
                $process_list = [];
                if(property_exists($record, 'uuid')){
                    $url_stdout = $dir_stdout . $record->uuid;
                    $url_stderr = $dir_stderr . $record->uuid;
                    foreach ($record->command as $nr => $command) {
                        $command = 'nohup ' . $command . ' >> ' . $url_stdout . ' 2>> ' . $url_stderr . ' &  echo $!';
                        exec($command, $output, $code);
                        $proc_id = trim($output[0]);
                        $process_list[] = $proc_id;
                    }
                    $command = 'nohup microstorm task monitor -task.uuid=' . $record->uuid;
                    foreach ($process_list as $proc_id) {
                        $command .= ' -process[]=' . $proc_id;
                    }
                    echo $command . PHP_EOL;
                    exec($command, $output, $code);

                }
            }
            $time_current = time();
            if ($time_current - $time_start > 60) { // 1 minute time-out
                //timeout cron every minute
                break;
            }
        }
    }

    /**
     * @throws Exception
     */
    private function task_monitor(Data $config): string
    {
        $flags = $this->flags();
        $options = $this->options();
        $record = $this->task_get_by_uuid($config);
        $dir_package = $config->get('directory.temp') . 'Task' . DIRECTORY_SEPARATOR;
        $dir_stdout = $dir_package . 'stdout' . DIRECTORY_SEPARATOR;
        $dir_stderr = $dir_package . 'stderr' . DIRECTORY_SEPARATOR;
        $url_stdout = $dir_stdout . $record->uuid;
        $url_stderr = $dir_stderr . $record->uuid;
        $time_start = time();
        while(true){
            $process_active = [];
            foreach($options->process as $proc_id) {
                $command = 'ps -p ' . $proc_id;
                exec($command, $output, $code);
                $process_active[] = $code;
            }
            if(!in_array(0, $process_active)) {
                //task completed
                $patch = (object) [
                    'uuid' => $record->uuid,
                    'status' => self::COMPLETED,
                    'updated_at' => date('Y-m-d H:i:s')
                ];
                if(File::exists($url_stdout)){
                    $stdout = File::read($url_stdout, ['return' => File::ARRAY]);
                    $patch->output = $stdout;
                    File::delete($url_stdout);
                }
                if(File::exists($url_stderr)){
                    $stderr = File::read($url_stderr, ['return' => File::ARRAY]);
                    $patch->notification = $stderr;
                    File::delete($url_stderr);
                }
                $record = Core::object_merge($record, $patch);
                $dir_task = $config->get('directory.temp') . 'Task' . DIRECTORY_SEPARATOR;
                $url_task= $dir_task . 'Task.json';
                if(File::exists($url_task)){
                    $data = new Data(Core::object(File::read($url_task)));
                    $task = $data->get('task.' . $record->uuid);
                    $task = Core::object_merge($task, $record);
                    $data->set('task.' . $record->uuid, $task);
                    $data->write($url_task);
                } else {
                    Dir::create($dir_task, Dir::CHMOD);
                    $data = new Data();
                    $task = (object) [];
                    $task->{$record->uuid} = $record;
                    $data->set('task', $task);
                    $data->write($url_task);
                }
                break;
            }
            //task is running
            usleep(0.5 * 1000 * 1000);
            $time_current = time();
            if($time_current - $time_start > 120 * 60 * 60){ // 2 hours time-out
                //timeout
                $patch = (object) [
                    'uuid' => $record['uuid'],
                    'status' => self::ERROR,
                    'updated_at' => date('Y-m-d H:i:s')
                ];
                if(File::exists($url_stdout)){
                    $stdout = File::read($url_stdout, ['return' => File::ARRAY]);
                    $patch['output'] = $stdout;
                    File::delete($url_stdout);
                }
                if(File::exists($url_stderr)){
                    $stderr = File::read($url_stderr, ['return' => File::ARRAY]);
                    $patch['notification'] = $stderr;
                    File::delete($url_stderr);
                }
                $record = Core::object_merge($record, $patch);
                $dir_task = $config->get('directory.temp') . 'Task' . DIRECTORY_SEPARATOR;
                $url_task= $dir_task . 'Task.json';
                if(File::exists($url_task)){
                    $data = new Data(Core::object(File::read($url_task)));
                    $task = $data->get('task.' . $record->uuid);
                    $task = array_merge(Core::object_array($task), $record);
                    $data->set('task.' . $record->uuid, $task);
                    $data->write($url_task);
                } else {
                    Dir::create($dir_task, Dir::CHMOD);
                    $data = new Data();
                    $task = (object) [];
                    $task->{$record->uuid} = $record;
                    $data->set('task', $task);
                    $data->write($url_task);
                }
                break;
            } else {
                //updates the task output / notification every half a second.
                $patch = (object) [
                    'uuid' => $record['uuid'],
                    'output' => [],
                    'notification' => []
                ];
                if(File::exists($url_stdout)){
                    $stdout = File::read($url_stdout, ['return' => File::ARRAY]);
                    $patch->output = $stdout;
                }
                if(File::exists($url_stderr)){
                    $stderr = File::read($url_stderr, ['return' => File::ARRAY]);
                    $patch->notification = $stderr;
                }
                $record = Core::object_merge($record, $patch);
                $dir_task = $config->get('directory.temp') . 'Task' . DIRECTORY_SEPARATOR;
                $url_task= $dir_task . 'Task.json';
                if(File::exists($url_task)){
                    $data = new Data(Core::object(File::read($url_task)));
                    $task = $data->get('task.' . $record->uuid);
                    $task = array_merge(Core::object_array($task), $record);
                    $data->set('task.' . $record->uuid, $task);
                    $data->write($url_task);
                } else {
                    Dir::create($dir_task, Dir::CHMOD);
                    $data = new Data();
                    $task = (object) [];
                    $task->{$record->uuid} = $record;
                    $data->set('task', $task);
                    $data->write($url_task);
                }
            }
        }
        return 'Task run...' . PHP_EOL;
    }
}