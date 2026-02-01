<?php
namespace Microstorm\Api;

use Exception;
use Module\Core;
use Module\Data;
use Module\Dir;
use Module\File;
use Plugin;

class Command {
    use Plugin\Config;
    use Plugin\Console;
    use Plugin\Request;

    private ?object $config = null;

    /**
     * @throws Exception
     */
    public function main(Data $config): void
    {
        $this->config($config);
        $input = $this->request('input');
        $uuid = $this->request('uuid');
        if(!$uuid){
            return;
        }
        $action = $this->request('action');
        $dir_command = $this->config->get('directory.temp') . 'Command/';
        Dir::create($dir_command, Dir::CHMOD);
        $url = $dir_command . $uuid . '.json';
        if(!File::exists($url)){
            throw new Exception('Command not found');
        }
        switch($action){
            case 'login':
                $login = trim(substr($input, 0,-1)); //removes \n and tabs and spaces
                $data = new Data(Core::object(File::read($url)));
                $data->set('user.login', $login);
                $data->set('command.action', 'login.host');
                $data->write($url);
            break;
            case 'login.host':
                $host = trim(substr($input, 0,-1));
                $data = new Data(Core::object(File::read($url)));
                $data->set('user.host', $host);
                $data->set('command.action', 'login.password');
                $data->write($url);
            break;
            case 'login.password':
                $password = trim(substr($input, 0,-1));
                $data = new Data(Core::object(File::read($url)));
                $data->set('user.password', $password);
                $data->set('command.action', 'login.shell');
                $data->write($url);
            break;
            case 'shell';
                $command = trim(substr($input, 0,-1));
                switch(strtolower($command)){
                    case 'exit':
                        $data = new Data(Core::object(File::read($url)));
                        $data->set('user.exit',true);
                        $data->set('command.action', 'login.exit');
                        $data->write($url);
                    default:
                        $data = new Data(Core::object(File::read($url)));
                        $data->set('command.input',$command);
                        $data->delete('command.action');
                        $data->write($url);
                }

                break;

        }
    }
}