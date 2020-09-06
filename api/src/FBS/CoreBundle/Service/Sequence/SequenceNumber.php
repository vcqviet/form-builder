<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Service\Sequence;

use Webmozart\Assert\Assert;

abstract class SequenceNumber
{
    public const MIN = 10000000;
    public const MAX = 99999999;

    private $number;

    public function __construct(int $number = null)
    {
        if ($number) {
            Assert::greaterThanEq($number, self::MIN, 'Invalid sequence number: ' . $number);
            Assert::lessThanEq($number, self::MAX, 'Invalid sequence number: ' . $number);
        }
        $this->number = $number ?: random_int(static::MIN, static::MAX);
    }

    public function getValue(): int
    {
        return $this->number;
    }

    public function __toString(): string
    {
        return (string) $this->getValue();
    }
}
