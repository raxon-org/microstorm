#!/bin/sh
echo "TERM=xterm-256color" >> ~/.bashrc
echo "composer install -n" >> ~/.bashrc
echo "frankenphp php-server -r Public/ --domain=workandtravel.world &" >> ~/.bashrc
