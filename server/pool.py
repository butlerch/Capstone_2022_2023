from psycopg2.pool import SimpleConnectionPool
import os
pg_pool = SimpleConnectionPool(5,200,
    host='www.ryanstone.cn',
    port=5432,
    user='postgres',
    password='qwert1234',
    database='postgres'
)
