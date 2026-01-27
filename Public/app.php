<?php
if(!defined('MICROSTORM')){
    die( 'Forbidden');
}
$autoload = require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';

var_dump($autoload);
frankenphp_handle_request();

$app = new Boot();
var_dump($app);

die;



$dir_application_framework = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'Framework' . DIRECTORY_SEPARATOR;
require_once $dir_application_framework . 'Boot.php';






return Boot::app();