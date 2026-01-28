<?php
namespace Microstorm\Controller;

class Index {

    public function main($config): string
    {
        $latte = new Latte\Engine;
        // cache directory
        $latte->setTempDirectory($config->get('directory.temp') . 'Latte' . DIRECTORY_SEPARATOR);

        $params = [ /* template variables */ ];
        // or $params = new TemplateParameters(/* ... */);

        return $latte->renderToString('template.latte', $params);

    }
}