from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class IssueConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core_apps.issue"
    verbose_name = _("Issues")
