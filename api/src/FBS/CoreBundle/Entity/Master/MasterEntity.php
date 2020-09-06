<?php

namespace FBS\CoreBundle\Entity\Master;

use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use FBS\CoreBundle\Exception\ConflictException;

/**
 *
 * @ORM\MappedSuperclass
 *
 */
abstract class MasterEntity
{
    /**
     * @ORM\Id()
     * @ORM\Column(type="uuid", unique=true)
     */
    private $id;
    public function getId(): UuidInterface
    {
        return $this->id;
    }


    /**
     * @var \DateTimeInterface
     * @ORM\Column(type="datetime")
     */
    private $createdAt;
    public function getCreatedAt(): \DateTimeInterface
    {
        return $this->createdAt;
    }

    /**
     * @var \DateTimeInterface
     * @ORM\Column(type="datetime")
     */
    private $lastUpdatedAt;
    public function getLastUpdatedAt(): \DateTimeInterface
    {
        return $this->lastUpdatedAt;
    }

    public function setLastUpdatedAt(\DateTimeInterface $lastUpdatedAt): void
    {
        $this->lastUpdatedAt = $lastUpdatedAt;
    }

    /**
     * @var bool
     * @ORM\Column(type="boolean")
     */
    private $isDeleted;
    public function isDeleted(): bool
    {
        return $this->isDeleted;
    }
    public function setIsDeleted(bool $isDeleted): void
    {
        $this->isDeleted = $isDeleted;
    }

    /**
     * @var bool
     * @ORM\Column(type="boolean")
     */
    private $isPublished;
    public function isPublished(): bool
    {
        return $this->isPublished;
    }
    public function setIsPublished(bool $isPublished): void
    {
        $this->isPublished = $isPublished;
    }

    /**
     * @ORM\Column(type="string")
     */
    private string $createdBy;
    public function getCreatedBy(): string
    {
        return $this->createdBy;
    }

    /**
     * @ORM\Column(type="string")
     */
    private string $lastUpdatedBy;
    public function getLastUpdatedBy(): string
    {
        return $this->lastUpdatedBy;
    }
    public function setLastUpdatedBy(string $lastUpdatedBy): void
    {
        $this->lastUpdatedBy = $lastUpdatedBy;
    }

    protected function __construct(UuidInterface $id = null)
    {
        $this->id = $id ?? Uuid::uuid4();
        $this->createdBy = 'Annonymouse';
        $this->lastUpdatedBy = 'Annonymouse';
        $this->createdAt = new \DateTimeImmutable();
        $this->lastUpdatedAt = new \DateTimeImmutable();
        $this->isDeleted = false;
        $this->isPublished = true;
    }

    public function delete(UuidInterface $id): void
    {
        if ($this->getId()->equals($id)) {
            $this->setLastUpdatedAt(new \DateTime());
            $this->setIsDeleted(true);
            return;
        }
        throw new ConflictException('Can not delete other Entity');
    }
}
