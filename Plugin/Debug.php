<?php
namespace Plugin;

use Exception\ObjectException;

if(!function_exists('breakpoint')){
    /**
     * @throws ObjectException
     */
    function breakpoint($data=null): void
    {
        $trace = debug_backtrace(1);
        if(!defined('IS_CLI')){
            echo '<pre class="priya-debug">' . PHP_EOL;
        }
        echo $trace[0]['file'] . ':' . $trace[0]['line'] . PHP_EOL;
        var_dump($data);
        if(!defined('IS_CLI')){
            echo '</pre>' . PHP_EOL;
        }
        readline('Press enter to continue...');
    }
}

if(!function_exists('d')){
    function d($data=null, $options=[]): void
    {
        $trace = debug_backtrace(1);
        if(!defined('IS_CLI')){
            echo '<pre class="priya-debug">' . PHP_EOL;
        }
        if(array_key_exists('trace', $options) && $options['trace'] !== true){
            echo $options['trace'];
        } else {
            echo $trace[0]['file'] . ':' . $trace[0]['line'] . PHP_EOL;
        }
        var_dump($data);
        if(!defined('IS_CLI')){
            echo '</pre>' . PHP_EOL;
        }
    }
}

if(!function_exists('dd')){
    function dd($data=null, $options=[]): void
    {
        $trace = debug_backtrace(1);
        if(!defined('IS_CLI')){
            echo '<pre class="priya-debug">' . PHP_EOL;
        }
        if(array_key_exists('trace', $options) && $options['trace'] !== true){
            echo $options['trace'];
        } else {
            echo $trace[0]['file'] . ':' . $trace[0]['line'] . PHP_EOL;
        }
        var_dump($data);
        if(!defined('IS_CLI')){
            echo '</pre>' . PHP_EOL;
        }
        exit;
    }
}

if(!function_exists('ddd')){
    function ddd($data=null): void
    {
        $trace = debug_backtrace(1);
        if(!defined('IS_CLI')){
            echo '<pre class="priya-debug">';
        }
        echo $trace[0]['file'] . ':' . $trace[0]['line'] . PHP_EOL;
        if(!defined('IS_CLI')){
            echo '</pre>';
        }
        dd($data);
    }
}

if(!function_exists('trace')){
    function trace($length=null): null | array
    {
        $trace = debug_backtrace(1);
        $is_return = false;
        $content = [];
        if($length === true){
            $is_return = true;
        }
        if(!is_numeric($length)){
            $length = count($trace);
        }
        if(!$is_return){
            if(!defined('IS_CLI')){
                $content[] = '<pre class="priya-trace">';
            }
        }

        // don't need the first one (0)
        // we do, where did we put it...

        $content[] = Cli::debug('Trace') . PHP_EOL;
        for($i = 0; $i < $length; $i++){
            if(array_key_exists($i, $trace)){
                if(
                    array_key_exists('file', $trace[$i]) &&
                    array_key_exists('line', $trace[$i]) &&
                    array_key_exists('function', $trace[$i])
                ){
                    $list[] = $trace[$i]['function'] . ':' . $trace[$i]['file'] .':' . $trace[$i]['line'];
                    if($is_return){
                        $content[] = $trace[$i]['function'] . ':' . $trace[$i]['file'] .':' . $trace[$i]['line']  . PHP_EOL;
                    } else {
                        $content[] = cli::notice($trace[$i]['function']) . ':' . $trace[$i]['file'] .':' . $trace[$i]['line']  . PHP_EOL;
                    }

                }
                elseif(
                    array_key_exists('file', $trace[$i]) &&
                    array_key_exists('line', $trace[$i])
                ) {
                    $content[] = $trace[$i]['file'] . ':' . $trace[$i]['line'] . PHP_EOL;
                }
            }
        }
        if($is_return){
            return $content;
        } else {
            if(!defined('IS_CLI')){
                $content[] = '</pre>' . PHP_EOL;
            }
            echo implode('', $content);
        }
        return null;
    }
}

trait Debug {

}