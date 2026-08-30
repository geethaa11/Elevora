import json
import logging
from sqlalchemy.orm import Session
from backend.models.db_models import User, SwipeAction
from backend.database_neo4j import NEO4J_ENABLED, is_neo4j_available
from backend.services.neo4j_service import get_matches as get_neo4j_matches

logger = logging.getLogger(__name__)

def normalize_list(raw_list):
    if not raw_list:
        return []
    try:
        if isinstance(raw_list, str):
            data = json.loads(raw_list)
        else:
            data = raw_list
        if not isinstance(data, list):
            return []
        return [str(x).strip().lower() for x in data if str(x).strip()]
    except (ValueError, TypeError):
        return []

COMPLEMENTARY_ROLES = {
    "backend": ["frontend", "ui/ux", "mobile"],
    "frontend": ["backend", "ai/ml", "data science"],
    "ai/ml": ["frontend", "backend", "mobile"],
    "data science": ["frontend", "backend"],
    "ui/ux": ["frontend", "backend", "mobile"],
    "mobile": ["backend", "ui/ux", "ai/ml"]
}

def is_complementary_role(role_a, role_b):
    if not role_a or not role_b:
        return False
    ra = role_a.strip().lower()
    rb = role_b.strip().lower()
    if ra == rb:
        return False
    
    ra_broad = next((k for k in COMPLEMENTARY_ROLES.keys() if k in ra), None)
    rb_broad = next((k for k in COMPLEMENTARY_ROLES.keys() if k in rb), None)
    
    if ra_broad and rb_broad:
        if rb_broad in COMPLEMENTARY_ROLES.get(ra_broad, []):
            return True
        if ra_broad in COMPLEMENTARY_ROLES.get(rb_broad, []):
            return True
            
    # Default: if roles are specified but different and not explicitly matching above, we assume they are complementary 
    return True

def get_broad_skill_bucket(skill):
    skill = skill.lower()
    if any(x in skill for x in ["react", "vue", "angular", "html", "css", "tailwind", "frontend", "svelte"]):
        return "frontend"
    if any(x in skill for x in ["python", "node", "django", "fastapi", "sql", "mongo", "backend", "aws", "docker"]):
        return "backend"
    if any(x in skill for x in ["ml", "ai", "tensorflow", "pytorch", "data"]):
        return "ai/data"
    if any(x in skill for x in ["figma", "design", "ui", "ux"]):
        return "ui/ux"
    return "other"

def calculate_compatibility(target_prof, candidate_prof):
    a_skills = set(normalize_list(target_prof.skills))
    b_skills = set(normalize_list(candidate_prof.skills))
    a_inter = set(normalize_list(target_prof.interests))
    b_inter = set(normalize_list(candidate_prof.interests))
    a_hack = set(normalize_list(target_prof.hackathon_interests))
    b_hack = set(normalize_list(candidate_prof.hackathon_interests))
    
    a_role = target_prof.preferred_role or ""
    b_role = candidate_prof.preferred_role or ""
    
    shared_skills = a_skills & b_skills
    shared_interests = a_inter & b_inter
    shared_hacks = a_hack & b_hack
    
    score = 0.0
    reasons = []
    
    # 1. Skills Match (up to 0.35)
    if shared_skills:
        skill_score = min(len(shared_skills) * 0.1, 0.35)
        score += skill_score
        reasons.append(f"Shared {len(shared_skills)} technical skills")
        
    # 2. Interest Match (up to 0.20)
    if shared_interests:
        inter_score = min(len(shared_interests) * 0.1, 0.20)
        score += inter_score
        reasons.append(f"Common interests in {list(shared_interests)[0].title()}")
        
    # 3. Hackathon/Project (up to 0.15)
    if shared_hacks:
        hack_score = min(len(shared_hacks) * 0.15, 0.15)
        score += hack_score
        reasons.append("Interested in the same hackathons")
        
    # 4. Complementary Role (up to 0.15)
    comp_role = is_complementary_role(a_role, b_role)
    if comp_role:
        score += 0.15
        reasons.append(f"Complementary role ({b_role.title()})")
        
    # 5. Complementary Skills (up to 0.05)
    a_buckets = {get_broad_skill_bucket(s) for s in a_skills}
    comp_skills = b_skills - a_skills
    meaningful_comp = [s for s in comp_skills if get_broad_skill_bucket(s) not in a_buckets and get_broad_skill_bucket(s) != "other"]
    
    if meaningful_comp:
        score += min(len(meaningful_comp) * 0.05, 0.05)
        reasons.append("Brings complementary technical skills")
        
    # 6. Profile/Academic (up to 0.10)
    if target_prof.college_name and candidate_prof.college_name and target_prof.college_name.strip().lower() == candidate_prof.college_name.strip().lower():
        score += 0.10
        reasons.append("Same college/university")
        
    # Cap score at 1.0
    score = min(score, 1.0)
    
    if not reasons:
        reasons.append("General recommendation")
        score = 0.10
        
    return {
        "score": round(score, 2),
        "shared_skills": [s.title() for s in shared_skills],
        "shared_interests": [s.title() for s in shared_interests],
        "complementary_skills": [s.title() for s in meaningful_comp],
        "complementary_role": comp_role,
        "match_reasons": reasons
    }

def get_matches_for_user(db: Session, user_id: int, limit: int = 10, offset: int = 0):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user or not target_user.profile:
        return []

    swipes = db.query(SwipeAction.swiped_id).filter(SwipeAction.swiper_id == user_id).all()
    swiped_ids = {s[0] for s in swipes}

    matches = []
    
    # Fetch all students from DB
    other_users = db.query(User).filter(User.id != user_id, User.role == 'student').all()
    
    for other in other_users:
        if other.id in swiped_ids:
            continue
            
        if not other.profile:
            continue
            
        comp_data = calculate_compatibility(target_user.profile, other.profile)
        is_available = (other.profile.teaming_preference != "has-team")
        
        matches.append({
            "user_id": other.id,
            "name": other.name,
            "match_score": comp_data["score"],
            "shared_skills": comp_data["shared_skills"],
            "shared_interests": comp_data["shared_interests"],
            "complementary_skills": comp_data["complementary_skills"],
            "complementary_role": comp_data["complementary_role"],
            "match_reasons": comp_data["match_reasons"],
            "_available": is_available
        })
        
    # Sort available first, then by match score
    matches.sort(key=lambda x: (x["_available"], x["match_score"]), reverse=True)
    
    for m in matches:
        del m["_available"]
        
    return matches[offset : offset + limit]
