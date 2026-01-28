<?php
namespace Plugin;

use Exception;
use Plugin;

trait Run {
    use Plugin\Config;
    /**
     * @throws Exception
     */
    public function run($server, $files, $cookie): void
    {
        $config = $this->config();
        $config->set('server', $server);
        $config->set('files', $files);
        $config->set('cookie', $cookie);
        $config->set('time.current', microtime(true));
        $config->set('time.duration', $config->get('time.current') - $config->get('time.start'));
        $this->config($config);
        $this->request_configure();
        $this->route_configure();
        $destination = $this->destination();
        d($destination);
    }
}