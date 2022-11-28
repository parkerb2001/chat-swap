# Generated by Django 4.0.6 on 2022-10-10 20:46

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('chatswap', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='lastLogin',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='Last Login'),
            preserve_default=False,
        ),
    ]
