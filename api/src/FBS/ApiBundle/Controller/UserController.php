<?php

declare(strict_types=1);

namespace FBS\ApiBundle\Controller;

use League\Tactician\CommandBus;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use FBS\ApiBundle\Controller\Master\MasterApiController;
use FBS\ApiBundle\Dto\UserDto;
use FBS\CoreBundle\Entity\User\Command\AddUserCommand;
use FBS\CoreBundle\Entity\User\Command\DeleteUserCommand;
use FBS\CoreBundle\Entity\User\Command\PasswordChangeCommand;
use FBS\CoreBundle\Entity\User\Command\PasswordGenerateCommand;
use FBS\CoreBundle\Entity\User\Command\PasswordResetCommand;
use FBS\CoreBundle\Entity\User\Command\PasswordResetRequestCommand;
use FBS\CoreBundle\Entity\User\Command\UpdateUserCommand;
use FBS\CoreBundle\Entity\User\UserRole;
use FBS\CoreBundle\Exception\ConflictException;
use FBS\CoreBundle\Exception\DomainException;
use FBS\CoreBundle\Http\ApiResponse;
use FBS\CoreBundle\Http\EmptyResponse;
use FBS\CoreBundle\Repository\Filter\UserFilter;
use FBS\CoreBundle\Security\Voter\UserVoter;
use FBS\CoreBundle\Repository\UserRepository;

class UserController extends MasterApiController
{
    private $userRepository;

    public function __construct(
        TokenStorageInterface $tokenStorage,
        AuthorizationCheckerInterface $authorizationChecker,
        CommandBus $commandBus,
        UserRepository $userRepository,
        TranslatorInterface $translator
    ) {
        $this->userRepository = $userRepository;
        parent::__construct($tokenStorage, $authorizationChecker, $commandBus, $translator);
    }

    /**
     * @Route("/api/user/me", methods={"GET"})
     */
    public function me(): ApiResponse
    {
        return new ApiResponse(UserDto::fromEntity($this->getUser()));
    }

    /**
     * @Route("/api/user/{id}", methods={"GET"})
     */
    public function user(Uuid $id): ApiResponse
    {
        $user = $this->userRepository->find($id);
        if (!$user) {
            throw new NotFoundHttpException('User not found: ' . $id->toString());
        }

        $this->denyAccessUnlessGrantedOneOf(UserVoter::VIEW, $user);

        return new ApiResponse(UserDto::fromEntity($user));
    }

    /**
     * @Route("/api/users", methods={"GET"})
     */
    public function users(UserFilter $filter): ApiResponse
    {
        $this->denyAccessUnlessGrantedOneOf(UserRole::ROLE_ADMIN);
        $users = array_map(fn ($i): UserDto => UserDto::fromEntity($i), $this->userRepository->filter($filter));
        return new ApiResponse($users);
    }

    /**
     * @Route("/api/user/{id}", methods={"PATCH"})
     */
    public function updateUser(Uuid $id, UpdateUserCommand $command): Response
    {
        $this->denyAccessUnlessGrantedOneOf(UserRole::ROLE_USER);

        if (!$command->password || $command->password === '') {
            $this->denyAccessUnlessGrantedOneOf(UserRole::ROLE_ADMIN);
        }

        if (!$id->equals($command->id)) {
            throw new DomainException('Payload does not match resource id');
        }
        $this->handleCommand($command);
        return new EmptyResponse(Response::HTTP_NO_CONTENT);
    }

    /**
     * @Route("/api/user/{id}", methods={"PUT"})
     */
    public function addUser(Uuid $id, AddUserCommand $command): Response
    {
        $this->denyAccessUnlessGrantedOneOf(UserRole::ROLE_ADMIN);

        if (!$id->equals($command->id)) {
            throw new DomainException('Payload does not match resource id');
        }
        $this->handleCommand($command);
        return new EmptyResponse(Response::HTTP_NO_CONTENT);
    }

    /**
     * @Route("/api/password-reset-request", methods={"POST"})
     */
    public function passwordResetRequest(PasswordResetRequestCommand $command): EmptyResponse
    {
        try {
            $this->handleCommand($command);
        } catch (NotFoundHttpException $e) {
            // email doesn't exist, just fail silently
        }

        return new EmptyResponse();
    }

    /**
     * @Route("/api/password-reset", methods={"GET","POST"})
     */
    public function passwordReset(PasswordResetCommand $command): EmptyResponse
    {

        $this->handleCommand($command);

        return new EmptyResponse();
    }

    /**
     * @Route("/api/user/{id}", methods={"DELETE"})
     */
    public function deleteUser(Uuid $id): Response
    {
        $this->denyAccessUnlessGrantedOneOf(UserRole::ROLE_ADMIN);

        $this->handleCommand(new DeleteUserCommand($id));
        return new EmptyResponse(Response::HTTP_NO_CONTENT);
    }

    /**
     * @Route("/api/user/{id}/change-password", methods={"PATCH"})
     */
    public function changePassword(Uuid $id, PasswordChangeCommand $command): Response
    {
        $this->denyAccessUnlessGrantedOneOf(UserRole::ROLE_USER);

        // if send id is not current login user
        if (!$id->equals($this->getUser()->getId()) || !$id->equals($command->id)) {
            throw new DomainException('Payload does not match resource id');
        }
        $this->handleCommand($command);
        return new EmptyResponse(Response::HTTP_NO_CONTENT);
    }

    /**
     * @Route("/api/user/{id}/generate-password", methods={"PATCH"})
     */
    public function generatePassword(Uuid $id, PasswordGenerateCommand $command): Response
    {
        $this->denyAccessUnlessGrantedOneOf(UserRole::ROLE_ADMIN);

        if (!$id->equals($command->id)) {
            throw new DomainException('Payload does not match resource id');
        }

        // Cannot generate your own password
        if($id->equals($this->getUser()->getId())) {
            throw new ConflictException('Cannot generate your own password');
        }

        $this->handleCommand($command);
        return new EmptyResponse(Response::HTTP_NO_CONTENT);
    }
}
