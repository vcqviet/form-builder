<?php

declare(strict_types=1);

namespace FBS\ApiBundle\Dto;

use FBS\CoreBundle\Entity\FormBuilder\Option;
use FBS\CoreBundle\Entity\FormBuilder\SurveyResponse;
use FBS\CoreBundle\Entity\FormBuilder\SurveyResponseAnswer;

final class OptionDto
{
    public string $id;
    public string $text;
    public string $value;
    public array $question = [];

    public static function fromEntity(Option $option): self
    {
        $dto = new self();
        $dto->id = $option->getId()->toString();
        $dto->text = $option->getText();
        $dto->value = $option->getValue();
        $dto->question = [
            'id' => $option->getQuestion()->getId()->toString(),
            'label' => $option->getQuestion()->getLabel()
        ];
        return $dto;
    }
}
