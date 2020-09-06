<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200906090813 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE survey_response_answers (id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', survey_response_id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', question_id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', created_at DATETIME NOT NULL, last_updated_at DATETIME NOT NULL, is_deleted TINYINT(1) NOT NULL, is_published TINYINT(1) NOT NULL, created_by VARCHAR(255) NOT NULL, last_updated_by VARCHAR(255) NOT NULL, answer LONGTEXT DEFAULT NULL, INDEX IDX_DA76A01F430BF745 (survey_response_id), INDEX IDX_DA76A01F1E27F6BF (question_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE survey_response_answers ADD CONSTRAINT FK_DA76A01F430BF745 FOREIGN KEY (survey_response_id) REFERENCES survey_responses (id)');
        $this->addSql('ALTER TABLE survey_response_answers ADD CONSTRAINT FK_DA76A01F1E27F6BF FOREIGN KEY (question_id) REFERENCES questions (id)');
        $this->addSql('ALTER TABLE survey_responses DROP answer');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE survey_response_answers');
        $this->addSql('ALTER TABLE survey_responses ADD answer LONGTEXT CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`');
    }
}
