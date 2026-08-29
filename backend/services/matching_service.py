import json
import logging
from sqlalchemy.orm import Session
from backend.models.db_models import User
from backend.database_neo4j import NEO4J_ENABLED, is_neo4j_available
from backend.services.neo4j_service import get_matches as get_neo4j_matches

logger = logging.getLogger(__name__)

def safe_json_load(field_val):
    if not field_val:
        return []
    try:
        data = json.loads(field_val)
        return data if isinstance(data, list) else []
    except (ValueError, TypeError):
        return []

def get_matches_for_user(db: Session, user_id: int):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user or not target_user.profile:
        return []

    # 1. Attempt Neo4j matching if enabled and available
    if NEO4J_ENABLED and is_neo4j_available:
        try:
            neo4j_results = get_neo4j_matches(user_id)
            if neo4j_results is not None:
                # We need to hydrate Neo4j results with SQLite profile data (e.g., name, teaming_preference)
                # and filter out users who are already in a team if we want to mimic exact SQLite behavior.
                hydrated_matches = []
                for match in neo4j_results:
                    other = db.query(User).filter(User.id == match["user_id"]).first()
                    if not other or not other.profile:
                        continue
                    
                    is_available = (other.profile.teaming_preference != "has-team")
                    
                    # We only add the same base score modifiers from Neo4j (skills/interests). 
                    # We can add role/hackathon modifiers on top here if we want full parity,
                    # but since the prompt says "Neo4j should improve candidate discovery... while SQLite remains the reliable fallback"
                    # we will just add role/hackathon logic here to keep score consistent.
                    
                    a_role = target_user.profile.preferred_role or ""
                    b_role = other.profile.preferred_role or ""
                    role_comp = (a_role != b_role) and bool(a_role) and bool(b_role)
                    
                    a_hack = set(safe_json_load(target_user.profile.hackathon_interests))
                    b_hack = set(safe_json_load(other.profile.hackathon_interests))
                    same_hack = bool(a_hack & b_hack)
                    
                    final_score = match["match_score"]
                    final_score += 3.0 if role_comp else 0.0
                    final_score += 2.0 if same_hack else 0.0
                    
                    hydrated_matches.append({
                        "user_id": other.id,
                        "name": other.name,
                        "match_score": final_score,
                        "shared_skills": match["shared_skills"],
                        "shared_interests": match["shared_interests"],
                        "_available": is_available
                    })
                
                hydrated_matches.sort(key=lambda x: (x["_available"], x["match_score"]), reverse=True)
                for m in hydrated_matches:
                    del m["_available"]
                return hydrated_matches[:10]
        except Exception as e:
            logger.error(f"Neo4j matching failed, falling back to SQLite: {e}")

    # 2. SQLite Fallback (Original Implementation)
    target_prof = target_user.profile
    
    # Get all other students
    other_users = db.query(User).filter(User.id != user_id, User.role == 'student').all()
    
    matches = []
    for other in other_users:
        if not other.profile:
            continue
            
        other_prof = other.profile
        
        a_skills = set(safe_json_load(target_prof.skills))
        b_skills = set(safe_json_load(other_prof.skills))
        a_inter = set(safe_json_load(target_prof.interests))
        b_inter = set(safe_json_load(other_prof.interests))
        a_hack = set(safe_json_load(target_prof.hackathon_interests))
        b_hack = set(safe_json_load(other_prof.hackathon_interests))
        
        shared_skills = a_skills & b_skills
        shared_interests = a_inter & b_inter
        same_hack = bool(a_hack & b_hack)
        
        a_role = target_prof.preferred_role or ""
        b_role = other_prof.preferred_role or ""
        role_comp = (a_role != b_role) and bool(a_role) and bool(b_role)
        
        score = (
            len(shared_skills) * 2.0
            + len(shared_interests) * 1.5
            + (3.0 if role_comp else 0.0)
            + (2.0 if same_hack else 0.0)
        )
        
        is_available = (other_prof.teaming_preference != "has-team")
        
        matches.append({
            "user_id": other.id,
            "name": other.name,
            "match_score": float(score),
            "shared_skills": list(shared_skills),
            "shared_interests": list(shared_interests),
            "_available": is_available
        })
        
    matches.sort(key=lambda x: (x["_available"], x["match_score"]), reverse=True)
    
    for m in matches:
        del m["_available"]
        
    return matches[:10]
