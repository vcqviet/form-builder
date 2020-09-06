<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\FormBuilder\Handler;

use FBS\CoreBundle\Entity\FormBuilder\Command\AddSurveyCommand;
use FBS\CoreBundle\Entity\FormBuilder\Option;
use FBS\CoreBundle\Entity\FormBuilder\Question;
use FBS\CoreBundle\Entity\FormBuilder\Survey;
use FBS\CoreBundle\Entity\FormBuilder\Value\QuestionType;
use FBS\CoreBundle\Exception\ConflictException;
use FBS\CoreBundle\Repository\SurveyRepository;
use Ramsey\Uuid\Uuid;

class AddSurveyHandler
{
    private SurveyRepository $surveyRepository;

    public function __construct(SurveyRepository $surveyRepository)
    {
        $this->surveyRepository = $surveyRepository;
    }

    public function handle(AddSurveyCommand $command)
    {
        $existingSurvey = $this->surveyRepository->find($command->id);
        if ($existingSurvey) {
            throw new ConflictException('Survey already exists: ' . $command->id->toString());
        }

        $survey = new Survey($command->id, $command->email, $command->title);

        foreach($command->questions as $item) {
            $question = new Question(Uuid::fromString($item['id']), $survey);
            $question->setLabel($item['label']);
            $question->setType(QuestionType::fromString($item['type']));
            $question->setNote($item['note']);
            foreach($item['options'] as $it) {
                $option = new Option(Uuid::fromString($it['id']), $question);
                $option->setText($it['text']);
                $option->setValue($it['value']);
                $question->addOption($option);
            }
            $survey->addQuestion($question);
        }

        $this->surveyRepository->add($survey);

        // TODO: dispatch message to send email
        // $this->messageBus->dispatch(new SurveyAddedMessage($survey));
    }
}
