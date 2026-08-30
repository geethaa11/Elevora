import logging
import json
from typing import List, Optional, Tuple, Dict, Set
from fastapi import HTTPException, status
from app.schemas.teaming import (
    StudentProfileResponse,
    GraphMatchResponse,
    TeamMemberMatchDetail
)
from app.services.teaming_service import get_profile_by_user_id
from app.database.db import get_connection

logger = logging.getLogger("elevora.graph_matching")

# --- 1. Availability Parser ---

def parse_availability_time(avail_str: Optional[str]) -> Tuple[bool, Optional[int], Optional[int]]:
    """
    Parses availability strings such as '6 PM - 10 PM', '7 PM - 11 PM', '09:00 - 17:00', or 'Flexible'.
    Returns (is_flexible, start_hour_24, end_hour_24).
    Safely falls back to (True, None, None) on unexpected/malformed format.
    """
    if not avail_str or not avail_str.strip() or "flexible" in avail_str.lower():
        return (True, None, None)
    
    try:
        parts = avail_str.split("-")
        if len(parts) != 2:
            return (True, None, None)
        
        def parse_single(t_str: str) -> int:
            t = t_str.strip().upper()
            is_pm = "PM" in t
            is_am = "AM" in t
            cleaned = t.replace("PM", "").replace("AM", "").strip()
            if ":" in cleaned:
                hour = int(cleaned.split(":")[0])
            else:
                hour = int(cleaned)
            
            if is_pm and hour < 12:
                hour += 12
            elif is_am and hour == 12:
                hour = 0
            return hour

        start_h = parse_single(parts[0])
        end_h = parse_single(parts[1])
        return (False, start_h, end_h)
    except Exception as e:
        logger.debug(f"Safely caught malformed availability string '{avail_str}': {e}")
        return (True, None, None)

def check_availability_overlap(avail_a: str, avail_b: str) -> Tuple[bool, int]:
    """
    Safely evaluates availability overlap between two student profiles.
    Returns (has_overlap, score_bonus).
    """
    flex_a, start_a, end_a = parse_availability_time(avail_a)
    flex_b, start_b, end_b = parse_availability_time(avail_b)

    if flex_a or flex_b:
        return (True, 20)
    
    if start_a is not None and end_a is not None and start_b is not None and end_b is not None:
        if max(start_a, start_b) < min(end_a, end_b):
            return (True, 20)
        else:
            return (False, 0)
    
    return (True, 20)

# --- 2. Graph & Weighted Edge Construction ---

def compute_pairwise_compatibility(
    node_a: StudentProfileResponse,
    node_b: StudentProfileResponse
) -> Tuple[int, List[str], List[str], List[str], bool]:
    """
    Computes deterministic pairwise edge weight between student A and candidate B.
    Considers skills, role complementarity, common interests, availability, and hackathon wins/experience.
    """
    skills_a = set(s.lower() for s in node_a.skills)
    skills_b = set(s.lower() for s in node_b.skills)
    
    interests_a = set(i.lower() for i in node_a.interests)
    interests_b = set(i.lower() for i in node_b.interests)

    role_a = (node_a.preferred_role or "").lower()
    role_b = (node_b.preferred_role or "").lower()

    shared_skills_set = skills_a.intersection(skills_b)
    comp_skills_set = skills_b.difference(skills_a)
    shared_interests_set = interests_a.intersection(interests_b)

    shared_skills = [s for s in node_b.skills if s.lower() in shared_skills_set]
    complementary_skills = [s for s in node_b.skills if s.lower() in comp_skills_set]
    shared_interests = [i for i in node_b.interests if i.lower() in shared_interests_set]

    # Base compatibility weight
    score = 30

    # Common interests (+15 per shared interest)
    score += len(shared_interests_set) * 15

    # Role & skill complementarity (+25 if roles differ, +8 per complementary skill)
    if role_a and role_b and role_a != role_b:
        score += 25
    if len(comp_skills_set) > 0:
        score += min(len(comp_skills_set) * 8, 24)

    # Shared skills (+10 per shared skill)
    score += len(shared_skills_set) * 10

    # Availability overlap (+20 if overlap or flexible)
    has_overlap, avail_points = check_availability_overlap(node_a.availability_time, node_b.availability_time)
    score += avail_points

    # Hackathon experience & wins (+2 per participation, +5 per win)
    exp_points = min((node_b.hackathons_participated * 2) + (node_b.hackathons_won * 5), 20)
    score += exp_points

    # Clamp edge weight between 25 and 99
    final_score = max(25, min(score, 99))

    return (final_score, shared_skills, complementary_skills, shared_interests, has_overlap)


class StudentNode:
    def __init__(self, profile: StudentProfileResponse):
        self.profile = profile

class WeightedEdge:
    def __init__(
        self,
        u: str,
        v: str,
        weight: int,
        shared_skills: List[str],
        comp_skills: List[str],
        shared_interests: List[str],
        avail_overlap: bool
    ):
        self.u = u
        self.v = v
        self.weight = weight
        self.shared_skills = shared_skills
        self.comp_skills = comp_skills
        self.shared_interests = shared_interests
        self.avail_overlap = avail_overlap

class CompatibilityGraph:
    def __init__(self):
        self.nodes: Dict[str, StudentNode] = {}
        self.edges: Dict[Tuple[str, str], WeightedEdge] = {}

    def add_node(self, profile: StudentProfileResponse):
        self.nodes[profile.user_id] = StudentNode(profile)

    def add_edge(
        self,
        u: str,
        v: str,
        weight: int,
        shared_skills: List[str],
        comp_skills: List[str],
        shared_interests: List[str],
        avail_overlap: bool
    ):
        edge = WeightedEdge(u, v, weight, shared_skills, comp_skills, shared_interests, avail_overlap)
        self.edges[(u, v)] = edge
        self.edges[(v, u)] = edge

    def get_edge(self, u: str, v: str) -> Optional[WeightedEdge]:
        return self.edges.get((u, v))


# --- 3. Dynamic Programming (DP) Team Optimizer ---

def optimize_team_selection_dp(
    graph: CompatibilityGraph,
    source_user_id: str,
    candidate_ids: List[str],
    k_teammates_needed: int
) -> List[str]:
    """
    DYNAMIC PROGRAMMING RECURRENCE & MEMOIZATION
    
    State: (i, selected_mask)
    - i: Index of candidate currently evaluated in candidate_ids list (0 <= i < N).
    - selected_mask: Bitmask of selected candidate indices (popcount = selected count <= k).
    
    Objective Function:
    Maximize total team value = Sum(edge(S_src, c)) + Sum(edge(c_i, c_j)) + DiversityBonus
    
    Memoization Table:
    memo[(i, selected_mask)] -> (max_score, best_selected_indices)
    """
    N = len(candidate_ids)
    if N < k_teammates_needed:
        return candidate_ids

    memo: Dict[Tuple[int, int], Tuple[float, List[int]]] = {}

    def dp(i: int, selected_mask: int) -> Tuple[float, List[int]]:
        count = bin(selected_mask).count('1')
        
        # Base Cases
        if count == k_teammates_needed:
            return (0.0, [])
        if i >= N:
            return (float('-inf'), [])

        state_key = (i, selected_mask)
        if state_key in memo:
            return memo[state_key]

        # Option 1: Skip candidate i
        score_skip, indices_skip = dp(i + 1, selected_mask)

        # Option 2: Include candidate i
        cand_id = candidate_ids[i]
        edge_src = graph.get_edge(source_user_id, cand_id)
        incremental_score = edge_src.weight if edge_src else 30.0

        # Add peer synergy with already selected candidates
        for prev_idx in range(N):
            if (selected_mask & (1 << prev_idx)):
                prev_id = candidate_ids[prev_idx]
                p_edge = graph.get_edge(prev_id, cand_id)
                if p_edge:
                    incremental_score += p_edge.weight * 0.4  # Peer synergy scaling

        score_include_sub, indices_sub = dp(i + 1, selected_mask | (1 << i))
        score_include = incremental_score + score_include_sub

        if score_include > score_skip:
            best_score = score_include
            best_indices = [i] + indices_sub
        else:
            best_score = score_skip
            best_indices = indices_skip

        memo[state_key] = (best_score, best_indices)
        return memo[state_key]

    _, best_candidate_indices = dp(0, 0)
    return [candidate_ids[idx] for idx in best_candidate_indices]


# --- 4. Main Service Entry Point ---

def find_optimal_team_graph_dp(
    current_user_id: str,
    team_size: int
) -> GraphMatchResponse:
    """
    Builds in-memory compatibility graph, runs 0/1 Knapsack State-Space Dynamic Programming
    to maximize overall team synergy & complementarity, and returns structured response.
    """
    k_teammates_needed = team_size - 1

    # Load source student profile
    source_profile = get_profile_by_user_id(current_user_id)
    if not source_profile:
        # Create default profile if not present
        source_profile = StudentProfileResponse(
            user_id=current_user_id,
            name="Current Student",
            skills=["Python", "General"],
            interests=["Technology"],
            preferred_role="Developer",
            availability_time="Flexible",
            hackathons_participated=0,
            hackathons_won=0
        )

    # Load all candidate student profiles from SQLite database
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT user_id, name, college, qualification, skills, interests, preferred_role, team_preference, availability_time, hackathons_participated, hackathons_won
            FROM student_profiles
            WHERE user_id != ?;
        """, (current_user_id,))
        rows = cursor.fetchall()

    candidate_profiles: List[StudentProfileResponse] = []
    for row in rows:
        keys = row.keys()
        skills = json.loads(row["skills"]) if row["skills"] else []
        interests = json.loads(row["interests"]) if row["interests"] else []
        avail = row["availability_time"] if "availability_time" in keys and row["availability_time"] else "Flexible"
        part = row["hackathons_participated"] if "hackathons_participated" in keys and row["hackathons_participated"] is not None else 0
        won = row["hackathons_won"] if "hackathons_won" in keys and row["hackathons_won"] is not None else 0

        p = StudentProfileResponse(
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
        candidate_profiles.append(p)

    if not candidate_profiles:
        return GraphMatchResponse(
            algorithm="Graph + Dynamic Programming (DP) Team Optimizer",
            requested_team_size=team_size,
            source_user_id=current_user_id,
            team_overall_score=50,
            selected_team_members=[],
            explanation="No candidate student profiles found in database to form a team."
        )

    # Construct In-Memory Compatibility Graph
    graph = CompatibilityGraph()
    graph.add_node(source_profile)

    candidate_edge_details: List[Tuple[StudentProfileResponse, int, List[str], List[str], List[str], bool]] = []

    for cand in candidate_profiles:
        graph.add_node(cand)
        weight, shared_skills, comp_skills, shared_interests, avail_overlap = compute_pairwise_compatibility(source_profile, cand)
        graph.add_edge(source_profile.user_id, cand.user_id, weight, shared_skills, comp_skills, shared_interests, avail_overlap)
        candidate_edge_details.append((cand, weight, shared_skills, comp_skills, shared_interests, avail_overlap))

    # Also compute inter-candidate edges for synergy evaluation
    for i in range(len(candidate_profiles)):
        for j in range(i + 1, len(candidate_profiles)):
            c1 = candidate_profiles[i]
            c2 = candidate_profiles[j]
            w, s_sk, c_sk, s_in, av_ov = compute_pairwise_compatibility(c1, c2)
            graph.add_edge(c1.user_id, c2.user_id, w, s_sk, c_sk, s_in, av_ov)

    # Sort candidate profiles by direct compatibility with source student
    candidate_edge_details.sort(key=lambda x: x[1], reverse=True)

    # Bound candidate search pool to top 15 candidates for DP state space efficiency
    bounded_candidates = candidate_edge_details[:15]
    bounded_candidate_ids = [c[0].user_id for c in bounded_candidates]
    id_to_details = {c[0].user_id: c for c in bounded_candidates}

    # Run Dynamic Programming Optimization Algorithm
    selected_candidate_ids = optimize_team_selection_dp(
        graph=graph,
        source_user_id=current_user_id,
        candidate_ids=bounded_candidate_ids,
        k_teammates_needed=min(k_teammates_needed, len(bounded_candidate_ids))
    )

    # Construct Response Objects
    selected_member_details: List[TeamMemberMatchDetail] = []
    total_score_sum = 0

    for cand_id in selected_candidate_ids:
        cand, weight, shared_skills, comp_skills, shared_interests, avail_overlap = id_to_details[cand_id]
        total_score_sum += weight

        selected_member_details.append(
            TeamMemberMatchDetail(
                user_id=cand.user_id,
                name=cand.name,
                skills=cand.skills,
                interests=cand.interests,
                preferred_role=cand.preferred_role,
                availability_time=cand.availability_time,
                hackathons_participated=cand.hackathons_participated,
                hackathons_won=cand.hackathons_won,
                compatibility_score=weight,
                shared_skills=shared_skills,
                complementary_skills=comp_skills,
                shared_interests=shared_interests,
                availability_overlap=avail_overlap
            )
        )

    overall_team_score = int(total_score_sum / len(selected_member_details)) if selected_member_details else 50

    explanation = (
        f"Selected top {len(selected_member_details)} teammates out of {len(candidate_profiles)} candidates "
        f"using 0/1 Knapsack Dynamic Programming over an in-memory compatibility graph. "
        f"Maximizes skill complementarity, interest alignment, availability overlap, and hackathon experience."
    )

    return GraphMatchResponse(
        algorithm="Graph + Dynamic Programming (DP) Team Optimizer",
        requested_team_size=team_size,
        source_user_id=current_user_id,
        team_overall_score=overall_team_score,
        selected_team_members=selected_member_details,
        explanation=explanation
    )
