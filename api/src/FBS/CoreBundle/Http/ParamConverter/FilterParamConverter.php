<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Http\ParamConverter;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Request\ParamConverter\ParamConverterInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class FilterParamConverter implements ParamConverterInterface
{
    public function apply(Request $request, ParamConverter $configuration): bool
    {
        if ($request->query->get('filter')) {
            try {
                $filter = $configuration->getClass()::fromArray(
                    json_decode($request->query->get('filter'), true, 512, JSON_THROW_ON_ERROR)
                );
            } catch (\Exception $e) {
                throw new BadRequestHttpException($e->getMessage());
            }
            $request->attributes->set($configuration->getName(), $filter);
        }

        return true;
    }

    public function supports(ParamConverter $configuration): bool
    {
        $ref = new \ReflectionClass($configuration->getClass());

        return $ref->implementsInterface(ParamConverterFilterInterface::class);
    }
}
