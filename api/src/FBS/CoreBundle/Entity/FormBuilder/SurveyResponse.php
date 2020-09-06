<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\FormBuilder;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityNotFoundException;
use Doctrine\ORM\Mapping as ORM;
use FBS\CoreBundle\Entity\Master\MasterEntity;
use FBS\CoreBundle\Entity\Master\Type\Email;
use FBS\CoreBundle\Exception\ConflictException;
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
     * @ORM\ManyToOne(targetEntity="FBS\CoreBundle\Entity\FormBuilder\Survey", inversedBy="surveyResponses")
     * @ORM\JoinColumn(name="survey_id", referencedColumnName="id", nullable=false)
     */
    private Survey $survey;
    public function getSurvey(): Survey
    {
        return $this->survey;
    }

    /**
     * @var SurveyResponseAnswer[]|Collection
     * @ORM\OneToMany(targetEntity="FBS\CoreBundle\Entity\FormBuilder\SurveyResponseAnswer", mappedBy="surveyResponse", cascade={"persist"}, orphanRemoval=true)
     */
    private Collection $answers;
    public function getAnswers(): array
    {
        return array_filter($this->answers->toArray(), fn (SurveyResponseAnswer $item) => !$item->isDeleted());
    }

    public function getAnswer(UuidInterface $id): Question
    {
        foreach ($this->getAnswers() as $item) {
            if ($item->getId()->equals($id)) {
                return $item;
            }
        }
        throw new EntityNotFoundException('Answer does not exist on response: ' . $this->getId()->toString());
    }
    public function addAnswer(SurveyResponseAnswer $answer): void
    {
        if ($answer->getSurveyResponse() !== $this) {
            throw new ConflictException('Answer belongs to another response');
        }
        $this->answers->add($answer);
    }
    public function removeAnswer(SurveyResponseAnswer $answer): void
    {
        if ($this->answers->contains($answer)) {
            $this->answers->removeElement($answer);
        } else {
            throw new EntityNotFoundException('Answer does not exist on response ' . $this->getId()->toString());
        }
    }

    public function __construct(UuidInterface $id, Survey $survey)
    {
        parent::__construct($id);
        $this->survey = $survey;
        $this->answers = new ArrayCollection();
    }
}
