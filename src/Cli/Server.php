<?php
namespace Microstorm\Cli;

use Exception;
use Module\Data;
use Module\File;
use Plugin;

class Server {
    use Plugin\Config;
    use Plugin\Request;
    use Plugin\Flags;
    use Plugin\Options;
    use Plugin\Cron;

    protected ?object $config = null;

    /**
     * @throws Exception
     */
    public function run(Data $config): string
    {
        $this->config($config);
        $url = $this->config->get('directory.temp') . 'Boot/Boot.json';
        switch($this->request('module')){
            case 'restart': {
                exec('ps auxww | grep \'frankenphp run\'', $output, $code);
                foreach($output as $line){
                    $explode = explode(' ', $line);
                    $record = [];
                    foreach($explode as $key => $value){
                        if($value !== ''){
                            $record[] = $value;
                        }
                    }
                    if(stristr(end($record), 'Caddyfile')){
                        exec('kill -9 ' . $record[1]);
                    }
                    if(array_key_exists(10, $record) && $record[10] === 'frankenphp'){
                        $count = count($record);
                        $command = 'nohup ';// . $record[11] . ' run >> /dev/null 2>&1 & echo $!';
                        for($i= 10; $i < $count; $i++){
                            $command .= $record[$i] . ' ';
                        }
                        ddd($command);
                    }
                }

            }
            break;
            default:
                throw new Exception('Module not found');
        }
        return '';
    }
}