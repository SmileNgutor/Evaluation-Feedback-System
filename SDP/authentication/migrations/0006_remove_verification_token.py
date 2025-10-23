# Manual migration to remove verification_token field using raw SQL

from django.db import migrations


def remove_verification_token_column(apps, schema_editor):
    """Remove verification_token column using database-agnostic approach"""
    from django.db import connection

    with connection.cursor() as cursor:
        # Check if column exists - PostgreSQL way
        if connection.vendor == 'postgresql':
            cursor.execute("""
                SELECT COUNT(*)
                FROM information_schema.columns
                WHERE table_name='authentication_aunuser'
                AND column_name='verification_token'
            """)
            exists = cursor.fetchone()[0] > 0

            if exists:
                # PostgreSQL supports ALTER TABLE DROP COLUMN directly
                cursor.execute("""
                    ALTER TABLE authentication_aunuser
                    DROP COLUMN IF EXISTS verification_token
                """)

        # SQLite fallback (if needed)
        elif connection.vendor == 'sqlite':
            cursor.execute("""
                SELECT COUNT(*)
                FROM pragma_table_info('authentication_aunuser')
                WHERE name='verification_token'
            """)
            exists = cursor.fetchone()[0]

            if exists:
                # Disable foreign key checks temporarily
                cursor.execute("PRAGMA foreign_keys=OFF")

                # Create new table with same structure but without verification_token
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS authentication_aunuser_new (
                        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                        password VARCHAR(128) NOT NULL,
                        last_login DATETIME NULL,
                        is_superuser BOOL NOT NULL,
                        username VARCHAR(150) NULL UNIQUE,
                        first_name VARCHAR(150) NOT NULL,
                        last_name VARCHAR(150) NOT NULL,
                        email VARCHAR(254) NOT NULL,
                        is_staff BOOL NOT NULL,
                        is_active BOOL NOT NULL,
                        date_joined DATETIME NOT NULL,
                        aun_id VARCHAR(20) NOT NULL UNIQUE,
                        role VARCHAR(20) NOT NULL,
                        aun_email VARCHAR(254) NOT NULL UNIQUE,
                        phone_number VARCHAR(15) NULL,
                        full_name VARCHAR(200) NOT NULL,
                        profile_picture VARCHAR(100) NULL,
                        year_of_study INTEGER NULL,
                        major VARCHAR(100) NOT NULL,
                        position VARCHAR(100) NOT NULL,
                        last_login_ip CHAR(39) NULL,
                        allow_feedback_contact BOOL NOT NULL,
                        anonymous_evaluations BOOL NOT NULL,
                        created_at DATETIME NOT NULL,
                        updated_at DATETIME NOT NULL,
                        department_id BIGINT NULL REFERENCES authentication_department(id) DEFERRABLE INITIALLY DEFERRED,
                        is_verified BOOL NOT NULL
                    )
                """)

                # Copy data
                cursor.execute("""
                    INSERT INTO authentication_aunuser_new
                    SELECT id, password, last_login, is_superuser, username, first_name,
                           last_name, email, is_staff, is_active, date_joined, aun_id,
                           role, aun_email, phone_number, full_name, profile_picture,
                           year_of_study, major, position, last_login_ip,
                           allow_feedback_contact, anonymous_evaluations, created_at,
                           updated_at, department_id, is_verified
                    FROM authentication_aunuser
                """)

                # Drop old table
                cursor.execute("DROP TABLE authentication_aunuser")

                # Rename new table
                cursor.execute("ALTER TABLE authentication_aunuser_new RENAME TO authentication_aunuser")

                # Recreate indexes
                cursor.execute("""
                    CREATE INDEX authentication_aunuser_department_id_idx
                    ON authentication_aunuser(department_id)
                """)

                # Re-enable foreign key checks
                cursor.execute("PRAGMA foreign_keys=ON")


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0005_remove_verification_feature'),
    ]

    operations = [
        migrations.RunPython(remove_verification_token_column, reverse_code=migrations.RunPython.noop),
    ]
