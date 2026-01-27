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

class TypeArray {

    public static function validate($string=''): bool
    {
        if(
            substr($string, 0, 1) == '[' &&
            substr($string, -1, 1) == ']'
        ){
            $array = json_decode($string, true);
            if(is_array($array)){
                return true;
            }
        }
        return false;
    }

    public static function cast($string=''): array
    {
        $array = json_decode($string, true);
        if(is_array($array)){
            return $array;
        }
        return [];
    }
}