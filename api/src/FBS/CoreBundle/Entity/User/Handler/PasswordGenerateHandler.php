<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\User\Handler;

use FBS\CoreBundle\Entity\User\Command\PasswordGenerateCommand;
use FBS\CoreBundle\Exception\ConflictException;
use FBS\CoreBundle\Exception\EntityNotFoundException;
use FBS\CoreBundle\Repository\UserRepository;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;


class PasswordGenerateHandler
{
    private UserRepository $userRepository;
    private $passwordEncoder;

    public function __construct(UserRepository $userRepository, UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->userRepository = $userRepository;
        $this->passwordEncoder = $passwordEncoder;
    }

    public function handle(PasswordGenerateCommand $command)
    {
        $existingUser = $this->userRepository->find($command->id);
        if (!$existingUser) {
            throw new EntityNotFoundException('User could not be found: ' . $command->id->toString());
        }

        if ($this->passwordEncoder->isPasswordValid($existingUser, $command->password)) {
            throw new ConflictException('New password must be different with old password');
        }

        $existingUser->setPassword($this->passwordEncoder->encodePassword($existingUser, $command->password));
    }

}