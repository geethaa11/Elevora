import json
from sqlalchemy.orm import Session
from backend.models.db_models import User

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
