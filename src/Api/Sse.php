<?php
namespace Microstorm\Api;

use Exception;
use Module\Core;
use Module\Data;
use Module\Dir;
use Module\File;
use Plugin;

class Sse {
    use Plugin\Console;

    /**
     * @throws Exception
     */
    public function main(Data $config): void
    {
        $time_limit = 2 * 60 * 60; //2 hours
        set_time_limit((int) $time_limit);
        date_default_timezone_set("Europe/Amsterdam");
        header("Cache-Control: no-cache");
        header('Content-Encoding: none');
        header("Content-Type: text/event-stream");
        header("Connection: keep-alive");
        header("Keep-Alive: timeout=30, max=" . (int) $time_limit);
        header("Transfer-encoding: chunked");
        $this->console_interactive();
        echo ":" . str_repeat("a", 4096) . "\n";
        echo "\n\n";
        flush();
        $id = 1;
        $time_start = time();
        $uuid = Core::uuid();
        while(true){
            echo "id: $id\n";
            echo "event: ping\n";
            $time_current = time();
            //read command line
            $dir_command = $config->get('directory.temp') . 'Command/';
            Dir::create($dir_command, Dir::CHMOD);
            $url_command = $dir_command. $uuid . '.json';;
            if(!File::exists($url_command)){
                $data = new Data();
                $data->set('command.action', 'login');
                $data->set('uuid', $uuid);
                $data->write($url_command);
//                echo 'data: ' . Core::object($data->data(),Core::JSON_LINE);
//                $data->delete('command.action');
            }
            $data = new Data(Core::object(File::read($url_command)));
            $action = $data->get('command.action');
            switch($action){
                case 'login': {
                    echo 'data: ' . Core::object($data->data(),Core::JSON_LINE);
                    $data->delete('command.action');
                    $data->write($url_command);
                }
                break;
                case 'login.host': {
                    echo 'data: ' . Core::object($data->data(),Core::JSON_LINE);
                    $data->delete('command.action');
                    $data->write($url_command);
                    //$data->delete('command.action');
                }
                break;
                default: {
                    echo 'data: ' . Core::object($data->data(),Core::JSON_LINE);
                }
                break;
            }
            echo "\n\n";
            flush();
            $id++;
            sleep(1);
            if($time_current - $time_start > $time_limit){
                break;
            }
        }
    }
}