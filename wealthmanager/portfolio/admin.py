from django.contrib import admin
from .models import Holding

# Register your models here.

@admin.register(Holding)
class HoldingAdmin(admin.ModelAdmin):
    list_display = ('symbol', 'name', 'quantity', 'avg_price', 'value_inr', 'gain_loss_inr', 'gain_loss_percent')
    search_fields = ('symbol', 'name')
    list_filter = ('sector', 'market_cap')
    list_per_page = 20