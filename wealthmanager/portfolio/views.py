from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Holding
from .serializers import HoldingSerializer

@api_view(['GET'])
def get_holdings(request):
    holdings = Holding.objects.all()
    serializer = HoldingSerializer(holdings, many=True)
    return Response(serializer.data)



from collections import defaultdict
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Holding

@api_view(['GET'])
def get_allocation(request):
    holdings = Holding.objects.all()
    by_sector = defaultdict(lambda: {"value": 0, "percentage": 0})
    by_market_cap = defaultdict(lambda: {"value": 0, "percentage": 0})

    total_value = sum(h.value for h in holdings)

    for h in holdings:
        by_sector[h.sector]["value"] += h.value
        by_market_cap[h.market_cap]["value"] += h.value

    # Compute percentages
    for sector in by_sector:
        by_sector[sector]["percentage"] = round((by_sector[sector]["value"] / total_value) * 100, 2)

    for cap in by_market_cap:
        by_market_cap[cap]["percentage"] = round((by_market_cap[cap]["value"] / total_value) * 100, 2)

    return Response({
        "bySector": by_sector,
        "byMarketCap": by_market_cap
    })



@api_view(['GET'])
def get_performance(request):
    return Response({
        "timeline": [
            {
                "date": "2024-01-01",
                "portfolio": 650000,
                "nifty50": 21000,
                "gold": 62000
            },
            {
                "date": "2024-03-01",
                "portfolio": 680000,
                "nifty50": 22100,
                "gold": 64500
            },
            {
                "date": "2024-06-01",
                "portfolio": 700000,
                "nifty50": 23500,
                "gold": 68000
            }
        ],
        "returns": {
            "portfolio": { "1month": 2.3, "3months": 8.1, "1year": 15.7 },
            "nifty50": { "1month": 1.8, "3months": 6.2, "1year": 12.4 },
            "gold": { "1month": -0.5, "3months": 4.1, "1year": 8.9 }
        }
    })



@api_view(['GET'])
def get_summary(request):
    holdings = Holding.objects.all()
    total_value = sum(h.value for h in holdings)
    total_invested = sum(h.quantity * h.avg_price for h in holdings)
    total_gain_loss = total_value - total_invested
    total_gain_loss_percent = round((total_gain_loss / total_invested) * 100, 2) if total_invested else 0

    top = max(holdings, key=lambda h: h.gain_loss_percent, default=None)
    worst = min(holdings, key=lambda h: h.gain_loss_percent, default=None)

    return Response({
        "totalValue": round(total_value, 2),
        "totalInvested": round(total_invested, 2),
        "totalGainLoss": round(total_gain_loss, 2),
        "totalGainLossPercent": total_gain_loss_percent,
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
        "diversificationScore": 8.2,  # Hardcoded
        "riskLevel": "Moderate"       # Hardcoded
    })
