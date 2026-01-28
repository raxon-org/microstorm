<?php
namespace Microstorm;

use Exception;
//use Plugin;

class Application {
    /*
    use Plugin\Autoload;
    use Plugin\Config;
    use Plugin\Data;
    use Plugin\Destination;
    use Plugin\Init;
    use Plugin\Request;
    use Plugin\Route;
    */

    protected ?object $autoload = null;
    protected ?object $config = null;
    protected ?object $data = null;

    /**
     * @throws Exception
     */
    public function __construct(null|object $autoload=null, null|Data $config = null, null|Data $data = null) {
        /*
        $this->autoload($autoload);
        $this->config($config);
        $this->data($data);
        $this->init(__DIR__);
        */
        echo 'Hello Microstorm!' . PHP_EOL;
    }

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
        $controller = new $controller();
        echo $controller->$method($this->config());
    }
}


