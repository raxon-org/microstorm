<?php
ignore_user_abort(true);
define('MICROSTORM', microtime(true));
$app = require __DIR__ . '/app.php';
$handler = static function () use ($app) {
    $app->refresh();
    // Called when a request is received,
    // superglobals, php://input and the like are reset
    var_dump($app);
    var_dump($_GET);
    var_dump($_POST);
    var_dump($_COOKIE);
    var_dump($_FILES);
    var_dump($_SERVER);
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