from django.db import models


class FelicitationEntry(models.Model):
    """An honouree on the Felicitation & Freshers page — an achiever felicitated
    or a new student welcomed, for a given year."""

    class Category(models.TextChoices):
        ACHIEVER = "achiever", "Achiever (felicitated)"
        FRESHER = "fresher", "Fresher (welcomed)"

    name = models.CharField(max_length=150)
    title = models.CharField(max_length=200, blank=True)  # achievement / institution
    category = models.CharField(
        max_length=10, choices=Category.choices, default=Category.ACHIEVER
    )
    year = models.PositiveIntegerField()
    image_url = models.URLField(max_length=600, blank=True)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-year", "category", "name"]
        verbose_name_plural = "Felicitation entries"

    def __str__(self):
        return f"{self.name} ({self.year})"
