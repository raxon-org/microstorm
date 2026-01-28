<?php
namespace Microstorm;

use Exception_ol\DirectoryCreateException;

$list = [
    'Plugin',
    'Route',
    'Controller'
];

foreach($list as $item){
    $dir_tmp = '/tmp/raxon/org/' . $item . '/';
    if(!Dir::is($dir_tmp)){
        try {
            Dir::create($dir_tmp, Dir::CHMOD);
        } catch (DirectoryCreateException $e) {
            echo $e->getMessage() . PHP_EOL;
        }
        $dir_source = dirname(__DIR__) . DIRECTORY_SEPARATOR . $item . DIRECTORY_SEPARATOR;
        $dir = new Dir();
        $read = $dir->read($dir_source);
        if($read){
            foreach($read as $file){
                try {
                    if(!File::is($dir_tmp . $file->name)){
                        File::copy($dir_source . $file->name, $dir_tmp . $file->name);
                    } else {
                    }
                } catch (\Exception $e) {
                    echo $e->getMessage() . PHP_EOL;
                }
            }
        }
    }
}


