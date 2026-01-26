#!/bin/sh
echo "TERM=xterm-256color" >> ~/.bashrc
echo "composer install -n" >> ~/.bashrc
echo "frankenphp php-server -c Caddyfile -r Public/ &" >> ~/.bashrc
