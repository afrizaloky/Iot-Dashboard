from rest_framework import serializers

from .models import Sensor
from .models import Slider


class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = '__all__'


class SliderSerializer(serializers.ModelSerializer):
    def update(self, instance, validated_data):
        """
        Update and return an existing `Snippet` instance, given the validated data.
        """
        instance.slider_value = validated_data.get(
            'sliderr_value', instance.slider_value)

        instance.save()
        return instance

    class Meta:
        model = Slider
        fields = '__all__'
