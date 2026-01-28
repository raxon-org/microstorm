<?php
namespace Plugin;

use Microstorm\Data;

trait Autoload {

    public function autoload(null|object $autoload = null): object | null {
        if($autoload !== null) {
            $this->autoload = $autoload;
        }
        return $this->autoload;
    }
}