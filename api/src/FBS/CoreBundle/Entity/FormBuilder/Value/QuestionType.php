<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\FormBuilder\Value;

use FBS\CoreBundle\Entity\Master\Value\Enum;

/**
 * @method static QuestionType TYPE_INPUT_TEXT()
 * @method static QuestionType TYPE_INPUT_RADIO()
 * @method static QuestionType TYPE_INPUT_CHECKBOX()
 * @method static QuestionType TYPE_DROPDOWN_BOX()
 * @method static QuestionType TYPE_INPUT_TEXT_AREA()
 */
class QuestionType extends Enum
{
    public const TYPE_INPUT_TEXT = 'TYPE_INPUT_TEXT';
    public const TYPE_INPUT_RADIO = 'TYPE_INPUT_RADIO';
    public const TYPE_INPUT_CHECKBOX = 'TYPE_INPUT_CHECKBOX';
    public const TYPE_DROPDOWN_BOX = 'TYPE_DROPDOWN_BOX';
    public const TYPE_INPUT_TEXT_AREA = 'TYPE_INPUT_TEXT_AREA';
}
