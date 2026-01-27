<?php
namespace Plugin;

use Exception;
use Microstorm\Data;

trait Server {

    /**
     * @throws Exception
     */
    public function server_init(Data $config, array $server): Data
    {
        $uri = ltrim($_SERVER['REQUEST_URI'], '/');
        $uri = explode('?', $uri, 2);
        $request = $uri[0];
        $query_string = $uri[1] ?? '';
        $query = $this->server_query_string($query_string);
        if(empty($request)){
            $request = '/';
        }
        var_dump($request);
        var_dump($query);
        return $config;
    }

    public function server_query_result(mixed $result=null): mixed
    {
        if(is_array($result)){
            foreach($result as $key => $value){
                $value = $this->server_query_result($value);
                $key_original =  $key;
                if(
                    in_array(
                        substr($key, 0, 1),
                        [
                            '\'',
                            '"'
                        ],
                        true
                    )
                ){
                    $key = substr($key, 1);
                }
                if(
                    in_array(
                        substr($key, -1, 1),
                        [
                            '\'',
                            '"'
                        ],
                        true
                    )
                ){
                    $key = substr($key, 0, -1);
                }
                unset($result[$key_original]);
                $result[$key] = $value;
            }
        }
        elseif(is_string($result)){
            switch($result){
                case 'null':
                    $result = null;
                    break;
                case 'true':
                    $result = true;
                    break;
                case 'false':
                    $result = false;
                    break;
                default:
                    if(is_numeric($result)){
                        $result += 0;
                    }
            }
        }
        return $result;

    }

    /**
     * @throws ObjectException
     */
    public function server_query_string($query=''): object
    {
        parse_str($query, $result);
        $result = $this->server_query_result($result);
        return (object) $result;
    }

}