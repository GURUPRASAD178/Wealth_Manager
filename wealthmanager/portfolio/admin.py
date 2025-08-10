from django.contrib import admin
from .models import Holding

# Register your models here.

@admin.register(Holding)
class HoldingAdmin(admin.ModelAdmin):
    list_display = ('symbol', 'name', 'sector', 'market_cap', 'value', 'quantity')
    search_fields = ('symbol', 'name')
    list_filter = ('sector', 'market_cap')
    list_per_page = 20