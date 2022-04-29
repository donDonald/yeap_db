# Licence
This piece of code is [MIT licensed](./LICENSE)

<div align="center">
    <img src="images/license-MIT-blue.svg">
</div>

---

# Intro
Very simple DB access layer.\
Is meant to provide unified access to many databases.\
Databases supported:
* mysql
* postgres

Plus here is has a set of helpers meant for test purpose, i.e. any test can utilize these helpers to create/delete/read/write databases:
* mysql/helpers - helpers for mysql db
* postgres/helpers - helpers for postgres db
* model - unified api for both mysql and postgres(6 mysql tests still fail)

---

# Quick start

### Install mocha test framework
```
$ npm install -g mocha
```

### Run databases
All tests use real databases.\
Prior running tests you shall have postgres and mysql up and running.

#### Run postgres
```
$ git clone https://github.com/donDonald/dev_factory_postgres12.git
$ cd dev_factory_postgres12
$ docker-compose up -d
```

#### Run mysql
```
$ git clone https://github.com/donDonald/dev_factory_mysql.git
$ cd dev_factory_mysql
$ docker-compose up -d
```

### Run unit-test

```
$ cd yeap_db
$ npm install
$ npm test
```

