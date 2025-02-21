
### Running the celery beat scheduler (dev)
```bash
$ docker run --name some-redis --replace -d -p6379:6379 redis redis-server --save 60 1 --loglevel warning
```

```bash
$ celery -A website_health worker --beat -l INFO
```
