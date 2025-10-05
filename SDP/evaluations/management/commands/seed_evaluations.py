from django.core.management.base import BaseCommand
from django.db import transaction

from authentication.models import Department, AUNUser
from evaluations.models import EvaluationCategory, EvaluationQuestion


class Command(BaseCommand):
    help = "Seed departments, evaluation categories, and sample questions"

    def add_arguments(self, parser):
        parser.add_argument(
            "--with-questions",
            action="store_true",
            help="Also seed categories and sample questions",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        # 1) Departments
        departments = [
            {"name": "Classroom (Faculty)", "code": "CLS", "description": "Faculty/classroom evaluations"},
            {"name": "IT Support Services", "code": "IT", "description": "Technical support and services"},
            {"name": "Cafeteria", "code": "CAF", "description": "Dining services and food quality"},
            {"name": "Dormitories", "code": "DOR", "description": "Student residential accommodations"},
        ]

        created_depts = []
        for d in departments:
            # First try by code
            try:
                dept = Department.objects.get(code=d["code"])
                # Update existing
                updated = False
                if dept.name != d["name"]:
                    dept.name = d["name"]
                    updated = True
                if dept.description != d["description"]:
                    dept.description = d["description"]
                    updated = True
                if not dept.is_active:
                    dept.is_active = True
                    updated = True
                if updated:
                    dept.save()
                self.stdout.write(self.style.NOTICE(f"Department {dept.code} exists; ensured active and updated."))
            except Department.DoesNotExist:
                # Try by name to avoid duplicates
                try:
                    dept = Department.objects.get(name=d["name"])
                    # Update code if needed
                    if dept.code != d["code"]:
                        dept.code = d["code"]
                        dept.save()
                    self.stdout.write(self.style.NOTICE(f"Found department by name, updated code to {dept.code}."))
                except Department.DoesNotExist:
                    # Create new
                    dept = Department.objects.create(
                        code=d["code"], 
                        name=d["name"], 
                        description=d["description"], 
                        is_active=True
                    )
                    self.stdout.write(self.style.SUCCESS(f"Created department {dept.code} - {dept.name}"))
            created_depts.append(dept)

        if not options["with_questions"]:
            self.stdout.write(self.style.SUCCESS("Seeding complete (departments only)."))
            return

        # 2) Categories (used across departments)
        category_names = [
            ("Teaching Quality", "Instruction clarity, engagement, and fairness"),
            ("Facilities", "Physical facilities, equipment, and environment"),
            ("Service", "Service quality and professionalism"),
            ("Responsiveness", "Speed and helpfulness of responses"),
            ("Cleanliness", "Hygiene and cleanliness"),
            ("Food Quality", "Taste, freshness, and variety"),
            ("Safety & Comfort", "Safety measures and comfort levels"),
        ]
        categories = {}
        for name, desc in category_names:
            cat, _ = EvaluationCategory.objects.get_or_create(name=name, defaults={"description": desc, "is_active": True})
            categories[name] = cat
        self.stdout.write(self.style.SUCCESS("Categories ensured."))

        # 3) Sample Questions per department
        # Note: All are Likert 1-5 unless specified otherwise.
        samples = {
            "CLS": [
                ("Teaching Quality", "The instructor explains concepts clearly.", "likert_5", 1),
                ("Teaching Quality", "The course materials support my learning.", "likert_5", 2),
                ("Facilities", "The classroom environment is conducive to learning.", "likert_5", 3),
                ("Service", "The instructor is approachable and supportive.", "likert_5", 4),
                ("Responsiveness", "Feedback on assignments is timely and helpful.", "likert_5", 5),
            ],
            "IT": [
                ("Responsiveness", "IT issues are resolved promptly.", "likert_5", 1),
                ("Service", "Support staff are professional and helpful.", "likert_5", 2),
                ("Facilities", "Campus Wi-Fi is reliable and fast.", "likert_5", 3),
                ("Facilities", "Computer labs/equipment meet my needs.", "likert_5", 4),
                ("Service", "Was your issue resolved on first contact?", "boolean", 5),
            ],
            "CAF": [
                ("Food Quality", "The food tastes good and is fresh.", "likert_5", 1),
                ("Food Quality", "There is sufficient menu variety.", "likert_5", 2),
                ("Cleanliness", "Dining spaces and utensils are clean.", "likert_5", 3),
                ("Service", "Cafeteria staff are courteous.", "likert_5", 4),
                ("Service", "Would you recommend the cafeteria to others?", "boolean", 5),
            ],
            "DOR": [
                ("Safety & Comfort", "Dorms feel safe and secure.", "likert_5", 1),
                ("Facilities", "Dorm facilities are well maintained.", "likert_5", 2),
                ("Cleanliness", "Common areas are kept clean.", "likert_5", 3),
                ("Responsiveness", "Maintenance requests are handled quickly.", "likert_5", 4),
                ("Service", "Please describe any recurring issues.", "text", 5),
            ],
        }

        total_created = 0
        for dept in created_depts:
            dept_samples = samples.get(dept.code, [])
            for cat_name, prompt, scale, order_index in dept_samples:
                cat = categories[cat_name]
                q, created = EvaluationQuestion.objects.get_or_create(
                    department=dept,
                    prompt=prompt,
                    defaults={
                        "category": cat,
                        "scale_type": scale,
                        "order_index": order_index,
                        "is_active": True,
                    },
                )
                if created:
                    total_created += 1
        self.stdout.write(self.style.SUCCESS(f"Seeded {total_created} sample questions."))
        self.stdout.write(self.style.SUCCESS("Seeding complete."))


