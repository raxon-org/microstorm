<?php

namespace Controller;

use Microstorm\Data;

class Index
{
    public static function main(Data $config){
        d($config);
        echo 'Hello World!';
    }

}