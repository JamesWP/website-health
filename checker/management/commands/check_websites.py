from django.core.management.base import BaseCommand
import requests

class Command(BaseCommand):
    help = "Polls websites"

    def handle(self, *args, **options):
        # Here you would write your logic to poll websites
        # For example:
        try:
            response = requests.head('http://example.com')
            if response.status_code == 200:
                self.stdout.write(self.style.SUCCESS('Websites are responding'))
            else:
                self.stderr.write(self.style.ERROR(f"Websites are not responding: {response.status_code}"))
        except Exception as e:
            self.stderr.write(self.style.ERROR(str(e)))