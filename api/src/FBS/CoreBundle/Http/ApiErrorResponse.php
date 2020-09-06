<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Http;

use Symfony\Component\HttpFoundation\JsonResponse;

class ApiErrorResponse extends JsonResponse
{
    public function __construct(string $message = 'Something went wrong', int $status = 500, array $trace = null)
    {
        $responseData = [
            'code' => $status,
            'message' => $message,
            'trace' => $trace,
        ];
        parent::__construct($responseData, $status, [], false);
    }
}
