<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\User\Message;

use FBS\CoreBundle\Entity\Master\Type\Email;
use FBS\CoreBundle\Entity\User\PasswordResetToken;
use FBS\CoreBundle\Entity\User\User;
use Webmozart\Assert\Assert;

class PasswordResetRequestMessage
{
    public Email $email;
    public PasswordResetToken $token;

    public function __construct(User $user)
    {
        $this->email = $user->getEmail();
        $this->token = $user->getPasswordResetToken();
        Assert::notNull($this->token, 'A password reset token is required to reset a password');
    }
}
