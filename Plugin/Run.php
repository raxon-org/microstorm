<?php
namespace Plugin;

use Exception;

trait Run {

    /**
     * @throws Exception
     */
    public function run($server, $files, $cookie): void
    {
        $this->config_update($server, $files, $cookie);
        $this->request_configure();
        $this->route_configure();
        $destination = $this->destination();
        $controller = $destination->get('controller');
        $method = $destination->get('function');
        $methods = get_class_methods($controller);
        if(!in_array($method, $methods)){
            throw new Exception('Cannot call controller function in controller:' . (string) $controller);
        }
        $controller::$method($this->config());
    }
}