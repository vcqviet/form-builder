<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Repository\Master;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\QueryBuilder;
use FBS\CoreBundle\Http\ParamConverter\ParamConverterFilterInterface;

abstract class MasterRepository extends ServiceEntityRepository
{
    protected string $entityClass = '';
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, $this->entityClass);
    }
    public function add($entity)
    {
        $this->getEntityManager()->persist($entity);
    }
    protected function addWhereDeleted(QueryBuilder $qb, string $tblName)
    {
        $qb->andWhere($tblName . '.isDeleted = 0');
    }
    protected function addWherePublished(QueryBuilder $qb, string $tblName)
    {
        $qb->andWhere($tblName . '.isPublished = 1');
    }
    protected function getQueryBuilder(string $tblName): QueryBuilder
    {
        $qb = $this->createQueryBuilder($tblName);
        $this->addWhereDeleted($qb, $tblName);
        $this->addWherePublished($qb, $tblName);
        return $qb;
    }
}
