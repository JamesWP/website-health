from django.contrib import admin
from django import forms
from .models import Website, WebsiteStatusEvent, StatusSubscription, Notification

# Register your models here.

class WebsiteAdmin(admin.ModelAdmin):
    list_display = ('url', 'name', 'added_date', 'status', 'last_checked')

class WebsiteStatusEventAdmin(admin.ModelAdmin):
    list_display = ('website', 'old_status', 'new_status', 'event_date')

class StatusSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('website', 'user', 'offline_threshold')

class NotificationAdmin(admin.ModelAdmin):
    list_display = ('subscription', 'event')

admin.site.register(Website, WebsiteAdmin)
admin.site.register(WebsiteStatusEvent, WebsiteStatusEventAdmin)
admin.site.register(StatusSubscription, StatusSubscriptionAdmin)
admin.site.register(Notification, NotificationAdmin)
