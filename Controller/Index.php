<?php

namespace Controller;

use Microstorm\Data;
use Microstorm\File;

class Index
{
    public static function main(Data $config): string
    {

        $result = File::read($config->get('directory.view') . File::basename(__CLASS__) . __FUNCTION__ . '.html');
        return $result;
    }

}