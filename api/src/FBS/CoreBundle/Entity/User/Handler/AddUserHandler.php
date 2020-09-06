<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\User\Handler;

use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use FBS\CoreBundle\Entity\User\Command\AddUserCommand;
use FBS\CoreBundle\Entity\User\Message\UserAddedMessage;
use FBS\CoreBundle\Entity\User\PasswordResetToken;
use FBS\CoreBundle\Entity\User\User;
use FBS\CoreBundle\Entity\User\UserInfo;
use FBS\CoreBundle\Exception\ConflictException;
use FBS\CoreBundle\Repository\UserRepository;

class AddUserHandler
{
    private UserRepository $userRepository;
    private UserPasswordEncoderInterface $passwordEncoder;
    private MessageBusInterface $messageBus;

    public function __construct(
        UserRepository $userRepository,
        UserPasswordEncoderInterface $passwordEncoder,
        MessageBusInterface $messageBus
    ) {
        $this->userRepository = $userRepository;
        $this->passwordEncoder = $passwordEncoder;
        $this->messageBus = $messageBus;
    }

    public function handle(AddUserCommand $command)
    {
        $existingUser = $this->userRepository->findByEmail($command->email);
        if ($existingUser) {
            throw new ConflictException('User already exists: ' . $command->email->getValue());
        }

        $info = new UserInfo($command->id, $command->firstName, $command->lastName);
        $info->setPhoneNumber($command->phoneNumber);

        $user = new User($command->id, $command->email, $info);
        $user->setPassword($this->passwordEncoder->encodePassword($user, $command->password));
        $user->setRoles($command->roles);
        $token = new PasswordResetToken(null, time() + 172800); // 2 days
        $user->setPasswordResetToken($token);
        $this->userRepository->add($user);


        $this->messageBus->dispatch(new UserAddedMessage($user));
    }
}
