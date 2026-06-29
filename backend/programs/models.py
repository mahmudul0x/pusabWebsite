from django.db import models
from django.utils import timezone


class Program(models.Model):
    """A program/event. Status (upcoming/ongoing/completed) is derived from the
    date and the `ongoing` flag, so it stays correct over time."""

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=60)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    image_url = models.URLField(max_length=600, blank=True)
    # A dated, one-off edition...
    date = models.DateField(null=True, blank=True)
    # ...or an always-on program (e.g. weekly tutoring).
    ongoing = models.BooleanField(default=False)
    recurrence = models.CharField(max_length=120, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    @property
    def status(self) -> str:
        if self.ongoing:
            return "ongoing"
        if self.date and self.date >= timezone.localdate():
            return "upcoming"
        return "completed"

    def __str__(self):
        return self.title
