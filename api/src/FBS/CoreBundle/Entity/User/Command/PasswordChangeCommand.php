<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\User\Command;

use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\HttpFoundation\Request;
use FBS\CoreBundle\Http\ParamConverter\ParamConverterCommandInterface;
use Webmozart\Assert\Assert;

class PasswordChangeCommand implements ParamConverterCommandInterface
{
    public UuidInterface $id;
    public ?string $oldPassword;
    public ?string $newPassword;
    public ?string $newPasswordConfirm;

    public static function fromRequest(Request $request): self
    {
        $command = new self();
        $params = $request->request;

        $command->id = Uuid::fromString($params->get('id'));
        $command->oldPassword = $params->get('oldPassword');
        $command->newPassword = $params->get('newPassword');
        Assert::minLength($command->newPassword, 6, 'New Password must be at least 6 characters');
        $command->newPasswordConfirm = $params->get('newPasswordConfirm');
        Assert::minLength($command->newPasswordConfirm, 6, 'New Password must be at least 6 characters');

        return $command;
    }


}