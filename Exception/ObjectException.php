<?php
namespace Exception;
use Exception;

class ObjectException extends Exception {


    public function __toString()
    {
        $string = parent::__toString();
        $string .= PHP_EOL;
        $string .= $this->getMessage();

        $string .= PHP_EOL;
        return $string;
    }

}
