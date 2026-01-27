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

class TypeInteger {

    public static function validate($string=''): bool
    {
        if(empty($string)){
            return false;
        }
        if(is_numeric($string)){
            $value = $string + 0;
            if(is_int($value)){
                return true;
            }
        }
        return false;
    }

    public static function cast($string=''){
        return $string + 0;
    }
}