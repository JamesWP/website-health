
### Running the Redis server (dev) with Docker:
The redis server is used as a broker for the celery worker and beat scheduler.

You can run it with Docker using this command:
```bash
$ docker run --name some-redis --replace -d -p6379:6379 redis redis-server --save 60 1 --loglevel warning
```

### Running the celery worker and beat scheduler (dev)
The celery worker is used to execute tasks asynchronously, while the celery beat scheduler is used to schedule periodic tasks. 

You can run it with this command:
```bash
$ celery -A website_health worker --beat -l INFO
```

### Running the Django server (dev)
Finally, you can start your django development server using this command:

```bash
$ python manage.py runserver
```