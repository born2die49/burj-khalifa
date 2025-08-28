from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class ApartmentConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core_apps.apartment"
    verbose_name = _("Apartment")
