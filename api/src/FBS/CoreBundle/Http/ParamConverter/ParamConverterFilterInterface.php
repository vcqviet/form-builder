<?php

namespace FBS\CoreBundle\Http\ParamConverter;

interface ParamConverterFilterInterface
{
    public static function fromArray(array $filter);
}
