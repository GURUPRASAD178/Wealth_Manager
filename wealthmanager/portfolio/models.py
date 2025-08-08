from django.db import models

# Create your models here.

class Holding(models.Model):
    symbol = models.CharField(max_length=10)
    name = models.CharField(max_length=100)
    quantity = models.IntegerField()
    avg_price = models.FloatField()
    current_price = models.FloatField()
    sector = models.CharField(max_length=50)
    market_cap = models.CharField(max_length=10)

    @property
    def value(self):
        return round(self.quantity * self.current_price, 2)

    @property
    def gain_loss(self):
        return round(self.value - self.quantity * self.avg_price, 2)

    @property
    def gain_loss_percent(self):
        invested = self.quantity * self.avg_price
        return round((self.gain_loss / invested) * 100, 2) if invested else 0
