<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Http;

use Symfony\Component\HttpFoundation\JsonResponse;

class ApiResponse extends JsonResponse
{
    public function __construct($data = null, int $status = JsonResponse::HTTP_OK, array $headers = [], bool $json = false)
    {
        $responseData = [
            'data' => $data,
            'meta' => null,
        ];

        parent::__construct($responseData, $status, $headers, $json);
    }
}
