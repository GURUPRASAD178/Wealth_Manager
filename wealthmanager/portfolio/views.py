from rest_framework.decorators import api_view
from rest_framework.response import Response
from collections import defaultdict
from .models import Holding
from .serializers import HoldingSerializer
from datetime import date
from rest_framework.decorators import api_view
from rest_framework.response import Response
import yfinance as yf
from .models import Holding, HistoricalPerformance

def fetch_price(symbol):
    ticker = yf.Ticker(symbol)
    data = ticker.history(period="1d", interval="1m")
    if not data.empty:
        return round(data['Close'][-1], 2)
    return None

@api_view(['GET'])
def get_performance(request):
    today = date.today()

    # Calculate portfolio value
    holdings = Holding.objects.all()
    portfolio_value = sum(h.quantity * h.current_price for h in holdings)

    # Fetch real-time Nifty50 & Gold
    nifty_value = fetch_price("^NSEI") or 0
    gold_value = fetch_price("GOLDINR=X") or 0

    # Save snapshot if not already stored today
    if not HistoricalPerformance.objects.filter(date=today).exists():
        HistoricalPerformance.objects.create(
            date=today,
            portfolio_value=portfolio_value,
            nifty50_value=nifty_value,
            gold_value=gold_value
        )

    # Prepare timeline for chart
    history = HistoricalPerformance.objects.order_by('date')
    timeline = [
        {
            "date": hp.date.strftime("%Y-%m-%d"),
            "portfolio": hp.portfolio_value,
            "nifty50": hp.nifty50_value,
            "gold": hp.gold_value
        }
        for hp in history
    ]

    # Simple returns calculation
    def calc_return(values):
        if len(values) < 2:
            return {"1month": None, "3months": None, "1year": None}
        first = values[0]
        last = values[-1]
        return_percent = round(((last - first) / first) * 100, 2)
        return {
            "1month": return_percent if len(values) >= 30 else None,
            "3months": return_percent if len(values) >= 90 else None,
            "1year": return_percent if len(values) >= 365 else None
        }

    returns = {
        "portfolio": calc_return([hp.portfolio_value for hp in history]),
        "nifty50": calc_return([hp.nifty50_value for hp in history]),
        "gold": calc_return([hp.gold_value for hp in history])
    }

    return Response({
        "timeline": timeline,
        "returns": returns
    })


from datetime import date
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import HistoricalPerformance, Holding
import yfinance as yf

def fetch_price(symbol):
    try:
        data = yf.download(symbol, period="1d", interval="1d")
        return float(data['Close'].iloc[-1])
    except:
        return None

@api_view(['POST'])
def record_daily_snapshot(request):
    today = date.today()
    if HistoricalPerformance.objects.filter(date=today).exists():
        return Response({"message": "Snapshot already exists"}, status=200)

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
    return Response({"message": "Snapshot recorded successfully"}, status=201)



@api_view(['GET'])
def get_holdings(request):
    holdings = Holding.objects.all()
    serializer = HoldingSerializer(holdings, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_allocation(request):
    holdings = Holding.objects.all()
    by_sector = defaultdict(lambda: {"value": 0, "percentage": 0})
    by_market_cap = defaultdict(lambda: {"value": 0, "percentage": 0})

    total_value = sum(h.value_inr for h in holdings)

    for h in holdings:
        by_sector[h.sector]["value"] += h.value_inr
        by_market_cap[h.market_cap]["value"] += h.value_inr

    for sector in by_sector:
        by_sector[sector]["percentage"] = round((by_sector[sector]["value"] / total_value) * 100, 2)

    for cap in by_market_cap:
        by_market_cap[cap]["percentage"] = round((by_market_cap[cap]["value"] / total_value) * 100, 2)

    return Response({
        "bySector": by_sector,
        "byMarketCap": by_market_cap
    })



@api_view(['GET'])
def get_summary(request):
    holdings = Holding.objects.all()
    total_value = sum(h.value_inr for h in holdings)
    total_invested = sum(h.quantity * h.avg_price for h in holdings)
    total_gain_loss = total_value - total_invested
    total_gain_loss_percent = round((total_gain_loss / total_invested) * 100, 2) if total_invested else 0

    top = max(holdings, key=lambda h: h.gain_loss_percent, default=None)
    worst = min(holdings, key=lambda h: h.gain_loss_percent, default=None)

    return Response({
        "total_value": total_value,
        "total_invested": total_invested,
        "total_gain_loss": total_gain_loss,
        "total_gain_loss_percent": total_gain_loss_percent,
        "topPerformer": {
            "symbol": top.symbol,
            "name": top.name,
            "gainPercent": top.gain_loss_percent
        } if top else None,
        "worstPerformer": {
            "symbol": worst.symbol,
            "name": worst.name,
            "gainPercent": worst.gain_loss_percent
        } if worst else None,
        "diversificationScore": 8.2,  # Hardcode or compute later
        "riskLevel": "Moderate"       # Hardcode or compute later
    })
