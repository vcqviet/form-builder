<?php

declare(strict_types=1);

namespace FBS\ApiBundle\Dto;

use FBS\CoreBundle\Entity\FormBuilder\Survey;
use FBS\CoreBundle\Entity\FormBuilder\SurveyResponse;

final class SurveyDto
{
    public string $id;
    public string $email;
    public string $title;
    public ?string $description;
    public ?string $note;
    public string $status;
    public array $questions = [];
    public array $surveyResponses = [];

    public static function fromEntity(Survey $survey): self
    {
        $dto = new self();
        $dto->id = $survey->getId()->toString();
        $dto->email = $survey->getEmail()->getValue();
        $dto->title = $survey->getTitle();
        $dto->description = $survey->getDescription();
        $dto->note = $survey->getNote();
        $dto->questions = $survey->getQuestions();
        $dto->surveyResponses = array_map(fn (SurveyResponse $item) => SurveyResponseDto::fromEntity($item), $survey->getSurveyResponses());
        $dto->status = $survey->getStatus()->getValue();
        return $dto;
    }
}
