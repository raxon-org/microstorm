<?php
namespace Microstorm;
require_once __DIR__ . '/Dir.php';
use Microstorm\Dir;
$dir_tmp = '/tmp/raxon/org/Plugin/';
Dir::create($dir_tmp, Dir::CHMOD);