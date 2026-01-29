<?php
namespace Microstorm\Cli;

use Exception;
use Module\Data;
use Plugin;

class Boot {
    use Plugin\Request;

    /**
     * @throws Exception
     */
    public function run(Data $config): string
    {
        d($this->request());
        return 'boot options & flags' . PHP_EOL;
    }
}