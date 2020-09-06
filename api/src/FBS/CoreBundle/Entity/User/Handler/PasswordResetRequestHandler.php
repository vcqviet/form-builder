<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\User\Handler;

use Symfony\Component\Messenger\MessageBusInterface;
use FBS\CoreBundle\Entity\User\Command\PasswordResetRequestCommand;
use FBS\CoreBundle\Entity\User\Message\PasswordResetRequestMessage;
use FBS\CoreBundle\Entity\User\PasswordResetToken;
use FBS\CoreBundle\Exception\EntityNotFoundException;
use FBS\CoreBundle\Repository\UserRepository;

class PasswordResetRequestHandler
{
    private MessageBusInterface $messageBus;
    private UserRepository $userRepository;

    public function __construct(MessageBusInterface $messageBus, UserRepository $userRepository)
    {
        $this->messageBus = $messageBus;
        $this->userRepository = $userRepository;
    }

    public function handle(PasswordResetRequestCommand $command)
    {
        $user = $this->userRepository->findByEmail($command->email);
        if (!$user) {
            throw new EntityNotFoundException('The email could not be found: ' . $command->email);
        }

        $token = new PasswordResetToken();
        $user->setPasswordResetToken($token);
        $this->messageBus->dispatch(new PasswordResetRequestMessage($user));
    }
}
