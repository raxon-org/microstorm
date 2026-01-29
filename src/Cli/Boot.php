<?php
namespace Microstorm\Cli;

use Exception;
use Module\Data;
use Plugin;

class Boot {
    use Plugin\Config;
    use Plugin\Request;
    use Plugin\Flags;
    use Plugin\Options;

    protected ?object $config = null;

    /**
     * @throws Exception
     */
    public function run(Data $config): string
    {
        $this->config($config);
        if($this->flags('update') && !File::exists($this->config->get('directory.temp') . 'Boot/Boot.json')){
            $this->flags('install', true);
        }
        if($this->flags('install')){
            return 'Installing...';
        }
        return '';
    }
}