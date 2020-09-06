<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Util;

use \DateTimeImmutable;
use FBS\CoreBundle\Util\Master\MasterUtil;

class FbsDateTime extends MasterUtil
{
    const FORMAT_DATE = 'Y-m-d';
    const FORMAT_DATE_SHOW = 'd-m-Y';
    const HOUR_0 = '00:00:00';
    const HOUR_24 = '23:59:59';

    public function now(): DateTimeImmutable
    {
        return new DateTimeImmutable();
    }

    public function timestamp(): int
    {
        return time();
    }
}
