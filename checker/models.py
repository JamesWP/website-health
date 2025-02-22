from django.db import models

# Create your models here.
class Website(models.Model):
    url = models.URLField()
    name = models.CharField(max_length = 100)
    added_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.url}"
    
class WebsiteStatusEvent(models.Model):
    class StatusChoices(models.TextChoices):
        UP = 'UP', ('Up')
        DOWN = 'DOWN', ('Down')
        NONE = 'NONE', ('None')

    website = models.ForeignKey(Website, on_delete=models.CASCADE)
    
    old_status = models.CharField(max_length = 4, choices = StatusChoices.choices)
    new_status = models.CharField(max_length = 4, choices = StatusChoices.choices)
    
    event_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.website} changed from {self.old_status} to {self.new_status}"