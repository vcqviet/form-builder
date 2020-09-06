<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\FormBuilder\Handler;

use FBS\CoreBundle\Entity\FormBuilder\Command\DeleteSurveyCommand;
use FBS\CoreBundle\Exception\EntityNotFoundException;
use FBS\CoreBundle\Repository\SurveyRepository;

class DeleteSurveyHandler
{
    private SurveyRepository $surveyRepository;

    public function __construct(SurveyRepository $surveyRepository)
    {
        $this->surveyRepository = $surveyRepository;
    }

    public function handle(DeleteSurveyCommand $command)
    {
        $existingSurvey = $this->surveyRepository->find($command->id);
        if (!$existingSurvey) {
            throw new EntityNotFoundException('Survey could not be found: ' . $command->id->toString());
        }
        //TODO check business of this survey before delete
        $existingSurvey->delete($command->id);
    }
}
