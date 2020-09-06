<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Http;

use Symfony\Component\HttpFoundation\Response;

class CsvResponse extends Response
{
    public function __construct($content, int $status = 200, array $headers = [])
    {
        $csv = '';

        foreach ($content as $dto) {
            $flat = $this->flatten(get_object_vars($dto));
            $csv = $csv . join(',', $flat) . PHP_EOL;
        }

        if (isset($flat)) {
            $csv = join(',', array_keys($flat)) . PHP_EOL . $csv;
        }

        parent::__construct($csv, $status, $headers);
        $this->headers->set('Content-Type', 'text/csv');
    }

    private function flatten($array, $prefix = '')
    {
        $result = [];
        foreach ($array as $key => $value) {
            $newKey = $prefix . (empty($prefix) ? '' : '.') . $key;
            if (is_array($value)) {
                $result = array_merge($result, $this->flatten($value, $newKey));
            } else {
                $result[$newKey] = '"' . $value . '"';
            }
        }

        return $result;
    }
}
