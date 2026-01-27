<?php
if(!defined('MICROSTORM')){
    die( 'Forbidden');
}
$dir_application_framework = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'Framework' . DIRECTORY_SEPARATOR;
require_once $dir_application_framework . 'Boot.php';
require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';

$app = new Boot();
var_dump($app);
die;



return Boot::app();