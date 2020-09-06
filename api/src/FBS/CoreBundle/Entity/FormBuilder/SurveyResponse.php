<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\FormBuilder;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use FBS\CoreBundle\Entity\FormBuilder\Value\QuestionType;
use FBS\CoreBundle\Entity\Master\MasterEntity;
use FBS\CoreBundle\Entity\Master\Type\Email;
use FBS\CoreBundle\Exception\ConflictException;
use FBS\CoreBundle\Exception\EntityNotFoundException;
use Ramsey\Uuid\UuidInterface;

/**
 * @ORM\Entity()
 * @ORM\Table(name="survey_responses")
 */
class SurveyResponse extends MasterEntity
{
    /**
     * @ORM\Column(type="email")
     */
    private Email $email;
    public function getEmail(): Email
    {
        return $this->email;
    }
    public function setEmail(Email $email): void
    {
        $this->email = $email;
    }

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
     * @ORM\ManyToOne(targetEntity="FBS\CoreBundle\Entity\FormBuilder\Survey", inversedBy="surveyResponses")
     * @ORM\JoinColumn(name="survey_id", referencedColumnName="id", nullable=false)
     */
    private Survey $survey;
    public function getSurvey(): Survey
    {
        return $this->survey;
    }

    

    public function __construct(UuidInterface $id, Survey $survey)
    {
        parent::__construct($id);
        $this->survey = $survey;
    }
}
