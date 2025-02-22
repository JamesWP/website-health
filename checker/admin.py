from django.contrib import admin
from django import forms
from .models import Website, WebsiteStatusEvent

# Register your models here.

class WebsiteAdmin(admin.ModelAdmin):
    list_display = ('url', 'name', 'added_date', 'status', 'last_checked')

class WebsiteStatusEventAdmin(admin.ModelAdmin):
    list_display = ('website', 'old_status', 'new_status', 'event_date')

admin.site.register(Website, WebsiteAdmin)
admin.site.register(WebsiteStatusEvent, WebsiteStatusEventAdmin)
