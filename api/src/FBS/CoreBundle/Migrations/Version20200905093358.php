<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200905093358 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('
            CREATE TABLE `sessions` (
                `sess_id` VARCHAR(512) NOT NULL PRIMARY KEY,
                `sess_data` BLOB NOT NULL,
                `sess_time` INTEGER UNSIGNED NOT NULL,
                `sess_lifetime` BIGINT NOT NULL
            ) COLLATE utf8_bin, ENGINE = InnoDB;
        ');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs

    }
}
