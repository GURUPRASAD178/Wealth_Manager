from django.db import models

# Create your models here.

# class Holding(models.Model):
#     symbol = models.CharField(max_length=10)
#     name = models.CharField(max_length=100)
#     quantity = models.IntegerField()
#     avg_price = models.FloatField()
#     current_price = models.FloatField()
#     sector = models.CharField(max_length=50)
#     market_cap = models.CharField(max_length=10)

#     @property
#     def value(self):
#         return round(self.quantity * self.current_price, 2)

#     @property
#     def gain_loss(self):
#         return round(self.value - self.quantity * self.avg_price, 2)

#     @property
#     def gain_loss_percent(self):
#         invested = self.quantity * self.avg_price
#         return round((self.gain_loss / invested) * 100, 2) if invested else 0


from django.db import models

class Holding(models.Model):
    symbol = models.CharField(max_length=20)
    name = models.CharField(max_length=150)
    quantity = models.IntegerField()
    avg_price = models.FloatField()
    current_price = models.FloatField()
    sector = models.CharField(max_length=50)
    market_cap = models.CharField(max_length=20)
    exchange = models.CharField(max_length=20, blank=True, null=True)
    value_inr = models.FloatField(blank=True, null=True)
    gain_loss_inr = models.FloatField(blank=True, null=True)
    gain_loss_percent = models.FloatField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Calculate values if not explicitly set
        self.value_inr = round(self.quantity * self.current_price, 2)
        self.gain_loss_inr = round(self.value_inr - self.quantity * self.avg_price, 2)
        invested = self.quantity * self.avg_price
        self.gain_loss_percent = round((self.gain_loss_inr / invested) * 100, 4) if invested else 0
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.symbol} - {self.name}"

