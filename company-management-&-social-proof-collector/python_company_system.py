"""
Company Management & Testimonial Collector System - Python Edition
Zero-dependency, Built-in SQLite3 Database Integration + Full Data Access Layer
Works instantly in Python 3 standard library.
"""

import sys
import os
import json
import sqlite3
from datetime import datetime

DB_FILE = "company_management.db"

class CompanyDatabase:
    def __init__(self, db_path=DB_FILE):
        self.db_path = db_path
        self.init_db()
        self.seed_defaults()

    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            # 1. Company Table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS companies (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    industry TEXT DEFAULT 'Technology / Enterprise SaaS',
                    website TEXT DEFAULT 'https://acme-corp.example.com',
                    headquarters TEXT DEFAULT 'San Francisco, CA',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            # 2. Departments Table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS departments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    company_id INTEGER,
                    name TEXT NOT NULL,
                    head TEXT DEFAULT 'Unassigned',
                    budget TEXT DEFAULT '$500,000',
                    FOREIGN KEY (company_id) REFERENCES companies(id)
                )
            ''')
            # 3. Employees Table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS employees (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    company_id INTEGER,
                    department_id INTEGER,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    role TEXT NOT NULL,
                    status TEXT DEFAULT 'active',
                    joined_date TEXT,
                    FOREIGN KEY (company_id) REFERENCES companies(id),
                    FOREIGN KEY (department_id) REFERENCES departments(id)
                )
            ''')
            # 4. Spaces Table (MERN Spec A: Spaces with unique slugs)
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS spaces (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    company_id INTEGER,
                    name TEXT NOT NULL,
                    slug TEXT UNIQUE NOT NULL,
                    headline TEXT,
                    custom_prompt TEXT,
                    is_avatar_mandatory INTEGER DEFAULT 0,
                    is_star_rating_enabled INTEGER DEFAULT 1,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (company_id) REFERENCES companies(id)
                )
            ''')
            # 5. Testimonials Table (MERN Spec B/C: Moderation & Storage)
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS testimonials (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    space_slug TEXT NOT NULL,
                    client_name TEXT NOT NULL,
                    client_email TEXT NOT NULL,
                    company_role TEXT DEFAULT 'Customer',
                    company_name TEXT DEFAULT '',
                    avatar_url TEXT DEFAULT '',
                    rating INTEGER DEFAULT 5,
                    review_text TEXT NOT NULL,
                    status TEXT DEFAULT 'pending',
                    is_featured INTEGER DEFAULT 0,
                    is_liked INTEGER DEFAULT 0,
                    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (space_slug) REFERENCES spaces(slug)
                )
            ''')
            conn.commit()

    def seed_defaults(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM companies")
            if cursor.fetchone()[0] == 0:
                # Seed Company
                cursor.execute('''
                    INSERT INTO companies (name, industry, website, headquarters)
                    VALUES (?, ?, ?, ?)
                ''', ("Acme Global Systems", "Enterprise SaaS & Cloud Infrastructure", "https://acme-global.io", "San Francisco, CA"))
                company_id = cursor.lastrowid

                # Seed Departments
                cursor.execute('''
                    INSERT INTO departments (company_id, name, head, budget)
                    VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)
                ''', (
                    company_id, "Engineering & Architecture", "Sarah Chen", "$1,400,000",
                    company_id, "Customer Success & Marketing", "Marcus Brody", "$600,000",
                    company_id, "Operations & Security", "Elena Rostova", "$350,000"
                ))

                # Seed Employees
                cursor.execute('''
                    INSERT INTO employees (company_id, department_id, name, email, role, status, joined_date)
                    VALUES 
                    (?, 1, 'Sarah Chen', 'sarah.chen@acme.com', 'VP of Engineering', 'active', '2023-01-15'),
                    (?, 2, 'Marcus Brody', 'marcus.b@acme.com', 'Head of Customer Growth', 'active', '2023-03-20'),
                    (?, 3, 'Elena Rostova', 'elena.r@acme.com', 'Director of Operations', 'active', '2023-05-10'),
                    (?, 1, 'David Patel', 'david.p@acme.com', 'Staff Platform Engineer', 'remote', '2023-08-01')
                ''', (company_id, company_id, company_id, company_id))

                # Seed Space
                cursor.execute('''
                    INSERT INTO spaces (company_id, name, slug, headline, custom_prompt, is_avatar_mandatory, is_star_rating_enabled)
                    VALUES (?, ?, ?, ?, ?, 0, 1)
                ''', (
                    company_id,
                    "Acme Cloud Platform",
                    "acme-corp",
                    "Loved by 12,000+ engineering teams worldwide",
                    "How has Acme helped accelerate your team's software delivery?"
                ))

                # Seed Testimonials
                cursor.execute('''
                    INSERT INTO testimonials (space_slug, client_name, client_email, company_role, company_name, avatar_url, rating, review_text, status, is_featured, is_liked)
                    VALUES 
                    ('acme-corp', 'Jessica Reynolds', 'jessica@finflow.tech', 'CTO', 'FinFlow Tech', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 5, 'Acme reduced our deployment cycle from 45 minutes down to 3 minutes. The reliability and uptime have been remarkable.', 'approved', 1, 1),
                    ('acme-corp', 'Alexandre Moreau', 'alex@hyperscale.fr', 'VP Operations', 'HyperScale Paris', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 5, 'Collecting and showcasing social proof has never been simpler. The Wall of Love embed directly boosted our checkout conversion by 28%.', 'approved', 1, 1),
                    ('acme-corp', 'Maya Lin', 'maya@designcraft.co', 'Product Director', 'DesignCraft Studio', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 4, 'Very frictionless submission flow. Our clients appreciated not having to create yet another account to share feedback.', 'approved', 0, 1),
                    ('acme-corp', 'Liam Hemsworth', 'liam@novabyte.io', 'Engineering Lead', 'NovaByte Labs', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 5, 'Cleanest API and user experience in the market. The moderation inbox saves hours of manual review collection every week.', 'pending', 0, 0)
                ''')
                conn.commit()

    def get_dashboard_metrics(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name, industry, headquarters FROM companies LIMIT 1")
            company = cursor.fetchone()
            
            cursor.execute("SELECT COUNT(*) FROM employees")
            total_employees = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM departments")
            total_departments = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM spaces")
            total_spaces = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM testimonials")
            total_reviews = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM testimonials WHERE status = 'approved'")
            approved_reviews = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM testimonials WHERE status = 'pending'")
            pending_reviews = cursor.fetchone()[0]

            cursor.execute("SELECT AVG(rating) FROM testimonials WHERE status = 'approved'")
            avg_rating = cursor.fetchone()[0] or 5.0

            cursor.execute("SELECT rating, COUNT(*) FROM testimonials GROUP BY rating ORDER BY rating DESC")
            distribution = {row[0]: row[1] for row in cursor.fetchall()}

            return {
                "company": {
                    "name": company["name"] if company else "Acme",
                    "industry": company["industry"] if company else "",
                    "headquarters": company["headquarters"] if company else ""
                },
                "stats": {
                    "total_employees": total_employees,
                    "total_departments": total_departments,
                    "total_spaces": total_spaces,
                    "total_reviews": total_reviews,
                    "approved_reviews": approved_reviews,
                    "pending_reviews": pending_reviews,
                    "average_rating": round(avg_rating, 1),
                    "distribution": distribution
                },
                "database": "SQLite 3 Standard Engine (zero external dependencies)",
                "status": "Operational & Synced"
            }

    def list_testimonials(self, space_slug="acme-corp", status=None):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            if status:
                cursor.execute("SELECT * FROM testimonials WHERE space_slug = ? AND status = ? ORDER BY id DESC", (space_slug, status))
            else:
                cursor.execute("SELECT * FROM testimonials WHERE space_slug = ? ORDER BY id DESC", (space_slug,))
            
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    def add_testimonial(self, space_slug, client_name, client_email, role, review_text, rating=5, avatar_url=""):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO testimonials (space_slug, client_name, client_email, company_role, review_text, rating, avatar_url, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
            ''', (space_slug, client_name, client_email, role, review_text, rating, avatar_url))
            conn.commit()
            return cursor.lastrowid

if __name__ == "__main__":
    db = CompanyDatabase()
    metrics = db.get_dashboard_metrics()
    print("==================================================================")
    print(" PYTHON COMPANY MANAGEMENT & TESTIMONIAL SYSTEM - SQLITE ENGINE")
    print("==================================================================")
    print(json.dumps(metrics, indent=2))
    print("\nRecent Approved Testimonials:")
    for t in db.list_testimonials(status='approved')[:2]:
        print(f" - [{t['rating']}★] {t['client_name']} ({t['company_role']}): \"{t['review_text'][:60]}...\"")
    print("==================================================================")
