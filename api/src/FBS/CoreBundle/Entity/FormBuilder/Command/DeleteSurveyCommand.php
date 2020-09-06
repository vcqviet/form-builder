<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\FormBuilder\Command;

use Ramsey\Uuid\UuidInterface;

class DeleteSurveyCommand
{
    public UuidInterface $id;

    public function __construct(UuidInterface $id)
    {
        $this->id = $id;
    }
}
