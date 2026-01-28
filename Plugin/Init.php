<?php
namespace Plugin;

use Exception;
use Microstorm\Data;

trait Init {

    /**
     * @throws Exception
     */
    private function init($dir=__DIR__): void
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
                    'root' => dirname($dir) . DIRECTORY_SEPARATOR,
                    'data' => dirname($dir) . DIRECTORY_SEPARATOR . 'Data' . DIRECTORY_SEPARATOR,
                    'public' => dirname($dir) . DIRECTORY_SEPARATOR . 'Public' . DIRECTORY_SEPARATOR,
                    'source' => dirname($dir) . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR,
                    'vendor' => dirname($dir) . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR,
                ]
            ]);
            if($config->get('directory.root') === $config->get('directory.temp')){
//                throw new Exception('$dir argument is invalid.');
            }
            $this->config($config);
        }
        $data = $this->data();
        if($data === null) {
            $this->data(new Data());
        }
    }
}