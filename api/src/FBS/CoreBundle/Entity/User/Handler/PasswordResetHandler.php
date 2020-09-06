<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\User\Handler;

use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use FBS\CoreBundle\Entity\User\Command\PasswordResetCommand;
use FBS\CoreBundle\Exception\DomainException;
use FBS\CoreBundle\Exception\EntityNotFoundException;
use FBS\CoreBundle\Repository\UserRepository;

class PasswordResetHandler
{
    private UserRepository $userRepository;
    private UserPasswordEncoderInterface $passwordEncoder;

    public function __construct(UserRepository $userRepository, UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->userRepository = $userRepository;
        $this->passwordEncoder = $passwordEncoder;
    }

    public function handle(PasswordResetCommand $command)
    {
        $user = $this->userRepository->findByPasswordResetToken($command->token);
        if (!$user) {
            throw new EntityNotFoundException('The token was not found');
        }

        if (!$user->getPasswordResetToken() || $user->getPasswordResetToken()->hasExpired()) {
            throw new DomainException('The token has expired');
        }

        $user->setPassword($this->passwordEncoder->encodePassword($user, $command->password));
        $user->setPasswordResetToken(null);
    }
}
