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
    return Response(
        [ 
        { 
            "symbol": "RELIANCE", 
            "name": "Reliance Industries Ltd", 
            "quantity": 50, 
            "avgPrice": 2450.00, 
            "currentPrice": 2680.50, 
            "sector": "Energy", 
            "marketCap": "Large", 
            "value": 134025.00, 
            "gainLoss": 11525.00, 
            "gainLossPercent": 9.4 
        }, 
        { 
            "symbol": "INFY", 
            "name": "Infosys Limited", 
            "quantity": 100, 
            "avgPrice": 1800.00, 
            "currentPrice": 2010.75, 
            "sector": "Technology", 
            "marketCap": "Large", 
            "value": 201075.00, 
            "gainLoss": 21075.00, 
            "gainLossPercent": 11.7 
        } 
        ] 

    )



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

    return Response(
    { 
        "bySector": { 
            "Technology": { "value": 250000, "percentage": 35.7 }, 
            "Banking": { "value": 180000, "percentage": 25.7 }, 
            "Energy": { "value": 134025, "percentage": 19.1 }, 
            "Healthcare": { "value": 136000, "percentage": 19.4 } 
        }, 
        "byMarketCap": { 
            "Large": { "value": 455000, "percentage": 65.0 }, 
            "Mid": { "value": 175000, "percentage": 25.0 }, 
            "Small": { "value": 70000, "percentage": 10.0 } 
        } 
    }
    )



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

    return Response( 
    { 
        "totalValue": 700000, 
        "totalInvested": 600000, 
        "totalGainLoss": 100000, 
        "totalGainLossPercent": 16.67, 
        "topPerformer": { 
            "symbol": "INFY", 
            "name": "Infosys Limited", 
            "gainPercent": 28.5 
        }, 
        "worstPerformer": { 
            "symbol": "HDFC", 
            "name": "HDFC Bank", 
            "gainPercent": -2.1 
        }, 
        "diversificationScore": 8.2, 
        "riskLevel": "Moderate" 
})
