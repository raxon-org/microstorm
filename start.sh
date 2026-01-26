#!/bin/sh
echo "TERM=xterm-256color" >> ~/.bashrc
echo "composer install -n" >> ~/.bashrc
echo "sysctl -w net.core.rmem_max=7500000"
echo "sysctl -w net.core.wmem_max=7500000"
echo "frankenphp php-server -r Public/ --domain=localhost &" >> ~/.bashrc
