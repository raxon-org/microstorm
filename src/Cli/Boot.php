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
            $this->flags('install', true);
        }
        if($this->flags('install')){
            $data = new Data();
            $data->set('time.start', microtime(true));
            $data->write($url);
            if(!File::exists($url)){
                $this->cron_init();
            }
            return 'Installing...' .PHP_EOL;
        }
        return '';
    }
}