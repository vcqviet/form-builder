<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\User\Command;

use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\HttpFoundation\Request;
use FBS\CoreBundle\Http\ParamConverter\ParamConverterCommandInterface;
use Webmozart\Assert\Assert;

class PasswordGenerateCommand implements ParamConverterCommandInterface
{
    public UuidInterface $id;
    public ?string $password;

    public static function fromRequest(Request $request): self
    {
        $command = new self();
        $params = $request->request;

        $command->id = Uuid::fromString($params->get('id'));
        $command->password = $params->get('password');
        Assert::minLength($command->password, 6, 'New Password must be at least 6 characters');

        return $command;
    }

}