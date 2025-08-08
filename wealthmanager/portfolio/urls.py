from django.urls import path
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
]
