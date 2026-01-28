<?php
namespace Microstorm;

use Exception;
use Plugin;

class Boot {
    use Plugin\Autoload;
    use Plugin\Config;
    use Plugin\Data;
    use Plugin\Destination;
    use Plugin\Init;
    use Plugin\Request;
    use Plugin\Route;
    use Plugin\Run;

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
    }
}


