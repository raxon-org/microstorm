<?php
$url = '/Application/Boot/Boot';
if(file_exists($url)){
    $read = file($url);
    foreach($read as $line){
        $command = trim($line);
        if(substr($command, 0, 1) === '#'){
            continue;
        }
        if($command){
            shell_exec($command);
        }
    }
}
//keep init process running with pid 1
while(true){
    sleep(1000);
}
