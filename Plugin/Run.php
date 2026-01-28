<?php
namespace Plugin;

use Exception;
use Plugin;

trait Run {
    /**
     * @throws Exception
     */
    public function run($server, $files, $cookie): void
    {
        $this->config_update($server, $files, $cookie);
        $this->request_configure();
        $this->route_configure();
        $destination = $this->destination();
        d($destination);
    }
}