<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Repository\Filter\Util;

class Sorter
{
    private $column;
    private $ascending;

    public function __construct(string $column, bool $ascending = true)
    {
        if (!preg_match('/[0-9a-zA-Z_]/', $column)) {
            throw new \InvalidArgumentException('Invalid sort field: ' . $column);
        }
        $this->column = $column;
        $this->ascending = $ascending;
    }

    public function getColumn(): string
    {
        return $this->column;
    }

    public function isAscending(): bool
    {
        return $this->ascending;
    }
}
