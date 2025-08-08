from rest_framework import serializers
from .models import Holding

class HoldingSerializer(serializers.ModelSerializer):
    value = serializers.FloatField()
    gain_loss = serializers.FloatField()
    gain_loss_percent = serializers.FloatField()

    class Meta:
        model = Holding
        fields = '__all__'
