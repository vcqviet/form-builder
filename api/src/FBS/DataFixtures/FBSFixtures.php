<?php

namespace FBS\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use FBS\CoreBundle\Entity\Master\Type\Email;
use FBS\CoreBundle\Entity\User\User;
use FBS\CoreBundle\Entity\User\UserInfo;
use FBS\CoreBundle\Entity\User\UserRole;

class FBSFixtures extends Fixture
{
    private UserPasswordEncoderInterface $passwordEncoder;
    private ObjectManager $manager;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }
    public function load($manager)
    {
        $this->manager = $manager;
        $this->manager->persist($this->createUser(new Email('fbs-admin@demo.com'), [UserRole::ROLE_ADMIN]));
        $this->manager->persist($this->createUser(new Email('fbs-staff@demo.com'), [UserRole::ROLE_STAFF]));
        $this->manager->flush();
    }

    private function createUser(Email $email, array $extraRoles = []): User
    {
        $userInfo = new UserInfo(Uuid::uuid4(), 'form-builder', 'demo');
        $userInfo->setPhoneNumber('0919989274');
        $user = new User(Uuid::uuid4(), $email, $userInfo);
        $user->setPassword($this->passwordEncoder->encodePassword($user, 'demo'));
        $user->setRoles(array_unique(array_merge([UserRole::ROLE_USER], $extraRoles)));
        return $user;
    }
}
