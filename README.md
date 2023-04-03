# Form Builder System

## Requirement
```
. NodeJs 10.16.3
. Yarn 1.22.5
. Php 7.4.1
. Composer 1.9.0
. MySql 5.7|8.0
```

## Technology
### Back End:
```
PHP Symfony 5
MySQL 5.7 or 8.0
Doctrine ORM 2
RESTful API
JWT for Authenticator
Expandable: micro service, distributed database system
Coding Standard: PSR-2, PHPStan
Testing: PHPSpec
```
### Front End:
```
ReactJs 16.13.1, Function Component and TypeScript
React-Bootstrap and FontAwesome for UI
Testing: cypress
```

## Local setup
### Back End:
```
. After pull code, go to api folder
. copy .env to .env.local
. change config in this file, such as Database, Allow hosting...
. install package by type: $ composer install
. create database: $ php bin/console doctrine:database:create
. migrate database: $ php bin/console doctrine:migration:migrate
. import sample data: $ php bin/console doctrine:fixtures:load
. run: $ php bin/console server:run
```
### Front End:
```
. After pull code, go to app folder
. copy .env to .env.local
. change config in this file, such as hosting, domain, default language...
. install package by type: $ yarn install
. run: $ yarn start
```
## Login
```
login with account:
email: fbs-admin@demo.com
password: demo
```

## Deploy
```
Backend: same as local setup
Frontend: before deploy, we need to build code of frontend.
. build frontend: go to app folder and type: $ yarn build
. Deploy frontend by copy all of folder build into web-server
```

## Online
```
please visit: http://demo.hikazu.com/ (deactived)
login with account:
email: fbs-admin@demo.com
password: demo
```

## Features
```
. User management
. User Role
. Login/Logout
. Reset/Change password
. Survey Form Builder list/create
```

## Liscence
```
This project for home asignment
```
