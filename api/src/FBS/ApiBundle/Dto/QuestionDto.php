<?php

declare(strict_types=1);

namespace FBS\ApiBundle\Dto;

use FBS\CoreBundle\Entity\FormBuilder\Option;
use FBS\CoreBundle\Entity\FormBuilder\Question;
use FBS\CoreBundle\Entity\FormBuilder\Survey;
use FBS\CoreBundle\Entity\FormBuilder\SurveyResponse;
use FBS\CoreBundle\Entity\FormBuilder\SurveyResponseAnswer;

final class QuestionDto
{
    public string $id;
    public string $label;
    public string $type;
    public ?string $note;
    public array $survey = [];
    public array $answers = [];
    public array $options = [];

    public static function fromEntity(Question $question): self
    {
        $dto = new self();
        $dto->id = $question->getId()->toString();
        $dto->label = $question->getLabel();
        $dto->note = $question->getNote();
        $dto->type = $question->getType()->getValue();
        $dto->survey = [
            'id' => $question->getSurvey()->getId()->toString(),
            'title' => $question->getSurvey()->getTitle(),
            'email' => $question->getSurvey()->getEmail()->getValue()
        ];
        $dto->answers = array_map(fn (SurveyResponseAnswer $item) => SurveyResponseAnswerDto::fromEntity($item), $question->getAnswers());
        $dto->options = array_map(fn (Option $item) => OptionDto::fromEntity($item), $question->getOptions());
        return $dto;
    }
}
