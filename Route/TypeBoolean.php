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

class TypeBoolean {

    public static function validate($string=''): bool
    {
        if(strtolower($string) === 'true'){
            return true;
        }
        elseif(strtolower($string) === 'false'){
            return true;
        }
        return false;
    }

}