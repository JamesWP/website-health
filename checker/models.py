from datetime import timedelta
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User



class StatusChoices(models.TextChoices):
    UP = "UP", ("Up")
    DOWN = "DOWN", ("Down")

# Create your models here.
class Website(models.Model):
    url = models.URLField()
    name = models.CharField(max_length=100)
    added_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=4, choices=StatusChoices.choices, default="NONE")
    last_checked = models.DateTimeField()
    last_status_change = models.DateTimeField()

    def __str__(self):
        return f"{self.name} - {self.url}"
    
    def is_up(self):
        return self.status == "UP"



class WebsiteStatusEvent(models.Model):

    website = models.ForeignKey(Website, on_delete=models.CASCADE)

    old_status = models.CharField(max_length=4, choices=StatusChoices.choices)
    new_status = models.CharField(max_length=4, choices=StatusChoices.choices)

    event_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.website} changed from {self.old_status} to {self.new_status}"

class StatusSubscription(models.Model):

    website = models.ForeignKey(Website, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    offline_threshold = models.DurationField(default=timedelta(minutes=10))


    def __str__(self):
        return f"{self.user} subscribed to {self.website} with threshold {self.offline_threshold}"


class StatusCheckerTask(models.Model):
    last_run = models.DateTimeField(auto_now_add=True)


class Notification(models.Model):
    subscription = models.ForeignKey(StatusSubscription, on_delete=models.CASCADE)
    event = models.ForeignKey(WebsiteStatusEvent, on_delete=models.CASCADE)

    def __str__(self):
        return f"Notification for {self.subscription} about event {self.event}"
    

def update_website_status(sender, instance, raw, using, update_fields, **kwargs):
    # get the previous instance of this website to compare statuses with it

    try:
        old_instance = sender.objects.get(id=instance.id)
        old_status = old_instance.status
    except Website.DoesNotExist:
        # we cant add a new event for a website that does not exist yet
        return
    
    # if the statuses are equal, no need to create an event
    # n.b. if the website is new and has no previous instance (old_status will be None), 
    # we consider it as a status change from NONE to NONE
    if old_status == instance.status:
        return

    instance.last_status_change = timezone.now()

    # if the statuses are not equal, create a new event with old and new statuses
    status_change_event = WebsiteStatusEvent.objects.create(
        website=instance,
        old_status=old_status if old_status else StatusChoices.NONE,
        new_status=instance.status,
    )
    status_change_event.save()


models.signals.pre_save.connect(
    update_website_status,
    sender=Website,
    dispatch_uid="create_initial_status_event",
)