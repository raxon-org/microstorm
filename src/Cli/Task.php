<?php
namespace Microstorm\Cli;

use Exception;
use Module\Data;
use Module\File;
use Plugin;

class Task {
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
        $module = $this->request('module');
        switch($module){
            case 'create':
                //create a task
                break;
            case 'list':
                //list all tasks
                break;
            case 'run':
                return 'Task run...' . PHP_EOL;
                break;
        }
        return '';
    }
}