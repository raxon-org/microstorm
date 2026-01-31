<?php
namespace Microstorm\Controller;

use Exception;
use Module\Data;
use Module\File;

class FileRequest {

    /**
     * @throws Exception
     */
    public function get(Data $config): string
    {
        $current = $config->get('route.current');
        if(!$current){
            return '';
        }
        $url = str_replace('../', '', $config->get('directory.source') . 'Public/' . $current->get('path'));
        if(File::exists($url) && !headers_sent()){
            $extension = File::extension($url);
            $content_type = $config->get('extensions.' . $extension);
            if($content_type === null){
                throw new Exception('Extension "' . $extension . '" is not supported.');
            }
            $etag = sha1($url);
            $gm = gmdate('D, d M Y H:i:s T', File::mtime($url));
            header('HTTP/1.1 200 OK');
            header('Last-Modified: '. $gm);
            header('ETag: ' . $etag . '-' . $gm);
            header('Cache-Control: public');
            header('Content-Type: ' . $content_type);
            return File::read($url);
        }
        elseif(headers_sent()){
            throw new Exception('Headers already sent.');
        } else {
            //404 error ?
            return '';
        }
    }
}