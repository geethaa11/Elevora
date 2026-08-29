import json
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine
from backend.models.db_models import Base, User, StudentProfile, Team, TeamMember
from backend.services.auth_service import get_password_hash

# Ensure DB tables are created
Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(User).filter(User.email == 'student1@example.com').first():
            print("Data already seeded. Skipping.")
            return

        # Users
        users_data = [
            {"name": "Alice", "email": "student1@example.com", "role": "student", "password_hash": get_password_hash("pass123")},
            {"name": "Bob", "email": "student2@example.com", "role": "student", "password_hash": get_password_hash("pass123")},
            {"name": "Charlie", "email": "student3@example.com", "role": "student", "password_hash": get_password_hash("pass123")},
            {"name": "Diana", "email": "student4@example.com", "role": "student", "password_hash": get_password_hash("pass123")},
            {"name": "Eve", "email": "student5@example.com", "role": "student", "password_hash": get_password_hash("pass123")},
            {"name": "Mentor Max", "email": "mentor1@example.com", "role": "mentor", "password_hash": get_password_hash("pass123")},
        ]
        
        users = []
        for ud in users_data:
            user = User(**ud)
            db.add(user)
            users.append(user)
        
        db.commit()
        for u in users:
            db.refresh(u)

        # Profiles
        profiles_data = [
            {"user_id": users[0].id, "purpose": "Hackathons", "education": "BS CS", "skills": json.dumps(["Python", "React"]), "interests": json.dumps(["AI"]), "preferred_role": "Backend", "teaming_preference": "looking-for-team", "hackathon_interests": json.dumps(["Global Hack"])},
            {"user_id": users[1].id, "purpose": "Learning", "education": "BS Math", "skills": json.dumps(["Python"]), "interests": json.dumps(["AI", "Data"]), "preferred_role": "Data Scientist", "teaming_preference": "looking-for-team", "hackathon_interests": json.dumps(["Global Hack"])},
            {"user_id": users[2].id, "purpose": "Networking", "education": "BS Design", "skills": json.dumps(["Figma"]), "interests": json.dumps(["UX"]), "preferred_role": "Designer", "teaming_preference": "looking-for-team", "hackathon_interests": json.dumps(["UI Challenge"])},
            {"user_id": users[3].id, "purpose": "Building", "education": "BS CS", "skills": json.dumps(["React", "Node"]), "interests": json.dumps(["Web3"]), "preferred_role": "Frontend", "teaming_preference": "has-team", "hackathon_interests": json.dumps([])},
            {"user_id": users[4].id, "purpose": "Mentorship", "education": "BA Business", "skills": json.dumps(["Management"]), "interests": json.dumps(["Product"]), "preferred_role": "PM", "teaming_preference": "looking-for-team", "hackathon_interests": json.dumps(["Global Hack"])},
        ]
        
        for pd in profiles_data:
            db.add(StudentProfile(**pd))
            
        db.commit()

        # Teams & Members
        team1 = Team(name="AI Builders", created_by=users[0].id, description="Building AI things")
        team2 = Team(name="Design Wizards", created_by=users[2].id, description="Making things pretty")
        db.add(team1)
        db.add(team2)
        db.commit()
        db.refresh(team1)
        db.refresh(team2)
        
        db.add(TeamMember(team_id=team1.id, user_id=users[0].id, role_in_team="leader"))
        db.add(TeamMember(team_id=team1.id, user_id=users[1].id, role_in_team="member"))
        
        db.add(TeamMember(team_id=team2.id, user_id=users[2].id, role_in_team="leader"))
        
        db.commit()
        print("Seed data successfully added.")
        
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
