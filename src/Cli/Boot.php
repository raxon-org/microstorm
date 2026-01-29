<?php
namespace Microstorm\Cli;

use Exception;
use Plugin;

class Boot {
    use Plugin\Request;

    /**
     * @throws Exception
     */
    public function run(Data $config){
        ddd($this->request());
        echo 'boot options & flags' . PHP_EOL;
    }
}