<?php
if(!defined('MICROSTORM')){
    die( 'Forbidden');
}
$autoload = require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';
require_once '../src/Debug.php';
require_once '../src/Ramdisk.php';
return new Microstorm\Boot($autoload);
