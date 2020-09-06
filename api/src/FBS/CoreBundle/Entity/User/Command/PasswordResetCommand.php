<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\User\Command;

use Symfony\Component\HttpFoundation\Request;
use FBS\CoreBundle\Entity\User\PasswordResetToken;
use FBS\CoreBundle\Http\ParamConverter\ParamConverterCommandInterface;
use Webmozart\Assert\Assert;

class PasswordResetCommand implements ParamConverterCommandInterface
{
    public PasswordResetToken $token;
    public string $password;

    public static function fromRequest(Request $request): self
    {
        $command = new self();
        $command->token = PasswordResetToken::fromString($request->request->get('token'));
        $command->password = $request->request->get('password');
        Assert::minLength($command->password, 6, 'Password must be at least 6 characters');

        return $command;
    }
}
