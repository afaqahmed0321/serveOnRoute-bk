<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.


## Installation

```bash
$ npm install
```
## add .env File
PORT=3000
NODE_ENV=development

JWT_SECRET=example
JWT_SECRET_REFRESH=example
# 60 * 60 * 24 = 86400 => 1 day
JWT_EXPIRY=604800
# 60 * 60 * 24 * 7 = 604800 => 7 days
JWT_REFRESH_EXPIRY=604800

MONGO_URI=mongodb://127.0.0.1:27017/RouteOnDB

STRIPE_SECRET_KEY = example
STRIPE_ACCOUNT = example


REDIS_URL= redis://127.0.0.1:6379

MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=


AWS_ACCESS_KEY = example
AWS_SECRET_KEY = example
AWS_BUCKET = example
AWS_REGION = example

#   CLIENT TWILIO
TWILIO_ACCOUNT_SID = example
TWILIO_AUTH_TOKEN = example
TWILIO_SERVICE_SID = example

# FIREBASE
FIREBASE_PROJECT_ID =example
FIREBASE_PRIVATE_KEY =
FIREBASE_EMAIL =

## Running the app


[Redis]'Before Running the Application, Please run your local Redis Server in development and on Ec2 instance locally! further steps are same as below development part!'

# Deployment
Connect your ec2 client with ssh_client 'bash' or through ec2 dashboard terminal and move into routeon folder and for new changes to deploy, please push your code to gitrepo and pull that from related EC2 instance.
update env manually if any changes happened.

```bash
#for pull code to instance
$ sudo git pull

 #for build and restart pm2 named with routeon. like 
$ npm run build
$ pm2 restart routeon
# for env file updating
$ sudo nano .env # write and save the file
```
Usually Commands for running Server.
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
"ALL DONE--->"
## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
