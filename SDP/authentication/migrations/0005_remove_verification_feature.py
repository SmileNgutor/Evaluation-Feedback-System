# Generated manually for removing verification feature

from django.db import migrations, models


def verify_all_users(apps, schema_editor):
    """Set all existing users to is_verified=True"""
    AUNUser = apps.get_model('authentication', 'AUNUser')
    # Update all users to be verified
    AUNUser.objects.filter(is_verified=False).update(is_verified=True)


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0004_passwordresettoken'),
    ]

    operations = [
        migrations.RunPython(verify_all_users, reverse_code=migrations.RunPython.noop),
        # Update is_verified default to True
        migrations.AlterField(
            model_name='aunuser',
            name='is_verified',
            field=models.BooleanField(default=True),
        ),
        # Remove verification_token field if it exists
        migrations.RemoveField(
            model_name='aunuser',
            name='verification_token',
        ),
    ]
