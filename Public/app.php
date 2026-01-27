<?php
if(!defined('MICROSTORM')){
    die( 'Forbidden');
}
$autoload = require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';
require_once 'debug.php';
return new Microstorm\Boot($autoload);