# Generated by Django 2.1.7 on 2019-04-30 16:42

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sea_battle', '0007_auto_20190430_1623'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='last_activity',
            field=models.DateTimeField(default=datetime.datetime(2019, 4, 30, 16, 42, 16, 405727)),
        ),
    ]
