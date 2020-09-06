<?php

namespace FBS\CoreBundle\Http\ParamConverter;

use Symfony\Component\HttpFoundation\Request;

interface ParamConverterCommandInterface
{
    public static function fromRequest(Request $request);
}
