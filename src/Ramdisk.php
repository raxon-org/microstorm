<?php
namespace Microstorm;

$dir_tmp = '/tmp/raxon/org/Plugin/';
if(!Dir::is($dir_tmp)){
    Dir::create($dir_tmp, Dir::CHMOD);
    $dir_plugin = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'Plugin' . DIRECTORY_SEPARATOR;
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
