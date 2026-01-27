<?php
namespace Plugin;

use Exception;
use Exception\ObjectException;
use Microstorm\Data;
use Microstorm\Core;


trait Route {

    /**
     * @throws Exception
     */
    public function route_init(Data $config): Data
    {

        //route_find $config->get('request.request')
        d($config->get('request.request'));


        return $config;
    }



}