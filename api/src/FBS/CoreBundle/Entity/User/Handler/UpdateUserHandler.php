<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\User\Handler;

use FBS\CoreBundle\Entity\User\Command\UpdateUserCommand;
use FBS\CoreBundle\Exception\ConflictException;
use FBS\CoreBundle\Exception\EntityNotFoundException;
use FBS\CoreBundle\Repository\UserRepository;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;


class UpdateUserHandler
{
    private UserRepository $userRepository;
    private $passwordEncoder;

    public function __construct(UserRepository $userRepository, UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->userRepository = $userRepository;
        $this->passwordEncoder = $passwordEncoder;
    }

    public function handle(UpdateUserCommand $command)
    {
        $existingUser = $this->userRepository->find($command->id);
        if (!$existingUser) {
            throw new EntityNotFoundException('User could not be found: ' . $command->id->toString());
        }
        if ($command->email->getValue() !== $existingUser->getEmail()->getValue()) {
            $existingEmail = $this->userRepository->findByEmail($command->email);
            if ($existingEmail) {
                throw new ConflictException('The email already exists: ' . $command->email);
            }
        }
        // profile checker here
        if ($command->password && $command->password !== '') {
            if (!$this->passwordEncoder->isPasswordValid($existingUser, $command->password)) {
                throw new ConflictException('Password invalid: ' . $command->email);
            }
        } else {
            $existingUser->setEmail($command->email);
            $existingUser->setRoles($command->roles);
        }
        $existingUser->getUserInfo()->setFirstName($command->firstName);
        $existingUser->getUserInfo()->setLastName($command->lastName);
        $existingUser->getUserInfo()->setPhoneNumber($command->phoneNumber);
    }
}
