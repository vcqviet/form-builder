<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Http;

use Symfony\Component\HttpFoundation\Response;

class EmptyResponse extends Response
{
    public function __construct(int $status = Response::HTTP_NO_CONTENT, array $headers = [])
    {
        parent::__construct('', $status, $headers);
    }
}
