<?php
ignore_user_abort(true);
define('MICROSTORM', microtime(true));
$app = require __DIR__ . '/app.php';
$handler = static function () use ($app) {
    $app->run($_SERVER, $_FILES, $_COOKIE);
    // Called when a request is received,
    // superglobals, php://input and the like are reset
};
$count = 0;
$max = 5 * 1000; //5K requests and then restart
while (frankenphp_handle_request($handler)) {
    $count++;
    if($count >= $max){
        break;
    }
}
exit(0);