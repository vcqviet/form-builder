<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\FormBuilder;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use FBS\CoreBundle\Entity\FormBuilder\Value\SurveyStatus;
use Ramsey\Uuid\UuidInterface;
use FBS\CoreBundle\Entity\Master\Type\Email;
use FBS\CoreBundle\Entity\Master\MasterEntity;
use FBS\CoreBundle\Exception\ConflictException;
use FBS\CoreBundle\Exception\EntityNotFoundException;

/**
 * @ORM\Entity()
 * @ORM\Table(name="surveys")
 */
class Survey extends MasterEntity
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
     * @ORM\Column(type="string")
     */
    private string $title;
    public function getTitle(): string
    {
        return $this->title;
    }
    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private ?string $description;
    public function getDescription(): ?string
    {
        return $this->description;
    }
    public function setDescription(?string $description): void
    {
        $this->description = $description;
    }

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private ?string $note;
    public function getNote(): ?string
    {
        return $this->note;
    }
    public function setNote(?string $note): void
    {
        $this->note = $note;
    }

    /**
     * @ORM\Column(type="survey_status")
     */
    private SurveyStatus $status;
    public function getStatus(): SurveyStatus
    {
        return $this->status;
    }

    public function setStatus(SurveyStatus $status): void
    {
        $this->status = $status;
    }
    
    /**
     * @var Question[]|Collection
     * @ORM\OneToMany(targetEntity="FBS\CoreBundle\Entity\FormBuilder\Question", mappedBy="survey", cascade={"persist"}, orphanRemoval=true)
     */
    private Collection $questions;
    public function getQuestions(): array
    {
        return array_filter($this->questions->toArray(), fn (Question $item) => !$item->isDeleted());
    }

    public function getQuestion(UuidInterface $id): Question
    {
        foreach ($this->getQuestions() as $item) {
            if ($item->getId()->equals($id)) {
                return $item;
            }
        }
        throw new EntityNotFoundException('Question does not exist on survey: ' . $this->getId()->toString());
    }
    public function addQuestion(Question $question): void
    {
        if ($question->getSurvey() !== $this) {
            throw new ConflictException('Question belongs to another survey');
        }
        $this->questions->add($question);
    }
    public function removeQuestion(Question $question): void
    {
        if ($this->questions->contains($question)) {
            $this->questions->removeElement($question);
        } else {
            throw new EntityNotFoundException('Question does not exist on survey ' . $this->getId()->toString());
        }
    }


    
    /**
     * @var SurveyResponse[]|Collection
     * @ORM\OneToMany(targetEntity="FBS\CoreBundle\Entity\FormBuilder\SurveyResponse", mappedBy="survey", cascade={"persist"}, orphanRemoval=true)
     */
    private Collection $surveyResponses;
    public function getSurveyResponses(): array
    {
        return array_filter($this->surveyResponses->toArray(), fn (SurveyResponse $item) => !$item->isDeleted());
    }

    public function getSurveyResponse(UuidInterface $id): SurveyResponse
    {
        foreach ($this->getSurveyResponses() as $item) {
            if ($item->getId()->equals($id)) {
                return $item;
            }
        }
        throw new EntityNotFoundException('Survey Response does not exist on survey: ' . $this->getId()->toString());
    }
    public function addSurveyResponse(SurveyResponse $surveyResponse): void
    {
        if ($surveyResponse->getSurvey() !== $this) {
            throw new ConflictException('Survey Response belongs to another survey');
        }
        $this->surveyResponses->add($surveyResponse);
    }
    public function removeSurveyResponse(SurveyResponse $surveyResponse): void
    {
        if ($this->surveyResponses->contains($surveyResponse)) {
            $this->surveyResponses->removeElement($surveyResponse);
        } else {
            throw new EntityNotFoundException('Survey Response does not exist on survey ' . $this->getId()->toString());
        }
    }
    public function __construct(UuidInterface $id, Email $email, string $title)
    {
        parent::__construct($id);
        $this->email = $email;
        $this->title = $title;
        $this->status = SurveyStatus::STATUS_OPEN();
        $this->questions = new ArrayCollection();
        $this->surveyResponses = new ArrayCollection();
    }
}
