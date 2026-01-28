<?php

namespace Controller;

use Plugin;
class Index
{
    use Plugin\Config;

    public static function main(){
        $config = self::config();
        d($config);
        echo 'Hello World!';
    }

}