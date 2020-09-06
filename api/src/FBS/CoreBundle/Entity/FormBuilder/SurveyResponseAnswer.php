<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\FormBuilder;

use Doctrine\ORM\Mapping as ORM;
use FBS\CoreBundle\Entity\Master\MasterEntity;
use Ramsey\Uuid\UuidInterface;

/**
 * @ORM\Entity()
 * @ORM\Table(name="survey_response_answers")
 */
class SurveyResponseAnswer extends MasterEntity
{
    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private ?string $answer;
    public function getAnswer(): ?string
    {
        return $this->answer;
    }

    public function setAnswer(?string $answer): void
    {
        $this->answer = $answer;
    }


    /**
     * @ORM\ManyToOne(targetEntity="FBS\CoreBundle\Entity\FormBuilder\SurveyResponse", inversedBy="answers")
     * @ORM\JoinColumn(name="survey_response_id", referencedColumnName="id", nullable=false)
     */
    private SurveyResponse $surveyResponse;
    public function getSurveyResponse(): SurveyResponse
    {
        return $this->surveyResponse;
    }

    /**
     * @ORM\ManyToOne(targetEntity="FBS\CoreBundle\Entity\FormBuilder\Question", inversedBy="answers")
     * @ORM\JoinColumn(name="question_id", referencedColumnName="id", nullable=false)
     */
    private Question $question;
    public function getQuestion(): Question
    {
        return $this->question;
    }

    public function __construct(UuidInterface $id, SurveyResponse $surveyResponse, Question $question, ?string $answer = null)
    {
        parent::__construct($id);
        $this->surveyResponse = $surveyResponse;
        $this->question = $question;
        $this->answer = $answer;
    }
}
