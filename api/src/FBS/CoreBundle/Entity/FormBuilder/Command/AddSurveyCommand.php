<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Entity\FormBuilder\Command;

use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\HttpFoundation\Request;
use FBS\CoreBundle\Entity\Master\Type\Email;
use FBS\CoreBundle\Http\ParamConverter\ParamConverterCommandInterface;
use Webmozart\Assert\Assert;

class AddSurveyCommand implements ParamConverterCommandInterface
{
    public UuidInterface $id;
    public Email $email;
    public string $title;
    public ?string $description;
    public ?string $note;
    public array $questions = [];

    public static function fromRequest(Request $request): self
    {
        $command = new self();
        $params = $request->request;

        $command->id = Uuid::fromString($params->get('id'));
        $command->email = new Email($params->get('email'));
        $command->title = $params->get('title', '');
        $command->description = $params->get('description', '');
        $command->note = $params->get('note', '');
        foreach ($params->get('questions') as $item) {
            $command->questions[] = [
                'id' => $item['id'],
                'label' => $item['label'],
                'type' => $item['type'],
                'note' => $item['note'] ?? '',
                'options' => $item['options']
            ];
        }
        Assert::stringNotEmpty($command->title, 'Title is required');
        //Assert::greaterThanEq(count($command->questions), 1, 'Survey have to contain at least 1 item');
        return $command;
    }
}
