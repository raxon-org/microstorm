<?php
if(!defined('MICROSTORM')){
    die( 'Forbidden');
}
require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';

$app = new Boot();
var_dump($app);
frankenphp_handle_request();
die;



$dir_application_framework = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'Framework' . DIRECTORY_SEPARATOR;
require_once $dir_application_framework . 'Boot.php';






return Boot::app();