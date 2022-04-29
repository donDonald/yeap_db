
// Database schema
const schema =
'CREATE TABLE IF NOT EXISTS records ( \
    uid                   CHAR(32) PRIMARY KEY, \
    name                  VARCHAR (100) NOT NULL, \
    address               VARCHAR (100) NOT NULL, \
    email                 VARCHAR (100) NOT NULL, \
    stindex               SERIAL, \
    stts                  TIMESTAMP NOT NULL DEFAULT NOW() \
); \
 \
CREATE UNIQUE INDEX IF NOT EXISTS idx_records_uid ON records (uid); \
CREATE UNIQUE INDEX IF NOT EXISTS idx_records_stts ON records (stts);'

require('./query')('postgres', schema);

