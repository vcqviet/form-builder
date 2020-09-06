<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\User\Handler;

use FBS\CoreBundle\Entity\User\Command\DeleteUserCommand;
use FBS\CoreBundle\Exception\EntityNotFoundException;
use FBS\CoreBundle\Repository\UserRepository;

class DeleteUserHandler
{
    private UserRepository $userRepository;

    public function __construct(
        UserRepository $userRepository
    ) {
        $this->userRepository = $userRepository;
    }

    public function handle(DeleteUserCommand $command)
    {
        $existingUser = $this->userRepository->find($command->id);
        if (!$existingUser) {
            throw new EntityNotFoundException('User could not be found: ' . $command->id->toString());
        }
        //TODO check business of this user before delete
        $existingUser->delete($command->id);
    }
}
