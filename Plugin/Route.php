<?php
namespace Plugin;

use Exception;
use Exception\ObjectException;
use Microstorm\Data;
use Microstorm\Core;


trait Route {

    /**
     * @throws Exception
     */
    public function route_init(Data $config): Data
    {

        //route_find $config->get('request.request')
        d($config->get('request.request'));

        if (substr($config->get('request.request'), -1) != '/') {
            $config->set('request.request', $config->get('request.request') . '/');
        }
        $select = (object)[
            'input' => $config->get('request.request'),
        ];
        $test = $this->route_request_explode(urldecode($select->input));
        $test_count = count($test);
        if ($test_count > 1) {
            $select->attribute = explode('/', $test[0]);
            if (end($select->attribute) === '') {
                array_pop($select->attribute);
            }
            $array = [];
            for ($i = 1; $i < $test_count; $i++) {
                $array[] = $test[$i];
            }
            $select->attribute = array_merge($select->attribute, $array);
            $select->deep = count($select->attribute);
        } else {
            $string_count = $select->input;
            $select->deep = substr_count($string_count, '/');
            $select->attribute = explode('/', $select->input);
            if (end($select->attribute) === '') {
                array_pop($select->attribute);
            }
        }
        while (end($select->attribute) === '') {
            array_pop($select->attribute);
        }
        d($select);
        return $config;
    }


    private static function route_request_explode($input=''): array
    {
        $split = mb_str_split($input);
        $is_quote_double = false;
        $collection = '';
        $explode = [];
        $previous_char = false;
        foreach($split as $nr => $char){
            if(
                $previous_char === '/' &&
                $char === '{' &&
                $is_quote_double === false
            ){
                if(!empty($collection)){
                    $value = substr($collection, 0,-1);
                    if(!empty($value)){
                        $explode[] = $value;
                    }
                }
                $collection = $char;
                continue;
            }
            elseif(
                $previous_char === '/' &&
                $char == '[' &&
                $is_quote_double === false
            ){
                if(!empty($collection)){
                    $value = substr($collection, 0,-1);
                    if(!empty($value)){
                        $explode[] = $value;
                    }
                }
                $collection = $char;
                continue;
            }
            elseif(
                $char === '"' &&
                $previous_char !== '\\'
            ){
                $is_quote_double = !$is_quote_double;
            }
            $collection .= $char;
            $previous_char = $char;
        }
        if(!empty($collection)){
            if($previous_char === '/'){
                $value = substr($collection, 0,-1);
                if(!empty($value)){
                    $explode[] = $value;
                }
            } else {
                $explode[] = $collection;
            }
        }
        return $explode;
    }



}