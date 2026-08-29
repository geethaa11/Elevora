import uuid
import json
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import HTTPException, status
from app.database.db import get_connection
from app.schemas.teaming import (
    StudentProfileCreate,
    StudentProfileResponse,
    TeamCreate,
    TeamResponse,
    TeamMember,
    TeamMatch,
    TeamMatchResponse
)

def upsert_profile(user_id: str, data: StudentProfileCreate) -> StudentProfileResponse:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM student_profiles WHERE user_id = ?;", (user_id,))
        exists = cursor.fetchone()
        
        name = data.name if data.name else "Student User"
        skills_json = json.dumps(data.skills)
        interests_json = json.dumps(data.interests)
        avail = data.availability_time if data.availability_time and data.availability_time.strip() else "Flexible"
        part = data.hackathons_participated if data.hackathons_participated is not None else 0
        won = data.hackathons_won if data.hackathons_won is not None else 0

        if exists:
            cursor.execute("""
                UPDATE student_profiles
                SET name = ?, college = ?, qualification = ?, skills = ?, interests = ?, preferred_role = ?, team_preference = ?, availability_time = ?, hackathons_participated = ?, hackathons_won = ?
                WHERE user_id = ?;
            """, (name, data.college, data.qualification, skills_json, interests_json, data.preferred_role, data.team_preference, avail, part, won, user_id))
        else:
            cursor.execute("""
                INSERT INTO student_profiles (user_id, name, college, qualification, skills, interests, preferred_role, team_preference, availability_time, hackathons_participated, hackathons_won)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (user_id, name, data.college, data.qualification, skills_json, interests_json, data.preferred_role, data.team_preference, avail, part, won))
        conn.commit()

        return StudentProfileResponse(
            user_id=user_id,
            name=name,
            college=data.college,
            qualification=data.qualification,
            skills=data.skills,
            interests=data.interests,
            preferred_role=data.preferred_role,
            team_preference=data.team_preference,
            availability_time=avail,
            hackathons_participated=part,
            hackathons_won=won
        )

def get_profile_by_user_id(user_id: str) -> Optional[StudentProfileResponse]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT user_id, name, college, qualification, skills, interests, preferred_role, team_preference, availability_time, hackathons_participated, hackathons_won
            FROM student_profiles
            WHERE user_id = ?;
        """, (user_id,))
        row = cursor.fetchone()
        if not row:
            return None
        
        skills = json.loads(row["skills"]) if row["skills"] else []
        interests = json.loads(row["interests"]) if row["interests"] else []
        
        # Handle backward compatibility for existing SQLite rows
        keys = row.keys()
        avail = row["availability_time"] if "availability_time" in keys and row["availability_time"] else "Flexible"
        part = row["hackathons_participated"] if "hackathons_participated" in keys and row["hackathons_participated"] is not None else 0
        won = row["hackathons_won"] if "hackathons_won" in keys and row["hackathons_won"] is not None else 0

        return StudentProfileResponse(
            user_id=row["user_id"],
            name=row["name"],
            college=row["college"],
            qualification=row["qualification"],
            skills=skills,
            interests=interests,
            preferred_role=row["preferred_role"],
            team_preference=row["team_preference"],
            availability_time=avail,
            hackathons_participated=part,
            hackathons_won=won
        )

def get_teammate_matches(current_user_id: str) -> TeamMatchResponse:
    current_profile = get_profile_by_user_id(current_user_id)
    cur_skills = set(s.lower() for s in current_profile.skills) if current_profile else set()
    cur_interests = set(i.lower() for i in current_profile.interests) if current_profile else set()
    cur_role = current_profile.preferred_role.lower() if current_profile and current_profile.preferred_role else ""
    cur_avail = current_profile.availability_time if current_profile and current_profile.availability_time else "Flexible"

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT user_id, name, skills, interests, preferred_role, availability_time, hackathons_participated, hackathons_won
            FROM student_profiles
            WHERE user_id != ?;
        """, (current_user_id,))
        rows = cursor.fetchall()

        matches: List[TeamMatch] = []
        for row in rows:
            u_id = row["user_id"]
            u_name = row["name"]
            skills = json.loads(row["skills"]) if row["skills"] else []
            interests = json.loads(row["interests"]) if row["interests"] else []
            pref_role = row["preferred_role"] or ""
            keys = row.keys()
            avail = row["availability_time"] if "availability_time" in keys and row["availability_time"] else "Flexible"
            part = row["hackathons_participated"] if "hackathons_participated" in keys and row["hackathons_participated"] is not None else 0
            won = row["hackathons_won"] if "hackathons_won" in keys and row["hackathons_won"] is not None else 0

            cand_skills = set(s.lower() for s in skills)
            cand_interests = set(i.lower() for i in interests)
            cand_role = pref_role.lower()

            # Matching algorithm
            score = 50  # Base compatibility score
            
            # Shared interests (+15 per shared interest)
            shared_interests = cur_interests.intersection(cand_interests)
            score += len(shared_interests) * 15

            # Role complementarity (+25 if roles are complementary/different)
            if cur_role and cand_role and cur_role != cand_role:
                score += 25

            # Skills synergy (+10 per shared or complementary skill)
            shared_skills = cur_skills.intersection(cand_skills)
            score += len(shared_skills) * 10

            # Experience bonus (+5 if candidate has hackathon experience)
            if part > 0:
                score += min(part * 2, 10)

            # Clamp score between 25 and 98
            clamped_score = max(25, min(score, 98))

            matches.append(
                TeamMatch(
                    user_id=u_id,
                    name=u_name,
                    skills=skills,
                    interests=interests,
                    preferred_role=pref_role if pref_role else None,
                    availability_time=avail,
                    hackathons_participated=part,
                    hackathons_won=won,
                    match_score=clamped_score
                )
            )

        # Sort matches by match_score descending
        matches.sort(key=lambda m: m.match_score, reverse=True)
        return TeamMatchResponse(items=matches, count=len(matches))

def create_team(creator_user_id: str, data: TeamCreate) -> TeamResponse:
    team_id = f"team_{uuid.uuid4().hex[:12]}"
    created_at = datetime.now(timezone.utc).isoformat()

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO teams (team_id, name, creator_user_id, hackathon_id, created_at)
            VALUES (?, ?, ?, ?, ?);
        """, (team_id, data.name, creator_user_id, data.hackathon_id, created_at))

        cursor.execute("""
            INSERT INTO team_members (team_id, user_id, role)
            VALUES (?, ?, ?);
        """, (team_id, creator_user_id, "Creator"))
        conn.commit()

        members = [TeamMember(user_id=creator_user_id, role="Creator")]
        return TeamResponse(
            team_id=team_id,
            name=data.name,
            creator_user_id=creator_user_id,
            hackathon_id=data.hackathon_id,
            members=members,
            created_at=created_at
        )

def get_team_by_id(team_id: str) -> Optional[TeamResponse]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT team_id, name, creator_user_id, hackathon_id, created_at
            FROM teams
            WHERE team_id = ?;
        """, (team_id,))
        t_row = cursor.fetchone()
        if not t_row:
            return None

        cursor.execute("""
            SELECT user_id, role
            FROM team_members
            WHERE team_id = ?;
        """, (team_id,))
        m_rows = cursor.fetchall()
        members = [TeamMember(user_id=m["user_id"], role=m["role"]) for m in m_rows]

        return TeamResponse(
            team_id=t_row["team_id"],
            name=t_row["name"],
            creator_user_id=t_row["creator_user_id"],
            hackathon_id=t_row["hackathon_id"],
            members=members,
            created_at=t_row["created_at"]
        )

def join_team(team_id: str, user_id: str, role: str = "Member") -> TeamResponse:
    team = get_team_by_id(team_id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": "not_found",
                "message": f"Team with id '{team_id}' not found",
                "details": {}
            }
        )

    # Check if already a member
    for m in team.members:
        if m.user_id == user_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "error": "already_member",
                    "message": "User is already a member of this team",
                    "details": {}
                }
            )

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO team_members (team_id, user_id, role)
            VALUES (?, ?, ?);
        """, (team_id, user_id, role))
        conn.commit()

    return get_team_by_id(team_id)
