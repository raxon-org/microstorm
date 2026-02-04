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
                                $ping_data->set('output', $output);
                                $data->set('output', $output);
                                echo 'data: ' . Core::object($ping_data->data(), Core::JSON_LINE);
                                echo "\n\n";
                                flush();
                                $id++;
                                echo "id: $id\n";
                                echo "event: ping\n";
                            }
//                            stream_set_blocking($shell, false);
                        }
                    }
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
                        if(preg_match('/\x1b\[([0-9;]+)m/', $line, $matches)){
                            d($matches);
                        }
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