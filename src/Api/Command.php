<?php
namespace Microstorm\Api;

use Exception;
use Module\Core;
use Module\Data;
use Module\Dir;
use Module\File;
use Plugin;

class Command {
    use Plugin\Console;

    /**
     * @throws Exception
     */
    public function main(Data $config): void
    {
        ddd($config);
    }
}