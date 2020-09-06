<?php

declare(strict_types=1);

namespace FBS\CoreBundle\EventSubscriber;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Messenger\Event\WorkerMessageReceivedEvent;

class MessengerSubscriber implements EventSubscriberInterface
{
    private $manager;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            WorkerMessageReceivedEvent::class => 'workerMessageReceived',
        ];
    }

    public function workerMessageReceived($event): void
    {
        // long running process will keep stale entities in memory
        // clear manager to make sure they are refreshed from db
        $this->manager->clear();
    }
}
