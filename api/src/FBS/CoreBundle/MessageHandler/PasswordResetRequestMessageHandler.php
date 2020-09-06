<?php

declare(strict_types=1);

namespace FBS\CoreBundle\MessageHandler;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\RouterInterface;
use FBS\CoreBundle\Entity\User\Message\PasswordResetRequestMessage;
use FBS\CoreBundle\Entity\User\PasswordResetToken;
use Twig\Environment;

class PasswordResetRequestMessageHandler implements MessageHandlerInterface
{
    private MailerInterface $mailer;
    private RouterInterface $router;
    private Environment $twig;

    public function __construct(MailerInterface $mailer, RouterInterface $router, Environment $twig)
    {
        $this->mailer = $mailer;
        $this->router = $router;
        $this->twig = $twig;
    }

    public function __invoke(PasswordResetRequestMessage $message): void
    {
        $email = new Email();
        $email->to($message->email->getValue());
        $email->subject('Password reset');
        $email->html($this->twig->render('admin/mail/passwordReset.html.twig', ['link' => $this->getLink($message->token)]));
        $this->mailer->send($email);
    }

    private function getLink(PasswordResetToken $token): string
    {
        return sprintf(
            '%s://%s%s/password-reset/%s',
            $this->router->getContext()->getScheme(),
            $this->router->getContext()->getHost(),
            $this->router->getContext()->getBaseUrl(),
            $token->getValue()
        );
    }
}
