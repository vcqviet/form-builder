<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Security\Voter;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\Security;
use FBS\CoreBundle\Entity\User\User;
use FBS\CoreBundle\Entity\User\UserRole;

class UserVoter extends Voter
{
    const VIEW = 'view';

    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    protected function supports($attribute, $subject)
    {
        return ($attribute === self::VIEW && $subject instanceof User);
    }

    protected function voteOnAttribute($attribute, $subject, TokenInterface $token)
    {
        return ($this->security->isGranted(UserRole::ROLE_ADMIN) || $subject === $token->getUser());
    }
}
