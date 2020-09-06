<?php

declare(strict_types=1);

namespace FBS\ApiBundle\Dto;

use FBS\CoreBundle\Entity\FormBuilder\SurveyResponse;
use FBS\CoreBundle\Entity\FormBuilder\SurveyResponseAnswer;

final class SurveyResponseDto
{
    public string $id;
    public string $email;
    public array $survey = [];
    public array $answers = [];

    public static function fromEntity(SurveyResponse $surveyResponse): self
    {
        $dto = new self();
        $dto->id = $surveyResponse->getId()->toString();
        $dto->email = $surveyResponse->getEmail()->getValue();
        $dto->answers = array_map(fn (SurveyResponseAnswer $item) => SurveyResponseAnswerDto::fromEntity($item), $surveyResponse->getAnswers());
        $dto->survey = [
            'id' => $surveyResponse->getSurvey()->getId()->toString(),
            'title' => $surveyResponse->getSurvey()->getTitle(),
            'email' => $surveyResponse->getSurvey()->getEmail()->getValue()
        ];
        return $dto;
    }
}
