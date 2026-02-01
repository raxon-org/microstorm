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
                    d($record);
                    /*
                    if(array_key_exists(33, $explode) && stristr($explode[33], 'Caddyfile')){
                        exec('kill -9 ' . $explode[1]);
                    }
                    [33]=>
  string(22) "/Application/Caddyfile"
                    */
                }

            }
            break;
            default:
                throw new Exception('Module not found');
        }
        return '';
    }
}