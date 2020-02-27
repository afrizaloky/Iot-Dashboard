from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Sensor(models.Model):
    sensor_id = models.CharField(max_length=64)
    sensor_name = models.CharField(max_length=250)
    sensor_value = models.CharField(max_length=64)

    def __str__(self):
        return self.sensor_name
