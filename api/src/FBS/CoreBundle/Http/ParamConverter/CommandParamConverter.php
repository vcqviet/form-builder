<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Http\ParamConverter;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Request\ParamConverter\ParamConverterInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class CommandParamConverter implements ParamConverterInterface
{
    /**
     * create a Command from the request body implementing: ParamConverterCommandInterface
     */
    public function apply(Request $request, ParamConverter $configuration): bool
    {
        try {
            $command = $configuration->getClass()::fromRequest($request);
        } catch (\Exception $e) {
            throw new BadRequestHttpException($e->getMessage());
        }
        $request->attributes->set($configuration->getName(), $command);

        return true;
    }

    public function supports(ParamConverter $configuration): bool
    {
        $ref = new \ReflectionClass($configuration->getClass());

        return $ref->implementsInterface(ParamConverterCommandInterface::class);
    }
}
