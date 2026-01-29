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
        d($this->flags());
        d($this->options('update'));
        return 'boot options & flags' . PHP_EOL;
    }
}