<?php
namespace Plugin;

use Exception;
use Microstorm\Data;

trait ContentType {

    public function content_type(Data $config): string
    {
        ddd($config);
        /*
        $contentType = $object->data(App::CONTENT_TYPE);
        if(empty($contentType)){
            $contentType = App::CONTENT_TYPE_HTML;
            if(property_exists($object->data(App::REQUEST_HEADER), '_')){
                $contentType = App::CONTENT_TYPE_CLI;
            }
            elseif(property_exists($object->data(App::REQUEST_HEADER), 'Content-Type')){
                $contentType = $object->data(App::REQUEST_HEADER)->{'Content-Type'};
            }
            if(empty($contentType)){
                throw new Exception('Couldn\'t determine contentType');
            }
            $object->data(App::CONTENT_TYPE, $contentType);
            return $contentType;
        } else {
            return $contentType;
        }
        */
    }
}