# Generated by Django 5.1.4 on 2025-01-11 11:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kuliner', '0003_kuliner_close_hours_kuliner_open_hours_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='kuliner',
            name='close_hours',
            field=models.DateTimeField(blank=True),
        ),
        migrations.AlterField(
            model_name='kuliner',
            name='open_hours',
            field=models.DateTimeField(blank=True),
        ),
    ]
