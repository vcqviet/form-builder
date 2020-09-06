<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\User;

use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use FBS\CoreBundle\Entity\Master\Type\Email;
use FBS\CoreBundle\Entity\Master\MasterEntity;

/**
 * @ORM\Entity(repositoryClass="FBS\CoreBundle\Repository\UserRepository")
 * @ORM\Table(name="users")
 */
class User extends MasterEntity implements UserInterface
{
    /**
     * @ORM\Column(type="email", unique=true)
     */
    private Email $email;
    public function getEmail(): Email
    {
        return $this->email;
    }
    public function setEmail(Email $email): void
    {
        $this->email = $email;
    }

    /**
     * @ORM\Column(type="json")
     */
    private array $roles = [];
    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }
    public function setRoles(array $roles): self
    {
        $this->roles = $roles;
        return $this;
    }
    /**
     * The hashed password
     * @ORM\Column(type="string")
     */
    private string $password;
    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }
    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    /**
     * @ORM\Column(name="password_reset_token", type="string", nullable=true)
     */
    private ?string $passwordResetToken;
    public function setPasswordResetToken(PasswordResetToken $token = null): void
    {
        $this->passwordResetToken = $token ? $token->getValue() : null;
    }

    public function getPasswordResetToken(): ?PasswordResetToken
    {
        return $this->passwordResetToken ? PasswordResetToken::fromString($this->passwordResetToken) : null;
    }

    /**
     * @ORM\OneToOne(targetEntity="FBS\CoreBundle\Entity\User\UserInfo", cascade={"persist"})
     * @ORM\JoinColumn(name="user_info_id", referencedColumnName="id")
     */
    private UserInfo $userInfo;
    public function getUserInfo(): UserInfo
    {
        return $this->userInfo;
    }

    public function __construct(UuidInterface $id, Email $email, UserInfo $userInfo)
    {
        parent::__construct($id);
        $this->email = $email;
        $this->userInfo = $userInfo;
    }


    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email->getValue();
    }


    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
        return null;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }
}
