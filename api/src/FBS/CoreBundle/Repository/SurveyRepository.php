<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Repository;

use Doctrine\ORM\QueryBuilder;
use FBS\CoreBundle\Entity\FormBuilder\Survey;
use FBS\CoreBundle\Repository\Filter\SurveyFilter;
use FBS\CoreBundle\Repository\Master\MasterRepository;

/**
 * @method Survey|null    find($id, $lockMode = null, $lockVersion = null)
 * @method Survey|null    findOneBy(array $criteria, array $orderBy = null)
 * @method Survey[]       findAll()
 * @method Survey[]       findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 * @method void           add($entity)
 */
class SurveyRepository extends MasterRepository
{
    protected string $entityClass = Survey::class;
    private function getQueryBuilderForFilter(SurveyFilter $filter): QueryBuilder
    {
        $qb = $this->getQueryBuilder('s');
        return $qb;
    }
    public function filter(SurveyFilter $filter): array
    {
        $qb = $this->getQueryBuilderForFilter($filter);
        if (!empty($filter->keyword)) {
            $qb->andWhere('s.email LIKE :keyword')->setParameter('keyword', '%' . $filter->keyword . '%');
        }
        if ($filter->pagination) {
            $qb->setFirstResult(($filter->pagination->getPage() - 1) * $filter->pagination->getLimit())
                ->setMaxResults($filter->pagination->getLimit());
        }
        return $qb->getQuery()->getResult();
    }
}
