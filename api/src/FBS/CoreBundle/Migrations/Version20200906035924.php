<?php

declare(strict_types=1);

namespace FBS\CoreBundle\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200906035924 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE options (id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', question_id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', created_at DATETIME NOT NULL, last_updated_at DATETIME NOT NULL, is_deleted TINYINT(1) NOT NULL, is_published TINYINT(1) NOT NULL, created_by VARCHAR(255) NOT NULL, last_updated_by VARCHAR(255) NOT NULL, text VARCHAR(255) NOT NULL, value VARCHAR(255) NOT NULL, INDEX IDX_D035FA871E27F6BF (question_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE questions (id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', survey_id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', created_at DATETIME NOT NULL, last_updated_at DATETIME NOT NULL, is_deleted TINYINT(1) NOT NULL, is_published TINYINT(1) NOT NULL, created_by VARCHAR(255) NOT NULL, last_updated_by VARCHAR(255) NOT NULL, label VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL COMMENT \'(DC2Type:question_type)\', note LONGTEXT DEFAULT NULL, INDEX IDX_8ADC54D5B3FE509D (survey_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE surveys (id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', created_at DATETIME NOT NULL, last_updated_at DATETIME NOT NULL, is_deleted TINYINT(1) NOT NULL, is_published TINYINT(1) NOT NULL, created_by VARCHAR(255) NOT NULL, last_updated_by VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL COMMENT \'(DC2Type:email)\', title VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, note LONGTEXT DEFAULT NULL, status VARCHAR(255) NOT NULL COMMENT \'(DC2Type:survey_status)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE survey_responses (id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', survey_id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', created_at DATETIME NOT NULL, last_updated_at DATETIME NOT NULL, is_deleted TINYINT(1) NOT NULL, is_published TINYINT(1) NOT NULL, created_by VARCHAR(255) NOT NULL, last_updated_by VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL COMMENT \'(DC2Type:email)\', answer LONGTEXT DEFAULT NULL, INDEX IDX_9409DDB9B3FE509D (survey_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE options ADD CONSTRAINT FK_D035FA871E27F6BF FOREIGN KEY (question_id) REFERENCES questions (id)');
        $this->addSql('ALTER TABLE questions ADD CONSTRAINT FK_8ADC54D5B3FE509D FOREIGN KEY (survey_id) REFERENCES surveys (id)');
        $this->addSql('ALTER TABLE survey_responses ADD CONSTRAINT FK_9409DDB9B3FE509D FOREIGN KEY (survey_id) REFERENCES surveys (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE options DROP FOREIGN KEY FK_D035FA871E27F6BF');
        $this->addSql('ALTER TABLE questions DROP FOREIGN KEY FK_8ADC54D5B3FE509D');
        $this->addSql('ALTER TABLE survey_responses DROP FOREIGN KEY FK_9409DDB9B3FE509D');
        $this->addSql('DROP TABLE options');
        $this->addSql('DROP TABLE questions');
        $this->addSql('DROP TABLE surveys');
        $this->addSql('DROP TABLE survey_responses');
    }
}
