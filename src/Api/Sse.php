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
            global $connection;
            global $shell;
            switch($action){
                case 'login':
                    $output = $data->get('output') ?? [];
                    $output[] =  'Login:&nbsp;';
                    $data->set('output', $output);
                    $ping_data = new Data(Core::deep_clone($data->data()));
                    if($ping_data->has('user.password')){
                        $ping_data->set('user.password', '[redacted]');
                    }
                    echo 'data: ' . Core::object($ping_data->data(),Core::JSON_LINE);
                    $data->delete('command.action');
                    $data->write($url_command);

                break;
                case 'login.host':
                    $output = $data->get('output') ?? [];
                    $pop = array_pop($output);
                    $pop .= $data->get('user.login') . "\n";
                    $output[] = $pop;
                    $output[] =  'Host:&nbsp;';
                    $data->set('output', $output);
                    $ping_data = new Data(Core::deep_clone($data->data()));
                    if($ping_data->has('user.password')){
                        $ping_data->set('user.password', '[redacted]');
                    }
                    echo 'data: ' . Core::object($ping_data->data(),Core::JSON_LINE);
                    $data->delete('command.action');
                    $data->write($url_command);

                break;
                case 'login.password':
                    $output = $data->get('output') ?? [];
                    $pop = array_pop($output);
                    $pop .= $data->get('user.host') . "\n";
                    $output[] = $pop;
                    $output[] =  'Password:&nbsp;';
                    $host = $data->get('user.host');
                    $explode = explode(':', $host, 2);
                    if(array_key_exists(1, $explode)){
                        $port = $explode[1];
                    } else {
                        $port = 22;
                    }
                    $data->set('user.port', $port);
                    $data->set('output', $output);
                    $ping_data = new Data(Core::deep_clone($data->data()));
                    if($ping_data->has('user.password')){
                        $ping_data->set('user.password', '[redacted]');
                    }
                    echo 'data: ' . Core::object($ping_data->data(),Core::JSON_LINE);
                    $data->delete('command.action');
                    $data->write($url_command);
                break;
                case 'login.exit':
                    $output = $data->get('output') ?? [];
                    $output[] = 'Exiting...' . PHP_EOL;
                    $data->set('output', $output);
                    $ping_data = new Data(Core::deep_clone($data->data()));
                    if($ping_data->has('user.password')){
                        $ping_data->set('user.password', '[redacted]');
                    }
                    echo 'data: ' . Core::object($ping_data->data(),Core::JSON_LINE);
                    $data->delete('command.action');
                    $data->write($url_command);
                    @ssh2_disconnect($connection);
                break;
                case 'login.shell':
                    $output = [];
                    $output[] = 'Opening shell...' . PHP_EOL;
                    $data->set('output', $output);
                    $ping_data = new Data(Core::deep_clone($data->data()));
                    if($ping_data->has('user.password')){
                        $ping_data->set('user.password', '[redacted]');
                    }
                    echo 'data: ' . Core::object($ping_data->data(),Core::JSON_LINE);
                    echo "\n\n";
                    flush();
                    $id++;
                    echo "id: $id\n";
                    echo "event: ping\n";
                    $data->delete('command.action');
                    $data->write($url_command);
                    if($connection === null) {
                        $connection = @ssh2_connect($data->get('user.host'), $data->get('user.port'));
                    }
                    if (!$connection) {
                        $output[] = '❌ Could not connect to ' . $data->get('user.host') . ' on port ' .$data->get('user.port');
                        $data->set('output', $output);
                        $data->delete('command.action');
                    } else {
                        $data->set('connection', true);
                        $output[] = '✓ Connected to ' . $data->get('user.host') . ' on port ' . $data->get('user.port') . PHP_EOL;
                    }
                    $is_authenticated = $data->get('user.authenticated');
                    if($connection && $is_authenticated === null){
                        $is_authenticated = @ssh2_auth_password($connection, $data->get('user.login'), $data->get('user.password'));
                        $data->set('user.authenticated', $is_authenticated);
                    }
                    if ($connection && $is_authenticated === false) {
                        $output[] = '❌ Authentication failed' . PHP_EOL;
//                        $data->set('command.action', 'shell');
                        $data->set('command.action', 'user.password');
                        @ssh2_disconnect($connection);
                    }
                    if($connection && $is_authenticated === true) {
                        $output[] = '✓ Authentication successful' . PHP_EOL;
                        $data->set('command.action', 'shell');
                    }
                    $ping_data->set('output', $output);
                    $data->set('output', $output);
                    echo 'data: ' . Core::object($ping_data->data(), Core::JSON_LINE);
                    echo "\n\n";
                    flush();
                    $id++;
                    echo "id: $id\n";
                    echo "event: ping\n";
                    if($shell === null){
                        $shell = @ssh2_shell($connection, 'xterm');
                        if (!$shell) {
                            $output[] = '❌ Could not open SSH shell' . PHP_EOL;
                        } else {
                            stream_set_blocking($shell, false); // Wait for output
                            usleep(100000);
//                            fwrite($shell, "\n");
                            while ($line = fgets($shell)) {
                                $output[] = $line;
//                                $ping_data->set('output', $output);
//                                $data->set('output', $output);
//                                echo 'data: ' . Core::object($ping_data->data(), Core::JSON_LINE);
//                                echo "\n\n";
//                                flush();
//                                $id++;
//                                echo "id: $id\n";
//                                echo "event: ping\n";
                            }
//                            stream_set_blocking($shell, false);
                        }
                    }
                    /*
                    if(preg_match('/\x1b\[([0-9;]+)m/', implode('', $output), $matches)){
                        d($matches);
                    }
                    */
                    $ping_data->set('output', $output);
                    $data->set('output', $output);
                    echo 'data: ' . Core::object($ping_data->data(), Core::JSON_LINE);
                    $data->write($url_command);
                break;
                case 'shell':
                    $output = $data->get('output') ?? [];
//                    $output[] = '$ ';
                    $ping_data = new Data(Core::deep_clone($data->data()));
                    if($ping_data->has('user.password')){
                        $ping_data->set('user.password', '[redacted]');
                    }
                    if($data->get('user.exit') === true){
                        if($connection){
                            @ssh2_disconnect($connection);
                        }
                        if($shell){
                            fclose($shell);
                        }
                        $output[] = 'Exiting...' . PHP_EOL;
                    }
                    if($data->get('command.input') !== null){
                        fwrite($shell, $data->get('command.input') . "\n");
                        $data->delete('command.input');
                        switch($data->get('command.input')){
                            case 'clear' :
                                $output = [];
                                break;

                        }
                    }
                    while ($line = fgets($shell)) {
                        $output[] = $line;
                    }
//                        $ping_data->set('output', $output);
//                        $data->set('output', $output);
//                        echo 'data: ' . Core::object($ping_data->data(), Core::JSON_LINE);
//                        echo "\n\n";
//                        flush();
//                        $id++;
//                        echo "id: $id\n";
//                        echo "event: ping\n";
                    $screen = implode("\n", $output);
                    if(preg_match_all('/\x1b\[([0-9;]+)m/', $screen, $matches)){
                        $span_count = 0;
                        if(array_key_exists(0, $matches) && is_array($matches[0])){
                            foreach($matches[0] as $key => $match) {
                                $command = $matches[1][$key];
                                switch ($command){
                                    case '0':
                                        if ($span_count > 0) {
                                            $screen = str_replace($match, str_repeat('</span>', $span_count), $screen);
                                        }
                                        $span_count = 0;
                                    break;
                                    default:
                                        $explode = explode(';', $command);
                                        $color = null;
                                        $background = null;
                                        $bold = false;
                                        $dim = false;
                                        $italic = false;
                                        $underline = false;
                                        $blink = false;
                                        $reverse = false;
                                        $hidden = false;
                                        $strike = false;
                                        $reset = false;
                                        foreach($explode as $item) {
                                            $item = trim($item);
                                            switch($item){
                                                case '00':
                                                case '0':
                                                    $reset = true;
                                                break;
                                                case '01':
                                                case '1':
                                                    $bold = true;
                                                break;
                                                case '02':
                                                case '2':
                                                    $dim = true;
                                                break;
                                                case '03':
                                                case '3':
                                                    $italic = true;
                                                break;
                                                case '04':
                                                case '4':
                                                    $underline = true;
                                                break;
                                                case '05':
                                                case '5':
                                                    $blink = true;
                                                break;
                                                case '07':
                                                case '7':
                                                    $reverse = true;
                                                break;
                                                case '08':
                                                case '8':
                                                    $hidden = true;
                                                break;
                                                case '09':
                                                case '9':
                                                    $strike = true;
                                                break;
                                                case '30':
                                                    $color = 'black';
                                                break;
                                                case '31':
                                                    $color = 'red';
                                                break;
                                                case '32':
                                                    $color = 'green';
                                                break;
                                                case '33':
                                                    $color = 'yellow';
                                                break;
                                                case '34':
                                                    $color = 'blue';
                                                break;
                                                case '35':
                                                    $color = 'purple';
                                                break;
                                                case '36':
                                                    $color = 'cyan';
                                                break;
                                                case '37':
                                                    $color = 'white';
                                                break;
                                                case '38':
                                                    $color = 'gray';
                                                break;
                                                case '39':
                                                    $color = 'lightgray';
                                                break;
                                                case '40':
                                                    $background = 'black';
                                                break;
                                                case '41':
                                                    $background = 'red';
                                                break;
                                                case '42':
                                                    $background = 'green';
                                                break;
                                                case '43':
                                                    $background = 'yellow';
                                                break;
                                                case '44':
                                                    $background = 'blue';
                                                break;
                                                case '45':
                                                    $background = 'purple';
                                                break;
                                                case '46':
                                                    $background = 'cyan';
                                                break;
                                                case '47':
                                                    $background = 'white';
                                                break;
                                                case '48':
                                                    $background = 'gray';
                                                break;
                                                case '49':
                                                    $background = 'lightgray';
                                                break;
                                                default:
                                                    ddd($item);
                                                    break;
                                            }
                                        }
                                        if($color !== null){
                                            $screen = str_replace($match, '<span style="color:' . $color . '">', $screen);
                                            $span_count++;
                                        }
                                        if($background !== null){
                                            $screen = str_replace($match, '<span style="background-color:' . $background . '">', $screen);
                                            $span_count++;
                                        }
                                        if($bold === true){
                                            $screen = str_replace($match, '<span style="font-weight:bold">', $screen);
                                            $span_count++;
                                        }
                                        if($dim === true){
                                            $screen = str_replace($match, '<span style="font-weight:lighter">', $screen);
                                            $span_count++;
                                        }
                                        if($italic === true){
                                            $screen = str_replace($match, '<span style="font-style:italic">', $screen);
                                            $span_count++;
                                        }
                                        if($underline === true){
                                            $screen = str_replace($match, '<span style="text-decoration:underline">', $screen);
                                            $span_count++;
                                        }
                                        if($blink === true){
                                            $screen = str_replace($match, '<span style="text-decoration:blink">', $screen);
                                            $span_count++;
                                        }
                                        if($reverse === true){
                                            $screen = str_replace($match, '<span style="transform:scaleX(-1)">', $screen);
                                            $span_count++;
                                        }
                                        if($hidden === true){
                                            $screen = str_replace($match, '<span style="visibility:hidden">', $screen);
                                            $span_count++;
                                        }
                                        if($strike === true){
                                            $screen = str_replace($match, '<span style="text-decoration:line-through">', $screen);
                                            $span_count++;
                                        }
                                        if($reset === true){
                                            if ($span_count > 0) {
                                                $screen = str_replace($match, str_repeat('</span>', $span_count), $screen);
                                            }
                                            $span_count = 0;
                                        }
                                    break;
                                }
                            }
                        }
                    }
                    $output = explode("\n", $screen);
                    $ping_data->set('output', $output);
                    $data->set('output', $output);
                    echo 'data: ' . Core::object($ping_data->data(), Core::JSON_LINE);
                    $data->set('command.action', 'shell');
                    $data->write($url_command);
                break;
//                case 'shell.command':
                default:
                    $output = $data->get('output') ?? [];
                    if($data->get('user.exit') === true){
                        @ssh2_disconnect($connection);
                        fclose($shell);
                        $output[] = 'Exiting...' . PHP_EOL;
                    }
                    /*
                    if($data->has('command.input')){
                        $output[] = $data->get('command.input') . PHP_EOL;
//                        stream_set_blocking($shell, true);
                        stream_set_blocking($shell, false);
                        fwrite($shell, $data->get('command.input') . "\n");
                        while ($line = fgets($shell)) {
                            $output[] = $line;
                            $ping_data = new Data(Core::deep_clone($data->data()));
                            if($ping_data->has('user.password')){
                                $ping_data->set('user.password', '[redacted]');
                            }
                            $ping_data->set('output', $output);
                            $data->set('output', $output);
                            echo 'data: ' . Core::object($ping_data->data(),Core::JSON_LINE);
                            echo "\n\n";
                            flush();
                            $id++;
                            echo "id: $id\n";
                            echo "event: ping\n";

                        }
//                        stream_set_blocking($shell, false);
                    } else {
                        $ping_data = new Data(Core::deep_clone($data->data()));
                        if($ping_data->has('user.password')){
                            $ping_data->set('user.password', '[redacted]');
                        }
                        if($shell){
                            while ($line = fgets($shell)) {
                                $output[] = $line;
                            }
                        }
                        $ping_data->set('output', $output);
                        $data->set('output', $output);
                        echo 'data: ' . Core::object($ping_data->data(),Core::JSON_LINE);
                    }
                    */
                    if($data->get('user.exit') === true){
                        $data->delete('user.exit');
                        $data->delete('connection');
                        $data->set('output', []);
                        $data->set('command.action', 'login');
                    } else {
                        $ping_data = new Data(Core::deep_clone($data->data()));
                        if($ping_data->has('user.password')){
                            $ping_data->set('user.password', '[redacted]');
                        }
                        if($shell){
                            while ($line = fgets($shell)) {
                                $output[] = $line;
                            }
                        }
                        $ping_data->set('output', $output);
                        $data->set('output', $output);
                        echo 'data: ' . Core::object($ping_data->data(),Core::JSON_LINE);
                        $data->delete('command.action');
                    }
                    /*
                    if($shell){
                        while ($line = fgets($shell)) {
                            $output[] = $line;
                            $ping_data->set('output', $output);
                            $data->set('output', $output);
                            echo 'data: ' . Core::object($ping_data->data(), Core::JSON_LINE);
                            echo "\n\n";
                            flush();
                            $id++;
                            echo "id: $id\n";
                            echo "event: ping\n";
                        }
                    }
                    */
                    $data->write($url_command);
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