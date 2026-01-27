<?php

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
fwrite($shell, "whoami\n");
fwrite($shell, "ls\n");
fwrite($shell, "exit\n");

// Read output from the shell
stream_set_blocking($shell, true); // Wait for output
$output = '';
while ($line = fgets($shell)) {
    $output .= $line;
}

// Close the shell
fclose($shell);

// Display the output
echo "=== SSH Output ===\n";
echo $output;

echo '<h1>Index</h1>';
echo phpinfo();
