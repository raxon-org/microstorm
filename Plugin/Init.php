<?php
namespace Plugin;

use Exception;
use Microstorm\Data;

trait Init {

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
                    'temp' => '/tmp/raxon/org/',
                    'root' => dirname(__DIR__) . DIRECTORY_SEPARATOR,
                    'data' => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'Data' . DIRECTORY_SEPARATOR,
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
}