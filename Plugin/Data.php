<?php
namespace Plugin;

use Microstorm\Data as Module;

trait Data {

    public function data(null|Module $data = null): Module | null {
        if($data !== null) {
            $this->data = $data;
        }
        return $this->data;
    }
}