FROM debian:13.2
WORKDIR /Application

# Update & upgrade
RUN apt-get update && apt-get upgrade -y
RUN apt-get update && apt-get install init bash cron libzip-dev unzip wget nano php -y

# init
COPY ./Docker/Boot/start.php /usr/bin/start
COPY ./Docker/Boot/init /usr/bin/init
RUN chmod +x /usr/bin/init
RUN chmod +x /usr/bin/start

# composer
COPY ./Docker/Packages/composer/composer.phar /usr/bin/composer
RUN chmod +x /usr/bin/composer
RUN chown www-data:www-data /usr/bin/composer
RUN composer self-update

# ffmpeg
#RUN apt-get update && apt-get install ffmpeg -y

RUN apt-get update && apt-get install \
    git -y

COPY . /Application

# Execute start script
RUN chmod +x /Application/start.sh
RUN sh /Application/start.sh
