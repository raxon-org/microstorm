<?php
if(!defined('MICROSTORM')){
    die( 'Forbidden');
}
$app = (object) [
    'time' => (object) [
        'start' => constant('MICROSTORM')
    ]
];
return $app;