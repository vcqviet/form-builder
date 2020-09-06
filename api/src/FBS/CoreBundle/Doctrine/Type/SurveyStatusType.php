<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Doctrine\Type;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\ConversionException;
use Doctrine\DBAL\Types\Type;
use FBS\CoreBundle\Entity\FormBuilder\Value\SurveyStatus;
use FBS\CoreBundle\Exception\UndefinedValueException;

class SurveyStatusType extends Type
{
    public const NAME = 'survey_status';

    public function getSQLDeclaration(array $fieldDeclaration, AbstractPlatform $platform)
    {
        return $platform->getVarcharTypeDeclarationSQL($fieldDeclaration);
    }

    public function getName()
    {
        return self::NAME;
    }

    public function convertToDatabaseValue($value, AbstractPlatform $platform)
    {
        if (!$value) {
            return null;
        }

        if ($value instanceof SurveyStatus) {
            return $value->getValue();
        }

        try {
            return SurveyStatus::fromString($value)->getValue(); // in case it's a string already
        } catch (UndefinedValueException $e) {
            throw ConversionException::conversionFailed($value, self::NAME);
        }
    }

    public function convertToPHPValue($value, AbstractPlatform $platform)
    {
        if (!$value) {
            return null;
        }

        if ($value instanceof SurveyStatus) {
            return $value;
        }

        try {
            return SurveyStatus::fromString($value);
        } catch (UndefinedValueException $e) {
            throw ConversionException::conversionFailed($value, static::NAME);
        }
    }

    public function requiresSQLCommentHint(AbstractPlatform $platform): bool
    {
        return true;
    }
}
