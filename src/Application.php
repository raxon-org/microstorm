<?php
namespace Microstorm;

use TypeError;
use Exception;
use Module\Data;
use Plugin;

class Application {

    use Plugin\Autoload;
    use Plugin\Config;
    use Plugin\Data;
    use Plugin\Destination;
    use Plugin\Request;
    use Plugin\Route;

    protected ?object $autoload = null;
    protected ?object $config = null;
    protected ?object $data = null;

    /**
     * @throws Exception
     */
    public function __construct(null|object $autoload=null, null|Data $config = null, null|Data $data = null) {
        $this->autoload($autoload);
        $this->config($config);
        $this->data($data);
        $this->init();

        echo 'Hello Microstorm!' . PHP_EOL;
    }

    /**
     * @throws Exception
     */
    private function init($dir=__DIR__): void
    {
        $config = $this->config();
        if ($config === null) {
            $config = new Data((object)[
                'time' => (object)[
                    'start' => MICROSTORM,
                    'current' => null,
                    'duration' => null
                ],
                'environment' => 'production',
                'directory' => (object)[
                    'temp' => '/tmp/raxon/org/',
                    'root' => dirname($dir) . DIRECTORY_SEPARATOR,
                    'controller' => dirname($dir) . DIRECTORY_SEPARATOR . 'Controller' . DIRECTORY_SEPARATOR,
                    'data' => dirname($dir) . DIRECTORY_SEPARATOR . 'Data' . DIRECTORY_SEPARATOR,
                    'public' => dirname($dir) . DIRECTORY_SEPARATOR . 'Public' . DIRECTORY_SEPARATOR,
                    'source' => dirname($dir) . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR,
                    'vendor' => dirname($dir) . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR,
                    'view' => dirname($dir) . DIRECTORY_SEPARATOR . 'View' . DIRECTORY_SEPARATOR,
                ]
            ]);
            if ($config->get('directory.root') === $config->get('directory.temp')) {
                throw new Exception('$dir argument is invalid.');
            }
            $this->config($config);
            $this->config_extension($config);
        }
        $data = $this->data();
        if ($data === null) {
            $this->data(new Data());
        }
    }

    /**
     * @throws Exception
     */
    public function run($server, $files, $cookie): void
    {
        $this->config_update($server, $files, $cookie);
        $this->request_configure();
        $this->route_configure();
        $destination = $this->destination('file_request');
        if($destination === false){
            $destination = $this->destination('page');
            if($destination === false){
                throw new Exception('Cannot find route.');
            }
        }
        $controller = $destination->get('controller');
        $method = $destination->get('function');
        try {
            $methods = get_class_methods($controller) ?? [];
            if($method !== null && !in_array($method, $methods)){
                throw new Exception('Cannot call controller function in controller: ' . (string) $controller);
            }
        }
        catch (TypeError $e) {
            throw new Exception('Cannot find controller: ' . (string) $controller . ' with method: ' . $method);
        }
        $controller = new $controller();
        echo $controller->$method($this->config());
    }
}


