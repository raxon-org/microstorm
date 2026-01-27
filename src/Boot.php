<?php
namespace Microstorm;

class Boot {
    protected object $data;
    protected object $config;

    public function __construct(object $config = null) {
        $this->init($config);
    }

    private function init(object $config = null): void
    {
        $this->config = $config ?? (object) [
            'time' => (object) [
                'start' => MICROSTORM
            ],
            'directory' => (object) [
                'root' => dirname(__DIR__) . DIRECTORY_SEPARATOR,
                'public' => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'Public' . DIRECTORY_SEPARATOR,
                'framework' => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'Framework' . DIRECTORY_SEPARATOR,
                'vendor' => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR,
            ]
        ];
    }

    public function config($config = null): mixed {
        if($config !== null) {
            $this->config = $config;
        }
        return $this->config;
    }

    public function refresh(): void {
        $config = $this->config();
        $config->time->current = microtime(true);
        $config->time->duration = $config->time->current - $config->time->start;
        $this->config($config);
    }

    public static function app(object $config = null): Boot
    {
        return new Boot($config);
    }



}


