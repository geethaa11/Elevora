import os
import sys
import json
import logging

# Ensure project root is in python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.database_neo4j import NEO4J_ENABLED, is_neo4j_available, driver
from backend.database import SessionLocal
from backend.models.db_models import User, StudentProfile

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def safe_json_load(field_val):
    if not field_val:
        return []
    try:
        data = json.loads(field_val)
        return data if isinstance(data, list) else []
    except (ValueError, TypeError):
        return []

def main():
    if not NEO4J_ENABLED or not is_neo4j_available:
        logger.info("Neo4j is disabled or unavailable. Exiting sync script cleanly.")
        sys.exit(0)
        
    db = SessionLocal()
    try:
        users = db.query(User).filter(User.role == 'student').all()
        logger.info(f"Found {len(users)} student users to sync to Neo4j.")
        
        with driver.session() as session:
            for user in users:
                if not user.profile:
                    continue
                    
                skills = safe_json_load(user.profile.skills)
                interests = safe_json_load(user.profile.interests)
                
                logger.info(f"Syncing user {user.id}")
                
                session.run(
                    "MERGE (s:Student {id: $user_id}) "
                    "WITH s OPTIONAL MATCH (s)-[r:HAS_SKILL|INTERESTED_IN]->() DELETE r",
                    {"user_id": user.id}
                )
                
                if skills:
                    session.run(
                        "MATCH (s:Student {id: $user_id}) "
                        "UNWIND $skills as skill "
                        "MERGE (sk:Skill {name: skill}) "
                        "MERGE (s)-[:HAS_SKILL]->(sk)",
                        {"user_id": user.id, "skills": skills}
                    )
                if interests:
                    session.run(
                        "MATCH (s:Student {id: $user_id}) "
                        "UNWIND $interests as interest "
                        "MERGE (d:Domain {name: interest}) "
                        "MERGE (s)-[:INTERESTED_IN]->(d)",
                        {"user_id": user.id, "interests": interests}
                    )
        logger.info("Sync complete.")
    except Exception as e:
        logger.error(f"Error during sync: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
