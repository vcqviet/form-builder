<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Http\ParamConverter;

use Ramsey\Uuid\Exception\InvalidUuidStringException;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Request\ParamConverter\ParamConverterInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class UuidParamConverter implements ParamConverterInterface
{
    public function apply(Request $request, ParamConverter $configuration): bool
    {
        $argName = $configuration->getName();
        $id = $request->attributes->get($argName);
        try {
            $uuid = Uuid::fromString($id);
        } catch (InvalidUuidStringException $e) {
            throw new BadRequestHttpException('Invalid id: ' . $id);
        }
        $request->attributes->set($argName, $uuid);

        return true;
    }

    public function supports(ParamConverter $configuration): bool
    {
        $ref = new \ReflectionClass($configuration->getClass());

        return $ref->implementsInterface(UuidInterface::class);
    }
}
