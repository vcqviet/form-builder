<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\FormBuilder;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use FBS\CoreBundle\Entity\FormBuilder\Value\QuestionType;
use FBS\CoreBundle\Entity\Master\MasterEntity;
use FBS\CoreBundle\Exception\ConflictException;
use FBS\CoreBundle\Exception\EntityNotFoundException;
use Ramsey\Uuid\UuidInterface;

/**
 * @ORM\Entity()
 * @ORM\Table(name="questions")
 */
class Question extends MasterEntity
{
    /**
     * @ORM\Column(type="string")
     */
    private string $label;
    public function getLabel(): string
    {
        return $this->label;
    }

    public function setLabel(string $label = null): void
    {
        $this->label = $label;
    }

    /**
     * @ORM\Column(type="question_type")
     */
    private QuestionType $type;
    public function getType(): QuestionType
    {
        return $this->type;
    }

    public function setType(QuestionType $type): void
    {
        $this->type = $type;
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
     * @ORM\ManyToOne(targetEntity="FBS\CoreBundle\Entity\FormBuilder\Survey", inversedBy="questions")
     * @ORM\JoinColumn(name="survey_id", referencedColumnName="id", nullable=false)
     */
    private Survey $survey;
    public function getSurvey(): Survey
    {
        return $this->survey;
    }

    

    /**
     * @var Option[]|Collection
     * @ORM\OneToMany(targetEntity="FBS\CoreBundle\Entity\FormBuilder\Option", mappedBy="question", cascade={"persist"}, orphanRemoval=true)
     */
    private Collection $options;
    public function getOptions(): array
    {
        return array_filter($this->options->toArray(), fn (Option $item) => !$item->isDeleted());
    }

    public function getOption(UuidInterface $id): Option
    {
        foreach ($this->getOptions() as $item) {
            if ($item->getId()->equals($id)) {
                return $item;
            }
        }
        throw new EntityNotFoundException('Option does not exist on question: ' . $this->getId()->toString());
    }
    public function addOption(Option $option): void
    {
        if ($option->getQuestion() !== $this) {
            throw new ConflictException('Option belongs to another question');
        }
        $this->options->add($option);
    }
    public function removeOption(Option $option): void
    {
        if ($this->options->contains($option)) {
            $this->options->removeElement($option);
            return;
        }
        throw new EntityNotFoundException('Option does not exist on question ' . $this->getId()->toString());
    }

        /**
     * @var SurveyResponseAnswer[]|Collection
     * @ORM\OneToMany(targetEntity="FBS\CoreBundle\Entity\FormBuilder\SurveyResponseAnswer", mappedBy="question", cascade={"persist"}, orphanRemoval=true)
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
        throw new EntityNotFoundException('Answer does not exist on question: ' . $this->getId()->toString());
    }
    public function addAnswer(SurveyResponseAnswer $answer): void
    {
        if ($answer->getQuestion() !== $this) {
            throw new ConflictException('Answer belongs to another question');
        }
        $this->answers->add($answer);
    }
    public function removeAnswer(SurveyResponseAnswer $answer): void
    {
        if ($this->answers->contains($answer)) {
            $this->answers->removeElement($answer);
        } else {
            throw new EntityNotFoundException('Answer does not exist on question ' . $this->getId()->toString());
        }
    }

    public function __construct(UuidInterface $id, Survey $survey)
    {
        parent::__construct($id);
        $this->survey = $survey;
        $this->options = new ArrayCollection();
        $this->answers = new ArrayCollection();
    }
}
