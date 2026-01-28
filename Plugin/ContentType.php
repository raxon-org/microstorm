<?php
namespace Plugin;

use Exception;
use Microstorm\Data;

trait ContentType {

    /**
     * @throws Exception
     */
    public function content_type(Data $config): string
    {
        $content_type = $config->get('content_type');
        if(empty($content_type)) {
            $content_type = 'text/html';
            if (array_key_exists('CONTENT_TYPE', $_SERVER)) {
                ddd($_SERVER['CONTENT_TYPE']);
            }
            $config->set('content_type', $content_type);
        }
        return $content_type;

    }
}