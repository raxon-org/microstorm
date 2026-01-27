<?php
namespace Microstorm;

use Exception;
use Plugin;
class Boot {
    use Plugin\Request;

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

    /**
     * @throws Exception
     */
    private function init(): void
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
        $data = $this->data();
        if($data === null) {
            $this->data(new Data());
        }
    }

    public function autoload(null|object $autoload = null): object | null {
        if($autoload !== null) {
            $this->autoload = $autoload;
        }
        return $this->autoload;
    }

    public function config(null|Data $config = null): Data | null {
        if($config !== null) {
            $this->config = $config;
        }
        return $this->config;
    }

    public function data(null|Data $data = null): Data | null {
        if($data !== null) {
            $this->data = $data;
        }
        return $this->data;
    }

    /**
     * @throws Exception
     */
    public function run($server, $files, $cookie): void {
        $config = $this->config();
        $config->set('server', $server);
        $config->set('files', $files);
        $config->set('cookie', $cookie);
        $config->set('time.current', microtime(true));
        $config->set('time.duration', $config->get('time.current') - $config->get('time.start'));
        $config = $this->request_query_init($config);
        d($config);
    }
}


