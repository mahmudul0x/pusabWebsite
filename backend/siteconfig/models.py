from django.db import models


class SiteSettings(models.Model):
    """Singleton row of editable, site-wide content (contact + org info)."""

    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=40, blank=True)
    members = models.CharField(max_length=40, blank=True)  # e.g. "300+"
    founded = models.CharField(max_length=60, blank=True)  # e.g. "July 30, 2014"
    founded_at = models.CharField(max_length=200, blank=True)
    address = models.CharField(max_length=200, blank=True)
    facebook = models.URLField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site settings"
        verbose_name_plural = "Site settings"

    def save(self, *args, **kwargs):
        self.pk = 1  # enforce a single row
        super().save(*args, **kwargs)

    @classmethod
    def load(cls) -> "SiteSettings":
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Site settings"
