<?php
namespace Plugin;

use Microstorm\Data;

trait Config {

    public function config(null|Data $config = null): Data | null {
        if($config !== null) {
            $this->config = $config;
        }
        return $this->config;
    }
}