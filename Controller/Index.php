<?php

namespace Controller;

use Microstorm\Data;
use Microstorm\File;

use Plugin;

class Index
{
    use Plugin\Content;

    public function main(Data $config): string
    {
        $content_type = $this->content_type($config);;

        ddd($content_type);



        $result = File::read($config->get('directory.view') . File::basename(__CLASS__) . '/' . ucfirst(__FUNCTION__) . '.html');
        $default = [
            '__LANGUAGE__' => 'en',
            '__TITLE__' => 'Microstorm',
            '__CONTENT_TYPE__' => 'text/html; charset=UTF-8',
            '__COMPATIBILITY__' => 'IE=edge,chrome=1',
            '__VIEWPORT__' => 'width=device-width, initial-scale=1.0',
            '__DESCRIPTION__' => 'Microstorm is a PHP framework.',
            '__KEYWORDS__' => 'microstorm, php, framework',
            '__AUTHOR__' => 'Remco van der Velde',
            '__REVISIT__AFTER__' => '7 days',
            '__RATING__' => 'general',
            '__DISTRIBUTION__' => 'global',
            '__FAVICON__' => '',
            '__SCRIPT__' => '',
            '__LINK__' => '',
            '__BODY__' => 'Hello World!'
        ];
        foreach($default as $key => $value) {
            $result = str_replace($key, $value, $result);
        }
        return $result;
    }

}