#!/bin/sh
echo "TERM=xterm-256color" >> ~/.bashrc
echo "composer install -n" >> ~/.bashrc
#echo "sysctl -w net.core.rmem_max=7500000" in root system for http3
#echo "sysctl -w net.core.wmem_max=7500000" in root system for http3
echo "frankenphp run --config /Application/Caddyfile &" >> ~/.bashrc
