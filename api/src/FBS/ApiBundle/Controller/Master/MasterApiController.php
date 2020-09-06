<?php

declare(strict_types=1);

namespace FBS\ApiBundle\Controller\Master;

use League\Tactician\CommandBus;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use FBS\CoreBundle\Entity\User\User;
use FBS\CoreBundle\Entity\User\UserRole;
use FBS\CoreBundle\Exception\ConflictException;
use FBS\CoreBundle\Exception\EntityNotFoundException;

abstract class MasterApiController
{
    private TokenStorageInterface $tokenStorage;
    private AuthorizationCheckerInterface $authorizationChecker;
    private ?CommandBus $commandBus;
    private TranslatorInterface $translator;

    public function __construct(
        TokenStorageInterface $tokenStorage,
        AuthorizationCheckerInterface $authorizationChecker,
        CommandBus $commandBus = null,
        TranslatorInterface $translator = null
    ) {
        $this->tokenStorage = $tokenStorage;
        $this->authorizationChecker = $authorizationChecker;
        $this->commandBus = $commandBus;
        $this->translator = $translator;
    }

    protected function __(string $key, array $params = []): ?string
    {
        return $this->translator->trans($key, $params);
    }

    protected function getUser(): ?User
    {
        if (!$this->tokenStorage->getToken()) {

            return null;
        }
        $user = $this->tokenStorage->getToken()->getUser();
        return $user instanceof User ? $user : null;
    }

    protected function denyAccessUnlessGrantedAllOf(array $attributes, $subject = null, string $message = 'Access Denied.'): void
    {
        foreach ($attributes as $attr) {
            if (!$this->authorizationChecker->isGranted($attr, $subject)) {
                throw new AccessDeniedHttpException($message);
            }
        }
    }

    /**
     * @param string|string[] $attributes
     * @param mixed|null $subject
     * @param string $message
     */
    protected function denyAccessUnlessGrantedOneOf($attributes, $subject = null, string $message = 'Access Denied.'): void
    {
        $attributes = is_array($attributes) ? $attributes : [$attributes];

        foreach ($attributes as $attr) {
            if ($this->authorizationChecker->isGranted($attr, $subject)) {
                return;
            }
        }
        throw new AccessDeniedHttpException($message);
    }

    protected function isAdmin()
    {
        return $this->authorizationChecker->isGranted(UserRole::ROLE_ADMIN);
    }

    protected function handleCommand($command)
    {
        if (!$this->commandBus) {
            throw new \RuntimeException('CommandBus has not been injected into controller');
        }
        try {
            $this->commandBus->handle($command);
        } catch (EntityNotFoundException $e) {
            throw new NotFoundHttpException($e->getMessage());
        } catch (ConflictException $e) {
            throw new ConflictHttpException($e->getMessage());
        }
    }
    protected function isCsv(Request $request)
    {
        return $request->headers->get('content-type') === 'text/csv';
    }
}
