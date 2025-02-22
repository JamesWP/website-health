from django.contrib import admin
from .models import Website, WebsiteStatusEvent

# Register your models here.

class WebsiteAdmin(admin.ModelAdmin):
    pass

class WebsiteStatusEventAdmin(admin.ModelAdmin):
    pass

admin.site.register(Website, WebsiteAdmin)
admin.site.register(WebsiteStatusEvent, WebsiteStatusEventAdmin)
