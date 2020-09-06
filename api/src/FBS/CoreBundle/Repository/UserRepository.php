<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Repository;

use Doctrine\ORM\QueryBuilder;
use FBS\CoreBundle\Entity\Master\Type\Email;
use FBS\CoreBundle\Entity\User\PasswordResetToken;
use FBS\CoreBundle\Entity\User\User;
use FBS\CoreBundle\Repository\Filter\UserFilter;
use FBS\CoreBundle\Repository\Master\MasterRepository;

/**
 * @method User|null    find($id, $lockMode = null, $lockVersion = null)
 * @method User|null    findOneBy(array $criteria, array $orderBy = null)
 * @method User[]       findAll()
 * @method User[]       findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 * @method void         add($entity)
 */
class UserRepository extends MasterRepository
{
    protected string $entityClass = User::class;
    private function getQueryBuilderForFilter(UserFilter $filter): QueryBuilder
    {
        $qb = $this->getQueryBuilder('u')
            ->leftJoin('u.userInfo', 'i');
        return $qb;
    }
    public function filter(UserFilter $filter): array
    {
        $qb = $this->getQueryBuilderForFilter($filter);
        if (!empty($filter->keyword)) {
            $qb->andWhere('u.email LIKE :keyword OR i.firstName LIKE :keyword OR i.lastName LIKE :keyword')->setParameter('keyword', '%' . $filter->keyword . '%');
        }
        if ($filter->pagination) {
            $qb->setFirstResult(($filter->pagination->getPage() - 1) * $filter->pagination->getLimit())
                ->setMaxResults($filter->pagination->getLimit());
        }
        if (count($filter->roles)) {
            //$qb->andWhere('u.roles IN (:roles)')->setParameter('roles', $filter->roles);
        }
        return $qb->getQuery()->getResult();
    }
    public function findByEmail(Email $email): ?User
    {
        $qb = $this->getQueryBuilder('u');
        $qb->andWhere('u.email = :email');
        $qb->setParameter('email', $email);
        return $qb->getQuery()->getOneOrNullResult();
    }

    public function findByPasswordResetToken(PasswordResetToken $token): ?User
    {
        $qb = $this->getQueryBuilder('u');
        $qb->andWhere('u.passwordResetToken = :token');
        $qb->setParameter('token', $token->getValue());
        return $qb->getQuery()->getOneOrNullResult();
    }
}
