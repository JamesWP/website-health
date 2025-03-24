from django.core.management.base import BaseCommand
from ...models import StatusSubscription, StatusCheckerTask, Notification, WebsiteStatusEvent, StatusChoices
import datetime
from django.utils import timezone
from humanize import naturaltime

class Command(BaseCommand):
    help = "Check to see if any websites have gone down and send a notification."

    def handle(self, *args, **options):
        # find all subscriptions, for each subscription check the status of the website.
        subs = StatusSubscription.objects.select_related("website").all()

        # get last time the status check was run
        last_check = StatusCheckerTask.objects.order_by("-last_run").first()
        if not last_check or not last_check.last_run:
            last_check = StatusCheckerTask.objects.create(last_run=timezone.now())
            last_check.save()
         
        last_check_time = last_check.last_run

        # get current time
        current_time = timezone.now()

        last_check_ago = naturaltime(timezone.now() - last_check_time)
        self.stdout.write(f"Subscriptions last checked {last_check_ago}")

        def notification_in_window(notification_time):
            return last_check_time < notification_time <= current_time

        for s in subs:
            website = s.website

            # check if website is down
            if website.is_up():
                continue

            # calculate the notification time
            notification_time = website.last_status_change + s.offline_threshold

            if not notification_in_window(notification_time):
                notification_time_at = naturaltime(timezone.now() - notification_time)
                self.stdout.write(self.style.SUCCESS(str(f"Subscription for website {website} is down. Notification: {notification_time_at}")))
                continue

            # get last status change event for this website
            event = WebsiteStatusEvent.objects.filter(website = website).order_by("event_date").first()
            if not event:
                self.stderr.write(self.style.ERROR(str(f"No status change events for website {website}.")))
                continue

            if event.new_status != StatusChoices.DOWN.value:
                self.stderr.write(self.style.ERROR(str(f"Website {website} is not down. {event}")))
                continue

            # send a notification to user
            notification = Notification.objects.create(subscription = s, event = event)

            notification.save()

            self.stdout.write(self.style.SUCCESS(str(f"Sent notification for down website {website} to user {s.user}.")))

        # update last check
        last_check.last_run = timezone.now()
        last_check.save()