<?php
declare(strict_types=1);

namespace FBS\CoreBundle\Entity\User\Handler;

use FBS\CoreBundle\Entity\User\Command\PasswordChangeCommand;
use FBS\CoreBundle\Exception\ConflictException;
use FBS\CoreBundle\Exception\EntityNotFoundException;
use FBS\CoreBundle\Repository\UserRepository;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;


class PasswordChangeHandler
{
    private UserRepository $userRepository;
    private $passwordEncoder;

    public function __construct(UserRepository $userRepository, UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->userRepository = $userRepository;
        $this->passwordEncoder = $passwordEncoder;
    }

    public function handle(PasswordChangeCommand $command)
    {
        $existingUser = $this->userRepository->find($command->id);
        if (!$existingUser) {
            throw new EntityNotFoundException('User could not be found: ' . $command->id->toString());
        }

        if (!$this->passwordEncoder->isPasswordValid($existingUser, $command->oldPassword)) {
            throw new ConflictException('Password invalid');
        }

        if ($this->passwordEncoder->isPasswordValid($existingUser, $command->newPassword)) {
            throw new ConflictException('New password must be different with old password');
        }

        if ($command->newPassword !== $command->newPasswordConfirm) {
            throw new ConflictException('New password and confirm new password must be the same one');
        }

        $existingUser->setPassword($this->passwordEncoder->encodePassword($existingUser, $command->newPassword));
    }

}