export DB_HOST='database-1.cgp3pmph8kno.us-west-2.rds.amazonaws.com' DB_PORT=5432 DB_USER='postgres' DB_PASSWORD='ostate4826' DATABASE_NAME='winedatalakedb' AUTH_DOMAIN='winedatalake.us.auth0.com' AUTH_CLIENT_ID='Nncz6b9skBCCAkyR4AFUyEdct3URx5Kd' AUTH_CLIENT_SECRET='7TuyECcDnsACqDk8E98AVF4PD4Pf9QJ4Bm6q5asgYKOd0FqR1C3t4xoSrwskc9ko' AUTH_ALGORITHMS=["RS256"] AUTH_SCOPE="read:users" API_CLIENT_ID='62cf289f5f2ce59f62d98c31' API_CLIENT_SECRET='YOUR_AUTH0_API_CLIENT_SECRET' API_AUDIENCE='aF3LnZv!&W@CB*@JZhTR8k7ZPT3gBGqvNdGmyJLspA#9T6hLJx59&pvAZ6'
gunicorn -b :8080 --chdir ./server api:app
