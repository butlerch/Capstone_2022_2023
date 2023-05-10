from psycopg2.pool import SimpleConnectionPool
import os
pg_pool = SimpleConnectionPool(5,200,
    host=os.environ.get('DB_HOST'),
    port=os.environ.get('DB_PORT'),
    user=os.environ.get('DB_USER'),
    password=os.environ.get('DB_PASSWORD'),
    database=os.environ.get('DATABASE_NAME'),
    connect_timeout=5
)
