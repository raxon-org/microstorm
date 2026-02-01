<?php
namespace Microstorm\Cli;

use Exception;
use Module\Data;
use Module\File;
use Plugin;

class Boot {
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
        if(!File::exists($url)){
            $this->options('install', true);
        }
        if($this->options('install')){
            if(!File::exists($url)){
                $this->cron_restore();
            }
            $data = new Data();
            $data->set('time.start', microtime(true));
            $data->write($url);
            return 'Installing...' .PHP_EOL;
        }
        if($this->options('update')){
            $command = 'microstorm server restart &';
            exec($command);
        }
        return '';
    }
}