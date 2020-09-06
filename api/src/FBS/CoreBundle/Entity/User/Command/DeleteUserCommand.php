<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\User\Command;

use Ramsey\Uuid\UuidInterface;

class DeleteUserCommand
{
    public UuidInterface $id;

    public function __construct(UuidInterface $id)
    {
        $this->id = $id;
    }
}
