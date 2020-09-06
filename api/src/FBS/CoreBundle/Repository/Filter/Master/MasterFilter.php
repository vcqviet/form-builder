<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Repository\Filter\Master;

use FBS\CoreBundle\Http\ParamConverter\ParamConverterFilterInterface;
use FBS\CoreBundle\Repository\Filter\Pagination;
use FBS\CoreBundle\Repository\Filter\Util\Sorter;

abstract class MasterFilter implements ParamConverterFilterInterface
{
    public string $keyword = '';
    public ?Pagination $pagination;
    /** @var Sorter[] */
    public array $sorts = [];
}
