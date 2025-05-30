# Generated by Django 5.1.4 on 2024-12-31 09:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('analytics', '0002_requestlog_browser_requestlog_city_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='requestlog',
            name='error_message',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='requestlog',
            name='error_stack',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='requestlog',
            name='error_type',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='requestlog',
            name='is_error',
            field=models.BooleanField(default=False),
        ),
        migrations.AddIndex(
            model_name='requestlog',
            index=models.Index(fields=['is_error'], name='analytics_r_is_erro_71268f_idx'),
        ),
        migrations.AddIndex(
            model_name='requestlog',
            index=models.Index(fields=['error_type'], name='analytics_r_error_t_94fae1_idx'),
        ),
    ]
