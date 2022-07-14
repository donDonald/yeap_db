# mysql
mocha --timeout=10000000 ./perormance.mysql.memory.pool.1.1000.js  > "logs/perormance.mysql.memory.pool.1.1000.$(date).log"
mocha --timeout=10000000 ./perormance.mysql.memory.pool.16.1000.js > "logs/perormance.mysql.memory.pool.16.1000.$(date).log"
mocha --timeout=10000000 ./perormance.mysql.memory.pool.64.1000.js > "logs/perormance.mysql.memory.pool.64.1000.$(date).log"

mocha --timeout=10000000 ./perormance.mysql.innodb.no.indexses.pool.1.1000.js  > "logs/perormance.mysql.innodb.no.indexses.pool.1.1000.$(date).log"
mocha --timeout=10000000 ./perormance.mysql.innodb.no.indexses.pool.16.1000.js > "logs/perormance.mysql.innodb.no.indexses.pool.16.1000.$(date).log"
mocha --timeout=10000000 ./perormance.mysql.innodb.no.indexses.pool.64.1000.js > "logs/perormance.mysql.innodb.no.indexses.pool.64.1000.$(date).log"

mocha --timeout=10000000 ./perormance.mysql.innodb.pool.1.1000.js  > "logs/perormance.mysql.innodb.pool.1.1000.$(date).log"
mocha --timeout=10000000 ./perormance.mysql.innodb.pool.16.1000.js > "logs/perormance.mysql.innodb.pool.16.1000.$(date).log"
mocha --timeout=10000000 ./perormance.mysql.innodb.pool.64.1000.js > "logs/perormance.mysql.innodb.pool.64.1000.$(date).log"




# postgres
mocha --timeout=10000000 ./perormance.postgres.pool.1.1000.js  > "logs/perormance.postgres.pool.1.1000.$(date).log"
mocha --timeout=10000000 ./perormance.postgres.pool.16.1000.js > "logs/perormance.postgres.pool.16.1000.$(date).log"
mocha --timeout=10000000 ./perormance.postgres.pool.64.1000.js > "logs/perormance.postgres.pool.64.1000.$(date).log"

mocha --timeout=10000000 ./perormance.postgres.no.indexses.pool.1.1000.js  > "logs/perormance.postgres.no.indexses.pool.1.1000.$(date).log"
mocha --timeout=10000000 ./perormance.postgres.no.indexses.pool.16.1000.js > "logs/perormance.postgres.no.indexses.pool.16.1000.$(date).log"
mocha --timeout=10000000 ./perormance.postgres.no.indexses.pool.64.1000.js > "logs/perormance.postgres.no.indexses.pool.64.1000.$(date).log"
