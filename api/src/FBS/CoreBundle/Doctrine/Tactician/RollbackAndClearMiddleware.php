<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Doctrine\Tactician;

use Doctrine\ORM\EntityManagerInterface;
use Exception;
use League\Tactician\Middleware;
use Throwable;

class RollbackAndClearMiddleware implements Middleware
{
    private EntityManagerInterface $entityManager;

    /**
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function execute($command, callable $next)
    {
        $this->entityManager->beginTransaction();

        try {
            $returnValue = $next($command);

            $this->entityManager->flush();
            $this->entityManager->commit();
        } catch (Exception $e) {
            $this->entityManager->rollback();
            $this->entityManager->clear();

            throw $e;
        } catch (Throwable $e) {
            $this->entityManager->rollback();
            $this->entityManager->clear();

            throw $e;
        }

        return $returnValue;
    }
}
