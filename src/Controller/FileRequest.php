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
        $url = str_replace('../', '', $config->get('directory.source') . 'Public/' . $current->get('path'));
        if(File::exists($url) && !headers_sent()){
            $extension = File::extension($url);
            switch ($extension){
                case 'css': $contentType = 'text/css'; break;
                case 'json': $contentType = 'application/json'; break;
                case 'js': $contentType = 'application/javascript'; break;
                default: $contentType = 'text/plain';
            }
            $etag = sha1($url);
            $gm = gmdate('D, d M Y H:i:s T', File::mtime($url));
            header('HTTP/1.1 200 OK');
            header('Last-Modified: '. $gm);
            header('ETag: ' . $etag . '-' . $gm);
            header('Cache-Control: public');
            header('Content-Type: ' . $contentType);

        }
        return File::read($url);
    }
}