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
                exec('ps auxww | grep frankenphp', $output, $code);
                ddd($output);
            }
            break;
            default:
                throw new Exception('Module not found');
        }
        return '';
    }
}