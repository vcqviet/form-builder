<?php

declare(strict_types=1);

namespace FBS\CoreBundle\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\KernelEvents;

class BeforeActionSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::CONTROLLER => 'decodeJson',
        ];
    }

    public function decodeJson(ControllerEvent $event): void
    {
        $request = $event->getRequest();
        $content = $request->getContent();

        if (!$content || $request->getContentType() !== 'json') {
            return;
        }

        try {
            $data = json_decode($content, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException $e) {
            throw new BadRequestHttpException('Invalid JSON: ' . $e->getMessage());
        }
        $request->request->replace($data);
    }
}
