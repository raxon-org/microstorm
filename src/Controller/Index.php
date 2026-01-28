<?php
namespace Microstorm\Controller;

use Latte\Engine;

class Index {

    public function main($config): string
    {
        $latte = new Engine;
        // cache directory
        $latte->setTempDirectory($config->get('directory.temp') . 'Latte' . DIRECTORY_SEPARATOR);

        $host = 'workandtravel.world';
        $port = 22;
        $username = 'remco';
        $password = 'Charlie2020Borne!';

// Attempt SSH connection
        $connection = @ssh2_connect($host, $port);
        if (!$connection) {
            die("❌ Could not connect to $host on port $port\n");
        }

// Authenticate
        if (!@ssh2_auth_password($connection, $username, $password)) {
            die("❌ Authentication failed for user $username\n");
        }

// Open an interactive shell
        $shell = @ssh2_shell($connection, 'xterm');
        if (!$shell) {
            die("❌ Could not open SSH shell\n");
        }

// Send commands to the shell
        fwrite($shell, "echo 'Connected successfully'\n");
        fwrite($shell, "uname -a\n");
        fwrite($shell, '\'hello world!\' >> /tmp/hello.txt' . "\n");
        fwrite($shell, "cat /tmp/hello.txt\n");
        fwrite($shell, "exit\n");

// Read output from the shell
        stream_set_blocking($shell, true); // Wait for output
        $output = '';
        while ($line = fgets($shell)) {
            $output .= $line;
        }
// Close the shell
        fclose($shell);
        /* template variables */
        $params = [
            'shell' => str_replace("\n", "<br>\n", $output)
        ];
        // or $params = new TemplateParameters(/* ... */);

        return $latte->renderToString($config->get('directory.view') .'Index/' . ucfirst(str_replace('_','.',__FUNCTION__)) . '.latte', $params);

    }
}