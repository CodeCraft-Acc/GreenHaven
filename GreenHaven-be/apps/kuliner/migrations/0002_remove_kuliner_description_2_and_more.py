# Generated by Django 5.1.4 on 2025-01-11 09:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kuliner', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='kuliner',
            name='description_2',
        ),
        migrations.RemoveField(
            model_name='kuliner',
            name='destinations',
        ),
        migrations.AddField(
            model_name='kuliner',
            name='g_maps',
            field=models.URLField(blank=True, help_text='Google Maps URL', max_length=2000),
        ),
        migrations.AddField(
            model_name='kuliner',
            name='guides',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='kuliner',
            name='location',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
