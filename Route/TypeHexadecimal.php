<?php
/**
 * @author          Remco van der Velde
 * @since           03-08-2022
 * @copyright       (c) Remco van der Velde
 * @license         MIT
 * @version         1.0
 * @changeLog
 *  -    all
 */

namespace Route;

class TypeHexadecimal {

    public static function validate($string=''): bool
    {
        if(strtolower($string) == 'nan'){
            $string = NAN;
        }
        return ctype_xdigit($string);
    }

}