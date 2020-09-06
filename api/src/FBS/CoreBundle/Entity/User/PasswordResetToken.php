<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\User;

use Webmozart\Assert\Assert;

class PasswordResetToken
{
    private string $token;
    private int $expiry;

    public static function fromString(string $rawToken): self
    {
        $token = explode('.', $rawToken);
        Assert::count($token, 2, 'Invalid reset token');

        return new self((string) $token[0], (int) $token[1]);
    }

    public function __construct(string $token = null, int $expiresAt = null)
    {
        $this->token = $token ?: bin2hex(random_bytes(32));
        $this->expiry = $expiresAt ?: time() + 3600;
    }

    public function getValue(): string
    {
        return $this->token . '.' . $this->expiry;
    }

    public function hasExpired(int $now = null): bool
    {
        $now = $now ?: time();
        return $this->expiry < $now;
    }
}
