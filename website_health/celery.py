from celery import Celery
from celery.schedules import crontab
from django.conf import settings
from django.core import management
import os

# this code copied from manage.py
# set the default Django settings module for the 'celery' app.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'website_health.settings')

# you can change the name here
app = Celery("website_health_celery")

# read config from Django settings, the CELERY namespace would make celery
# config keys has `CELERY` prefix
app.config_from_object('django.conf:settings', namespace='CELERY')

# discover and load tasks.py from from all registered Django apps
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

@app.on_after_configure.connect
def setup_periodic_tasks(sender: Celery, **kwargs):
    # Calls check_websites every 30 seconds
    sender.add_periodic_task(30.0, check_websites.s(), expires=10)

    # Calls check_subscriptions every 30 seconds
    sender.add_periodic_task(30.0, check_subscriptions.s(), expires=10)

@app.task
def check_websites():
    management.call_command('check_websites')

@app.task
def check_subscriptions():
    management.call_command('check_subscriptions')