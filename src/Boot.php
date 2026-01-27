<?php
namespace Microstorm;

use Exception;

class Boot {
    protected object $data;
    protected object $autoload;
    protected object $config;

    /**
     * @throws Exception
     */
    public function __construct(object $autoload=null, Data $config = null, Data $data = null) {
        $this->autoload($autoload);
        $this->config($config);
        $this->data($data);
        $this->init();
    }

    /**
     * @throws Exception
     */
    private function init(Data $config=null, Data $data=null): void
    {
        $config = $this->config();
        if($config === null) {
            $config = new Data((object)[
                'time' => (object)[
                    'start' => MICROSTORM,
                    'current' => null,
                    'duration' => null
                ],
                'directory' => (object)[
                    'root' => dirname(__DIR__) . DIRECTORY_SEPARATOR,
                    'public' => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'Public' . DIRECTORY_SEPARATOR,
                    'source' => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR,
                    'vendor' => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR,
                ]
            ]);
            $this->config($config);
        }
    }

    public function autoload($autoload = null): mixed {
        if($autoload !== null) {
            $this->autoload = $autoload;
        }
        return $this->autoload;
    }

    public function config(Data $config = null): mixed {
        if($config !== null) {
            $this->config = $config;
        }
        return $this->config;
    }

    public function data(Data $data = null): mixed {
        if($data !== null) {
            $this->data = $data;
        }
        return $this->data;
    }

    public function refresh(): void {
        $config = $this->config();
        $config->set('time.current', microtime(true));
        $config->set('time.duration', $config->get('time.current') - $config->get('time.start'));
    }

    public static function app(object $config = null): Boot
    {
        return new Boot($config);
    }



}


