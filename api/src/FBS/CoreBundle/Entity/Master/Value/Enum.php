<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\Master\Value;

use FBS\CoreBundle\Exception\UndefinedValueException;

class Enum
{
    private $value;
    private static $instances = [];

    final private function __construct(string $value)
    {
        $this->value = $value;
    }

    /**
     * Used to intercept class::CONSTANT() calls
     */
    public static function __callStatic(string $name, array $arguments = [])
    {
        $class = static::class;

        $classConstant = $class . '::' . $name;
        if (!defined($classConstant)) {
            throw new UndefinedValueException('The constant is not defined: ' . $classConstant);
        }

        return self::getInstance($classConstant);
    }

    public static function fromString(string $string)
    {
        $class = static::class;
        $constants = (new \ReflectionClass($class))->getConstants();
        foreach ($constants as $name => $value) {
            if ($string === $value) {
                $classConstant = $class . '::' . $name;

                return self::getInstance($classConstant);
            }
        }

        throw new UndefinedValueException('Invalid value for class: ' . $string . ', ' . $class);
    }

    private static function getInstance(string $classConstant)
    {
        if (!isset(self::$instances[$classConstant])) {
            self::$instances[$classConstant] = new static(constant($classConstant));
        }

        return self::$instances[$classConstant];
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function __toString(): string
    {
        return $this->getValue();
    }
}
