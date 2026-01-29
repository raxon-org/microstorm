<?php
namespace Microstorm\Cli;

use Exception;
use Module\Data;
use Plugin;

class Boot {
    use Plugin\Config;
    use Plugin\Request;

    protected ?object $config = null;

    /**
     * @throws Exception
     */
    public function run(Data $config): string
    {
        $this->config($config);
        d($this->request());
        return 'boot options & flags' . PHP_EOL;
    }
}