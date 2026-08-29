import sqlite3
import os
import json
from typing import List, Optional, Tuple, Dict, Any
from app.config import DB_PATH
from app.database.models import MentorModel, MentorshipRequestModel, StudentProfileModel, TeamModel, TeamMemberModel

DEMO_MENTORS = [
    {
        "mentor_id": "m1",
        "name": "Dr. Aris Thorne",
        "title": "Principal AI Scientist",
        "organization": "DeepMind",
        "bio": "10+ years in AI research, deep learning, and large language model architecture.",
        "availability": "Mon & Wed, 4-6 PM EST",
        "domain": "AI/ML",
        "skills": ["AI/ML", "Python", "PyTorch", "LLMs", "NLP"]
    },
    {
        "mentor_id": "m2",
        "name": "Sarah Chen",
        "title": "VP of Engineering",
        "organization": "Stripe",
        "bio": "Building scalable financial infrastructure and high-throughput distributed systems.",
        "availability": "Tue & Thu, 5-7 PM PST",
        "domain": "Fintech",
        "skills": ["System Design", "Backend", "Go", "Distributed Systems", "API Design"]
    },
    {
        "mentor_id": "m3",
        "name": "Alex Rivera",
        "title": "Founder & Managing Director",
        "organization": "LaunchPad Ventures",
        "bio": "Serial entrepreneur with 2 exits. Dedicated to helping student hackathon teams scale into startups.",
        "availability": "Fridays, 2-5 PM EST",
        "domain": "Startups",
        "skills": ["Product Strategy", "Pitching", "Fundraising", "GTM", "Business Models"]
    },
    {
        "mentor_id": "m4",
        "name": "Priya Patel",
        "title": "Lead UI/UX Designer",
        "organization": "Figma",
        "bio": "Passionate about crafting intuitive design systems and accessible user interfaces.",
        "availability": "Weekdays, 6-7 PM IST",
        "domain": "Design",
        "skills": ["UI/UX", "Figma", "Design Systems", "User Research", "Prototyping"]
    },
    {
        "mentor_id": "m5",
        "name": "Marcus Vance",
        "title": "Senior DevOps Architect",
        "organization": "AWS",
        "bio": "Cloud-native infrastructure specialist with expertise in Kubernetes, Docker, and CI/CD pipelines.",
        "availability": "Saturdays, 10 AM-1 PM EST",
        "domain": "Cloud Architecture",
        "skills": ["DevOps", "Kubernetes", "Docker", "AWS", "CI/CD", "Terraform"]
    },
    {
        "mentor_id": "m6",
        "name": "Elena Rostova",
        "title": "Full Stack Tech Lead",
        "organization": "Vercel",
        "bio": "Frontend performance wizard and modern full-stack web framework expert.",
        "availability": "Tue & Fri, 3-5 PM CET",
        "domain": "Web Development",
        "skills": ["Next.js", "React", "TypeScript", "Node.js", "GraphQL", "TailwindCSS"]
    },
    {
        "mentor_id": "m7",
        "name": "David Kim",
        "title": "Head of Product",
        "organization": "Notion",
        "bio": "Helping teams transform complex technical features into intuitive user journeys.",
        "availability": "Wednesdays, 5-7 PM PST",
        "domain": "Product Management",
        "skills": ["Product Management", "Roadmapping", "Agile", "User Growth", "Metrics"]
    },
    {
        "mentor_id": "m8",
        "name": "Dr. Maya Lin",
        "title": "Cybersecurity Director",
        "organization": "CrowdStrike",
        "bio": "Expert in application security, penetration testing, zero-trust architecture, and cryptography.",
        "availability": "Thursdays, 4-6 PM EST",
        "domain": "Security",
        "skills": ["Cybersecurity", "Ethical Hacking", "AppSec", "Cryptography", "Penetration Testing"]
    },
    {
        "mentor_id": "m9",
        "name": "James Wilson",
        "title": "Blockchain Protocol Lead",
        "organization": "Ethereum Foundation",
        "bio": "Pioneering smart contract optimization, decentralized architecture, and Web3 security.",
        "availability": "Mondays, 1-3 PM EST",
        "domain": "Blockchain",
        "skills": ["Solidity", "Smart Contracts", "Web3", "Ethereum", "Rust"]
    },
    {
        "mentor_id": "m10",
        "name": "Anita Roy",
        "title": "Data Science Manager",
        "organization": "Uber",
        "bio": "Specializing in predictive modeling, large-scale data analytics, and real-time decision algorithms.",
        "availability": "Sundays, 11 AM-1 PM PST",
        "domain": "Data Science",
        "skills": ["Data Science", "Analytics", "SQL", "Pandas", "Machine Learning", "Statistics"]
    }
]

DEMO_STUDENT_PROFILES = [
    {
        "user_id": "user_demo_1",
        "name": "Maya Lin",
        "college": "MIT",
        "qualification": "B.S. Computer Science",
        "skills": ["Python", "AI", "PyTorch"],
        "interests": ["Healthcare", "AI"],
        "preferred_role": "AI/ML Engineer",
        "team_preference": "Looking for team"
    },
    {
        "user_id": "user_demo_2",
        "name": "Jordan Lee",
        "college": "Stanford",
        "qualification": "B.S. Software Engineering",
        "skills": ["React", "TypeScript", "Tailwind"],
        "interests": ["Healthcare", "Fintech"],
        "preferred_role": "Frontend Developer",
        "team_preference": "Looking for team"
    },
    {
        "user_id": "user_demo_3",
        "name": "Devon Vance",
        "college": "UC Berkeley",
        "qualification": "M.S. Computer Science",
        "skills": ["Go", "Docker", "Kubernetes", "PostgreSQL"],
        "interests": ["AI", "DevOps"],
        "preferred_role": "Backend Developer",
        "team_preference": "Looking for team"
    },
    {
        "user_id": "user_demo_4",
        "name": "Samira Patel",
        "college": "Carnegie Mellon",
        "qualification": "B.Des Human-Computer Interaction",
        "skills": ["Figma", "UI/UX", "User Research"],
        "interests": ["Healthcare", "Education"],
        "preferred_role": "UI/UX Designer",
        "team_preference": "Looking for team"
    }
]

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mentors (
                mentor_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                title TEXT NOT NULL,
                organization TEXT NOT NULL,
                bio TEXT NOT NULL,
                availability TEXT NOT NULL,
                domain TEXT NOT NULL
            );
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mentor_skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                mentor_id TEXT NOT NULL,
                skill TEXT NOT NULL,
                FOREIGN KEY(mentor_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE
            );
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mentorship_requests (
                request_id TEXT PRIMARY KEY,
                mentor_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                message TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY(mentor_id) REFERENCES mentors(mentor_id)
            );
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS student_profiles (
                user_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                college TEXT,
                qualification TEXT,
                skills TEXT NOT NULL,
                interests TEXT NOT NULL,
                preferred_role TEXT,
                team_preference TEXT
            );
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS teams (
                team_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                creator_user_id TEXT NOT NULL,
                hackathon_id TEXT,
                created_at TEXT NOT NULL
            );
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS team_members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                team_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'Member',
                UNIQUE(team_id, user_id),
                FOREIGN KEY(team_id) REFERENCES teams(team_id) ON DELETE CASCADE
            );
        """)
        conn.commit()

        # Seed demo mentors if mentors table is empty
        cursor.execute("SELECT COUNT(*) as count FROM mentors;")
        count = cursor.fetchone()["count"]
        if count == 0:
            for m in DEMO_MENTORS:
                cursor.execute("""
                    INSERT INTO mentors (mentor_id, name, title, organization, bio, availability, domain)
                    VALUES (?, ?, ?, ?, ?, ?, ?);
                """, (m["mentor_id"], m["name"], m["title"], m["organization"], m["bio"], m["availability"], m["domain"]))
                for skill in m["skills"]:
                    cursor.execute("""
                        INSERT INTO mentor_skills (mentor_id, skill)
                        VALUES (?, ?);
                    """, (m["mentor_id"], skill))
            conn.commit()

        # Seed demo student profiles if student_profiles table is empty
        cursor.execute("SELECT COUNT(*) as count FROM student_profiles;")
        sp_count = cursor.fetchone()["count"]
        if sp_count == 0:
            for sp in DEMO_STUDENT_PROFILES:
                cursor.execute("""
                    INSERT INTO student_profiles (user_id, name, college, qualification, skills, interests, preferred_role, team_preference)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
                """, (sp["user_id"], sp["name"], sp["college"], sp["qualification"], json.dumps(sp["skills"]), json.dumps(sp["interests"]), sp["preferred_role"], sp["team_preference"]))
            conn.commit()
