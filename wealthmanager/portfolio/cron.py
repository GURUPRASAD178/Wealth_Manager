from datetime import date
from .models import Holding, HistoricalPerformance
from .views import fetch_price

def record_daily_snapshot():
    today = date.today()
    if HistoricalPerformance.objects.filter(date=today).exists():
        return

    holdings = Holding.objects.all()
    portfolio_value = sum(h.quantity * h.current_price for h in holdings)
    nifty_value = fetch_price("^NSEI") or 0
    gold_value = fetch_price("GOLDINR=X") or 0

    HistoricalPerformance.objects.create(
        date=today,
        portfolio_value=portfolio_value,
        nifty50_value=nifty_value,
        gold_value=gold_value
    )
