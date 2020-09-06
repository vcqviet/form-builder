<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\FormBuilder;

use Doctrine\ORM\Mapping as ORM;
use FBS\CoreBundle\Entity\Master\MasterEntity;
use Ramsey\Uuid\UuidInterface;

/**
 * @ORM\Entity()
 * @ORM\Table(name="options")
 */
class Option extends MasterEntity
{
    /**
     * @ORM\Column(type="string")
     */
    private string $text;
    public function getText(): string
    {
        return $this->text;
    }

    public function setText(string $text = null): void
    {
        $this->text = $text;
    }

    /**
     * @ORM\Column(type="string")
     */
    private string $value;
    public function getValue(): string
    {
        return $this->value;
    }

    public function setValue(string $value): void
    {
        $this->value = $value;
    }

    /**
     * @ORM\ManyToOne(targetEntity="FBS\CoreBundle\Entity\FormBuilder\Question", inversedBy="options")
     * @ORM\JoinColumn(name="question_id", referencedColumnName="id", nullable=false)
     */
    private Question $question;
    public function getQuestion(): Question
    {
        return $this->question;
    }

    public function __construct(UuidInterface $id, Question $question)
    {
        parent::__construct($id);
        $this->question = $question;
    }
}
