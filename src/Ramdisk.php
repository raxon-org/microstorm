<?php
namespace Microstorm;

require_once __DIR__ . '/Dir.php';

use Microstorm\Dir;

$dir_tmp = '/tmp/raxon/org/Plugin/';
if(!Dir::is($dir_tmp)){
    Dir::create($dir_tmp, Dir::CHMOD);
    $dir_plugin = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'Plugin' . DIRECTORY_SEPARATOR;
    $dir = new Dir();
    $read = $dir->read($dir_plugin);
    d($read);
}
