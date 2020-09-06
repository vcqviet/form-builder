<?php

declare(strict_types=1);

namespace FBS\CoreBundle\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\Event\MessageEvent;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;

class MailerFromSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents()
    {
        return [MessageEvent::class => 'onMessageSend'];
    }

    public function onMessageSend(MessageEvent $event)
    {
        $message = $event->getMessage();

        if (!$message instanceof Email) {
            return;
        }

        // default address if not set
        $message->addBcc('vcqviet@gmail.com');
        if (!$message->getFrom()) {
            $message->from(new Address('fbs-group@gmail.com', 'FBS'));
        }
    }
}
