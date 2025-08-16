from django.urls import path
from .views import record_daily_snapshot
from .views import (
    get_holdings,
    get_allocation,
    get_performance,
    get_summary,
)

urlpatterns = [
    path('portfolio/holdings', get_holdings),
    path('portfolio/allocation', get_allocation),
    path('portfolio/performance', get_performance),
    path('portfolio/summary', get_summary),
    path('snapshot/', record_daily_snapshot, name='record_daily_snapshot'),

]
