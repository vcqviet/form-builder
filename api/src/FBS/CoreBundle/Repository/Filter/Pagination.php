<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Repository\Filter;

class Pagination
{
    public const MAX_RESULTS = 500;
    public const DEFAULT_RESULTS = 100;

    private int $page;
    private int $limit;

    public function __construct(int $page = 1, int $limit = self::DEFAULT_RESULTS)
    {
        if ($page < 1) {
            throw new \InvalidArgumentException('Page cannot be less than 1: ' . $page);
        }
        if ($limit < 1 || $limit > self::MAX_RESULTS) {
            throw new \InvalidArgumentException('Limit must be between 1 and ' . self::MAX_RESULTS . ': ' . $limit);
        }
        $this->page = $page;
        $this->limit = $limit;
    }

    public function getPage(): int
    {
        return $this->page;
    }

    public function getLimit(): int
    {
        return $this->limit;
    }
}
