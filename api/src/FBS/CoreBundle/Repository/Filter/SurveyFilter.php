<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Repository\Filter;

use FBS\CoreBundle\Repository\Filter\Master\MasterFilter;

class SurveyFilter extends MasterFilter
{
    public static function fromArray(array $filter): self
    {
        $selfFilter = new self();
        $selfFilter->keyword = $filter['keyword'] ?? '';
        if (isset($filter['pagination'])) {
            $selfFilter->pagination = new Pagination((int) $filter['pagination']['page'], (int) $filter['pagination']['limit']);
        }

        return $selfFilter;
    }
}
