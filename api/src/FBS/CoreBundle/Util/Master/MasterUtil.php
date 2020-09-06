<?php

namespace FBS\CoreBundle\Util\Master;

class MasterUtil
{
    private static $prInstance = null;
    public static function instance()
    {
        if (self::$prInstance === null) {
            $class = get_called_class();
            self::$prInstance = new $class();
        }
        return self::$prInstance;
    }
}
