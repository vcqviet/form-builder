<?php

declare(strict_types=1);

namespace FBS\ApiBundle\Dto;

use FBS\CoreBundle\Entity\User\User;

final class UserDto
{
    public string $id;
    public string $email;
    public string $firstName;
    public string $lastName;
    public string $fullName;
    public string $phone;
    public array $roles = [];

    public static function fromEntity(User $user): self
    {
        $dto = new self();
        $dto->id = $user->getId()->toString();
        $dto->email = $user->getEmail()->getValue();
        $dto->firstName = $user->getUserInfo()->getFirstName();
        $dto->lastName = $user->getUserInfo()->getLastName();
        $dto->phone = $user->getUserInfo()->getPhoneNumber();
        $dto->roles = $user->getRoles();
        $dto->fullName = $user->getUserInfo()->getFirstName() . ' ' . $user->getUserInfo()->getLastName();
        return $dto;
    }
}
