<?php
namespace Microstorm\Api;

use Exception;
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

        set_time_limit(2 * 60 * 60);
        date_default_timezone_set("Europe/Amsterdam");
        header("Cache-Control: no-cache");
        header('Content-Encoding: none');
        header("Content-Type: text/event-stream");
        header("Connection: keep-alive");
        header("Keep-Alive: timeout=30, max=7200");
        header("Transfer-encoding: chunked");
        $this->console_interactive();
        echo ":" . str_repeat("a", 4096) . "\n";
        echo "\n\n";
        flush();
        $id = 1;
        $time_start = time();
        while(true){
            $time_current = time();
            $line = ($time_current - $time_start) . 'seconds' . PHP_EOL;
            echo "id: $id\n";
            echo "event: ping\n";
            echo 'data: ' . $line;
            echo "\n\n";
            flush();
            $id++;
            sleep(1);
        }
    }
}