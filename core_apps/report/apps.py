from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class ReportConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core_apps.report"
    verbose_name = _("Reports")

    def ready(self) -> None:
        import core_apps.report.signals