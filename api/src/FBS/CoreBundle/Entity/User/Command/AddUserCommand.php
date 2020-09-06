<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\User\Command;

use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\HttpFoundation\Request;
use FBS\CoreBundle\Entity\Master\Type\Email;
use FBS\CoreBundle\Http\ParamConverter\ParamConverterCommandInterface;
use Webmozart\Assert\Assert;

class AddUserCommand implements ParamConverterCommandInterface
{
    public UuidInterface $id;
    public Email $email;
    public string $password;
    public string $firstName;
    public string $lastName;
    public string $phoneNumber;
    public array $roles = [];

    public static function fromRequest(Request $request): self
    {
        $command = new self();
        $params = $request->request;

        $command->id = Uuid::fromString($params->get('id'));
        $command->email = new Email($params->get('email'));
        $command->password = $params->get('password', bin2hex(random_bytes(36)));
        $command->roles = $params->get('roles', []);
        Assert::allStringNotEmpty($command->roles, 'Invalid roles');
        $command->firstName = $params->get('firstName');
        Assert::stringNotEmpty($command->firstName, 'First name is required');
        $command->lastName = $params->get('lastName');
        Assert::stringNotEmpty($command->lastName, 'Last name is required');
        $command->phoneNumber = $params->get('phone');
        Assert::stringNotEmpty($command->phoneNumber, 'Last name is required');

        return $command;
    }
}
