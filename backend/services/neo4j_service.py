import logging
from backend.database_neo4j import driver, is_neo4j_available

logger = logging.getLogger(__name__)

def sync_student_profile(user_id: int, skills: list, interests: list):
    if not is_neo4j_available or not driver:
        return

    try:
        with driver.session() as session:
            # Clear old relationships first
            session.run(
                "MERGE (s:Student {id: $user_id}) "
                "WITH s OPTIONAL MATCH (s)-[r:HAS_SKILL|INTERESTED_IN]->() DELETE r",
                {"user_id": user_id}
            )
            
            if skills:
                session.run(
                    "MATCH (s:Student {id: $user_id}) "
                    "UNWIND $skills as skill "
                    "MERGE (sk:Skill {name: skill}) "
                    "MERGE (s)-[:HAS_SKILL]->(sk)",
                    {"user_id": user_id, "skills": skills}
                )
            if interests:
                session.run(
                    "MATCH (s:Student {id: $user_id}) "
                    "UNWIND $interests as interest "
                    "MERGE (d:Domain {name: interest}) "
                    "MERGE (s)-[:INTERESTED_IN]->(d)",
                    {"user_id": user_id, "interests": interests}
                )
    except Exception as e:
        logger.error(f"Neo4j sync_student_profile failed: {e}")

def get_matches(user_id: int, limit: int = 10):
    if not is_neo4j_available or not driver:
        return None

    query = """
    MATCH (s1:Student {id: $user_id})
    MATCH (s2:Student) WHERE s1 <> s2
    
    OPTIONAL MATCH (s1)-[:HAS_SKILL]->(sk:Skill)<-[:HAS_SKILL]-(s2)
    WITH s1, s2, collect(DISTINCT sk.name) as shared_skills
    
    OPTIONAL MATCH (s1)-[:INTERESTED_IN]->(d:Domain)<-[:INTERESTED_IN]-(s2)
    WITH s2, shared_skills, collect(DISTINCT d.name) as shared_interests
    
    WITH s2, shared_skills, shared_interests,
         (size(shared_skills) * 2.0 + size(shared_interests) * 1.5) as match_score
         
    WHERE match_score > 0
    RETURN s2.id as user_id, match_score, shared_skills, shared_interests
    ORDER BY match_score DESC
    LIMIT $limit
    """
    
    try:
        with driver.session() as session:
            result = session.run(query, {"user_id": user_id, "limit": limit})
            matches = []
            for record in result:
                matches.append({
                    "user_id": record["user_id"],
                    "match_score": float(record["match_score"]),
                    "shared_skills": record["shared_skills"],
                    "shared_interests": record["shared_interests"]
                })
            return matches
    except Exception as e:
        logger.error(f"Neo4j get_matches failed: {e}")
        return None
