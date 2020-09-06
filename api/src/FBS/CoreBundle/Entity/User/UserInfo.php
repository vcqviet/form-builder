<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\User;

use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\UuidInterface;
use FBS\CoreBundle\Entity\Master\MasterEntity;

/**
 * @ORM\Entity()
 * @ORM\Table(name="user_infos")
 */
class UserInfo extends MasterEntity
{
    /**
     * @ORM\Column(type="string")
     */
    private string $firstName;
    public function getFirstName(): string
    {
        return $this->firstName;
    }
    public function setFirstName(string $firstName): void
    {
        $this->firstName = $firstName;
    }

    /**
     * @ORM\Column(type="string")
     */
    private string $lastName;
    public function getLastName(): ?string
    {
        return $this->lastName;
    }
    public function setLastName(string $lastName): void
    {
        $this->lastName = $lastName;
    }

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private ?string $phoneNumber;
    public function getPhoneNumber(): ?string
    {
        return $this->phoneNumber;
    }
    public function setPhoneNumber(string $phoneNumber = null): void
    {
        $this->phoneNumber = $phoneNumber;
    }

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private ?string $notes;
    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(string $notes = null): void
    {
        $this->notes = $notes;
    }

    public function __construct(UuidInterface $id, string $firstName, string $lastName)
    {
        parent::__construct($id);
        $this->firstName = $firstName;
        $this->lastName = $lastName;
    }
    public function getFullName(): ?string
    {
        return $this->getFirstName() . ' ' . $this->getLastName();
    }
}
