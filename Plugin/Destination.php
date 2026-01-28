<?php
namespace Plugin;

use Microstorm\Destination as Destiny;

trait Destination {

    public function destination(): null | Destiny
    {
        $config = $this->config();
        if($config){
            return $this->config()->get('route.current');
        }
        return null;
    }
}