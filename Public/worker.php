<?php
ignore_user_abort(true);
$app = (object) [
    'time' => (object) [
        'start' => microtime(true)
    ]
];
$handler = static function () use ($app) {
    $app->time->current = microtime(true);
    $app->time->duration = $app->time->current - $app->time->start;
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
$max = 5;
while (frankenphp_handle_request($handler)) {
    $count++;
    if($count >= $max){
        break;
    }
}
exit(0);