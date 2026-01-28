<?php
namespace Microstorm;

use Raxon\Exception\DirectoryCreateException;

$list = [
    'Plugin',
    'Route',
    'src'
];

foreach($list as $item){
    $dir_tmp = '/tmp/raxon/org/' . $item . '/';
    if(!Dir::is($dir_tmp)){
        try {
            Dir::create($dir_tmp, Dir::CHMOD);
        } catch (DirectoryCreateException $e) {

        }
        $dir_plugin = dirname(__DIR__) . DIRECTORY_SEPARATOR . $item . DIRECTORY_SEPARATOR;
        $dir = new Dir();
        $read = $dir->read($dir_plugin);
        if($read){
            foreach($read as $file){
                try {
                    if(!File::is($dir_tmp . $file->name)){
                        File::copy($dir_plugin . $file->name, $dir_tmp . $file->name);
                    } else {
                    }
                } catch (\Exception $e) {
                    echo $e->getMessage() . PHP_EOL;
                }
            }
        }
    }

}


