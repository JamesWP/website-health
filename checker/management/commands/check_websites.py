from django.core.management.base import BaseCommand
import requests
from ...models import Website, StatusChoices
from django.utils import timezone
from datetime import timedelta
from humanize import naturaltime

class Command(BaseCommand):
    help = "Polls websites"

    def handle(self, *args, **options):
        websites = Website.objects.filter(last_checked__lt=timezone.now() - timedelta(minutes=1))

        for website in websites:
            try:

                last_check_ago = naturaltime(timezone.now() - website.last_checked)
                self.stdout.write(f"Checking {website.url}. last checked {last_check_ago}")
                
                website.last_checked = timezone.now()

                response = requests.head(website.url, allow_redirects=True, timeout=1)

                if response.status_code == 200:
                    self.stdout.write(self.style.SUCCESS('Website is responding'))
                    website.status = StatusChoices.UP
                else:
                    self.stderr.write(self.style.ERROR(f"Websites are not responding: {response.status_code}"))
                    website.status = StatusChoices.DOWN

                website.save()    
            except Exception as e:
                self.stderr.write(self.style.ERROR(str(e)))