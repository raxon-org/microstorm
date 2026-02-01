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
        switch($action){
            case 'login': {
                $dir_command = $this->config->get('directory.temp') . 'Command/';
                Dir::create($dir_command, Dir::CHMOD);
                $url = $dir_command . $uuid . '.json';
                if(File::exists($url)){
                    $login = trim(substr($input, 0,-1)); //removes \n and tabs and spaces
                    $data = new Data(Core::object(File::read($url)));
                    $data->set('user.login', $login);
                    $data->set('command.action', 'login.host');
                    $data->write($url);
                } else {
                    throw new Exception('Command not found');
                }
            }
            break;
        }
    }
}