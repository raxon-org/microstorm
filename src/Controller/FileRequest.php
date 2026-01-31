<?php
namespace Microstorm\Controller;

use Module\Data;
use Module\File;

class FileRequest {

    public function get(Data $config): string
    {
        $current = $config->get('route.current');
        if(!$current){
            return '';
        }
        $url = $config->get('directory.source') . $current->get('path');
        return File::read($url);
    }
}