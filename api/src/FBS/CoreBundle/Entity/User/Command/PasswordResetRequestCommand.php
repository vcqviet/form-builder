<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\User\Command;


use Symfony\Component\HttpFoundation\Request;
use FBS\CoreBundle\Entity\Master\Type\Email;
use FBS\CoreBundle\Http\ParamConverter\ParamConverterCommandInterface;

class PasswordResetRequestCommand implements ParamConverterCommandInterface
{
    public Email $email;

    public static function fromRequest(Request $request): self
    {
        $command = new self();
        $command->email = new Email($request->get('email'));

        return $command;
    }
}
