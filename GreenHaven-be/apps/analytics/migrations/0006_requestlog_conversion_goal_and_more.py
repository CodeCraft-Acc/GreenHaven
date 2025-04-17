# Generated by Django 5.1.4 on 2024-12-31 15:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('analytics', '0005_requestlog_api_key_requestlog_auth_method_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='requestlog',
            name='conversion_goal',
            field=models.CharField(blank=True, help_text='Conversion goal achieved if any', max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='requestlog',
            name='engagement_time',
            field=models.IntegerField(blank=True, help_text='Time spent on feature in seconds', null=True),
        ),
        migrations.AddField(
            model_name='requestlog',
            name='feature_accessed',
            field=models.CharField(blank=True, help_text='Specific feature being accessed', max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='requestlog',
            name='interaction_type',
            field=models.CharField(blank=True, help_text='Type of interaction (view/search/filter)', max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='requestlog',
            name='session_id',
            field=models.CharField(blank=True, help_text='Session identifier', max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='requestlog',
            name='user_type',
            field=models.CharField(blank=True, help_text='Type of user (guest/registered/premium)', max_length=50, null=True),
        ),
        migrations.AddIndex(
            model_name='requestlog',
            index=models.Index(fields=['session_id'], name='analytics_r_session_96e711_idx'),
        ),
        migrations.AddIndex(
            model_name='requestlog',
            index=models.Index(fields=['user_type'], name='analytics_r_user_ty_0bf5cf_idx'),
        ),
        migrations.AddIndex(
            model_name='requestlog',
            index=models.Index(fields=['feature_accessed'], name='analytics_r_feature_561b5a_idx'),
        ),
        migrations.AddIndex(
            model_name='requestlog',
            index=models.Index(fields=['conversion_goal'], name='analytics_r_convers_2f023b_idx'),
        ),
    ]
