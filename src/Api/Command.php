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
        $action = $this->request('action');
        switch($action){
            case 'login': {
                ddd($input);
            }
            break;
        }
    }
}