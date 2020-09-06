<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\Master\Type;

class Email
{
    // taken from Symfony\Component\Validator\Constraints\Email
    public const PATTERN_HTML5 = '/^[a-zA-Z0-9.!#$%&\'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/';

    private string $email;

    public function __construct(string $email)
    {
        if (!preg_match(self::PATTERN_HTML5, $email)) {
            throw new \InvalidArgumentException('Invalid email: ' . $email);
        }

        $this->email = $email;
    }

    public function getValue(): string
    {
        return $this->email;
    }

    public function __toString(): string
    {
        return $this->getValue();
    }
}
