<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\FormBuilder\Value;

use FBS\CoreBundle\Entity\Master\Value\Enum;

/**
 * @method static SurveyStatus STATUS_OPEN()
 * @method static SurveyStatus STATUS_CLOSED()
 */
class SurveyStatus extends Enum
{
    public const STATUS_OPEN = 'STATUS_OPEN';
    public const STATUS_CLOSED = 'STATUS_CLOSED';
}
