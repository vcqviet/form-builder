<?php

declare(strict_types=1);

namespace FBS\CoreBundle\EventSubscriber;

use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use FBS\CoreBundle\Http\ApiErrorResponse;

class ExceptionSubscriber implements EventSubscriberInterface
{
    private $appDebug;
    private $logger;

    public function __construct(bool $appDebug = false, LoggerInterface $logger)
    {
        $this->appDebug = $appDebug;
        $this->logger = $logger;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::EXCEPTION => 'handleException',
        ];
    }

    public function handleException(ExceptionEvent $event)
    {
        if ($event->getRequest()->headers->get('Content-Type') !== 'application/json') {
            return;
        }

        $exception = $event->getThrowable();
        $this->logger->error($exception->getMessage(), ['exception' => $exception]);

        $message = ($this->appDebug || $exception instanceof HttpExceptionInterface) ? $exception->getMessage() : 'Something went wrong';
        $code = $exception instanceof HttpExceptionInterface ? $exception->getStatusCode() : ApiErrorResponse::HTTP_INTERNAL_SERVER_ERROR;
        $trace = $this->appDebug ? $exception->getTrace() : null;

        $event->setResponse(new ApiErrorResponse($message, $code, $trace));
    }
}
