from rest_framework.decorators import api_view
from rest_framework.response import Response
from collections import defaultdict
from .models import Holding
from .serializers import HoldingSerializer
import requests
from datetime import date
from rest_framework.decorators import api_view
from rest_framework.response import Response
from nsepython import nse_index  # NSEPython library
from django.conf import settings

from .models import Holding

def fetch_nifty50_live():
    data = nse_index('NIFTY 50')
    return data.get('lastPrice') if data else None

def fetch_gold_inr():
    url = f"https://metals-api.com/api/gold-price-india?access_key={settings.METALS_API_KEY}&symbols=GOLD"
    resp = requests.get(url)
    if resp.ok:
        data = resp.json()
        return data.get('rates', {}).get('Gold')
    return None

@api_view(['GET'])
def get_performance(request):
    holdings = Holding.objects.all()
    portfolio_value = sum(h.quantity * h.current_price for h in holdings)

    nifty_value = fetch_nifty50_live() or 0
    gold_value = fetch_gold_inr() or 0
    today = date.today().strftime("%Y-%m-%d")

    return Response({
        "timeline": [
            {
                "date": today,
                "portfolio": round(portfolio_value, 2),
                "nifty50": nifty_value,
                "gold": gold_value
            }
        ],
        "returns": {
            "portfolio": {"1month": None, "3months": None, "1year": None},
            "nifty50": {"1month": None, "3months": None, "1year": None},
            "gold": {"1month": None, "3months": None, "1year": None}
        }
    })


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
