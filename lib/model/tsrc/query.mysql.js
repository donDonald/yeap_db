

// Database schema
const schema =
'CREATE TABLE IF NOT EXISTS records ( \
    uid                   CHAR(32), \
    name                  VARCHAR (100) NOT NULL, \
    address               VARCHAR (100) NOT NULL, \
    email                 VARCHAR (100) NOT NULL, \
    stindex               SERIAL, \
    stts                  TIMESTAMP NOT NULL DEFAULT NOW(), \
    PRIMARY KEY    (uid), \
    INDEX          uid(uid), \
    INDEX          stts(stts) \
);'

require('./query')('mysql', schema);

