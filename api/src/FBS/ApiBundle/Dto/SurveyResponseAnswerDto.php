<?php

declare(strict_types=1);

namespace FBS\ApiBundle\Dto;

use FBS\CoreBundle\Entity\FormBuilder\SurveyResponseAnswer;

final class SurveyResponseAnswerDto
{
    public string $id;
    public array $surveyResponse = [];
    public array $question = [];
    public string $answer;

    public static function fromEntity(SurveyResponseAnswer $surveyResponseAnswer): self
    {
        $dto = new self();
        $dto->id = $surveyResponseAnswer->getId()->toString();
        $dto->surveyResponse = [
            'id' => $surveyResponseAnswer->getSurveyResponse()->getId()->toString(),
            'email' => $surveyResponseAnswer->getSurveyResponse()->getEmail()->getValue()
        ];
        $dto->question = [
            'id' => $surveyResponseAnswer->getQuestion()->getId()->toString(),
            'label' => $surveyResponseAnswer->getQuestion()->getLabel()
        ];
        $dto->answer = $surveyResponseAnswer->getAnswer();
        return $dto;
    }
}
