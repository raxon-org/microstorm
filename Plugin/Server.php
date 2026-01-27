<?php
namespace Plugin;

use Exception;
use Microstorm\Data;

trait Server {

    /**
     * @throws Exception
     */
    public function server_init(Data $config, array $server): Data
    {
        $request = $server['REQUEST_URI'];
        var_dump($request);
        return $config;
    }
}