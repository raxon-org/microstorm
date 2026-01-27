<?php
if(!defined('MICROSTORM')){
    die( 'Forbidden');
}
$app = (object) [
    'time' => (object) [
        'start' => microtime(true)
    ]
];
return $app;