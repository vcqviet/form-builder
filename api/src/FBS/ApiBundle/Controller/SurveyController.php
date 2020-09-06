<?php

declare(strict_types=1);

namespace FBS\ApiBundle\Controller;

use League\Tactician\CommandBus;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use FBS\ApiBundle\Controller\Master\MasterApiController;
use FBS\ApiBundle\Dto\SurveyDto;
use FBS\CoreBundle\Entity\FormBuilder\Command\AddSurveyCommand;
use FBS\CoreBundle\Entity\FormBuilder\Command\DeleteSurveyCommand;
use FBS\CoreBundle\Entity\User\UserRole;
use FBS\CoreBundle\Exception\DomainException;
use FBS\CoreBundle\Http\ApiResponse;
use FBS\CoreBundle\Http\EmptyResponse;
use FBS\CoreBundle\Repository\Filter\SurveyFilter;
use FBS\CoreBundle\Repository\SurveyRepository;

class SurveyController extends MasterApiController
{
    private $surveyRepository;

    public function __construct(
        TokenStorageInterface $tokenStorage,
        AuthorizationCheckerInterface $authorizationChecker,
        CommandBus $commandBus,
        SurveyRepository $surveyRepository,
        TranslatorInterface $translator
    ) {
        $this->surveyRepository = $surveyRepository;
        parent::__construct($tokenStorage, $authorizationChecker, $commandBus, $translator);
    }

    /**
     * @Route("/api/survey/{id}", methods={"GET"})
     */
    public function survey(Uuid $id): ApiResponse
    {
        $survey = $this->surveyRepository->find($id);
        if (!$survey) {
            throw new NotFoundHttpException('Survey not found: ' . $id->toString());
        }

        return new ApiResponse(SurveyDto::fromEntity($survey));
    }

    /**
     * @Route("/api/surveys", methods={"GET"})
     */
    public function surveys(SurveyFilter $filter): ApiResponse
    {
        $this->denyAccessUnlessGrantedOneOf(UserRole::ROLE_ADMIN);
        $surveys = array_map(fn ($i): SurveyDto => SurveyDto::fromEntity($i), $this->surveyRepository->filter($filter));
        return new ApiResponse($surveys);
    }

    /**
     * @Route("/api/survey/{id}", methods={"PATCH"})
     */
    // public function updateSurvey(Uuid $id, UpdateSurveyCommand $command): Response
    // {
    //     $this->denyAccessUnlessGrantedOneOf(SurveyRole::ROLE_USER);

    //     if (!$command->password || $command->password === '') {
    //         $this->denyAccessUnlessGrantedOneOf(SurveyRole::ROLE_ADMIN);
    //     }

    //     if (!$id->equals($command->id)) {
    //         throw new DomainException('Payload does not match resource id');
    //     }
    //     $this->handleCommand($command);
    //     return new EmptyResponse(Response::HTTP_NO_CONTENT);
    // }

    /**
     * @Route("/api/survey/{id}", methods={"PUT"})
     */
    public function addSurvey(Uuid $id, AddSurveyCommand $command): Response
    {
        $this->denyAccessUnlessGrantedOneOf([UserRole::ROLE_ADMIN, UserRole::ROLE_STAFF]);

        if (!$id->equals($command->id)) {
            throw new DomainException('Payload does not match resource id');
        }
        $this->handleCommand($command);
        return new EmptyResponse(Response::HTTP_NO_CONTENT);
    }


    /**
     * @Route("/api/survey/{id}", methods={"DELETE"})
     */
    public function deleteSurvey(Uuid $id): Response
    {
        $this->denyAccessUnlessGrantedOneOf(UserRole::ROLE_ADMIN);

        $this->handleCommand(new DeleteSurveyCommand($id));
        return new EmptyResponse(Response::HTTP_NO_CONTENT);
    }
}
