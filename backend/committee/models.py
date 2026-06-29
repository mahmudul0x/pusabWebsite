from django.db import models


class EcMember(models.Model):
    """An Executive Committee member for a given session year."""

    name = models.CharField(max_length=150)
    role = models.CharField(max_length=120)  # designation / podobi
    university = models.CharField(max_length=200, blank=True)
    year = models.PositiveIntegerField()  # session
    is_current = models.BooleanField(default=False)
    is_convening = models.BooleanField(default=False)  # founding convening committee (2014)
    photo_url = models.URLField(max_length=600, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-year", "name"]

    def __str__(self):
        return f"{self.name} — {self.role} ({self.year})"


class LeaderMessage(models.Model):
    """A message from a leader (President / General Secretary). One row per role."""

    ROLE_CHOICES = [
        ("president", "President"),
        ("secretary", "General Secretary"),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, unique=True)
    name = models.CharField(max_length=150, blank=True)
    designation = models.CharField(max_length=120, blank=True)  # e.g. "President, PUSAB"
    session = models.CharField(max_length=40, blank=True)  # e.g. "Session 2026"
    photo_url = models.URLField(max_length=600, blank=True)
    quote = models.TextField(blank=True)  # the highlighted pull-quote
    body = models.TextField(blank=True)  # message paragraphs separated by blank lines
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["role"]

    def __str__(self):
        return f"{self.get_role_display()} message — {self.name}"
