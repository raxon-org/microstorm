<?php
namespace Microstorm\Api;

use Exception;
use Module\Core;
use Module\Data;
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
        while(true){
            $time_current = time();
            //read command line
            $url_command = $config->get('directory.temp') . 'Command/Command.json';;
            if(!File::exists($url_command)){
                $data = new Data();
                $data->set('Command.action', 'login');
            } else {
                $data = new Data();
                $data->set('Command.action', 'welcome');
            }
            echo "id: $id\n";
            echo "event: ping\n";
            echo 'data: ' . Core::object($data->data('Command'),Core::JSON_LINE);
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