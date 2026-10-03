from extensions import db
from models import MissionQuiz, QuizAttempt, MissionProgress, LabProgress, Mission, EvidenceProgress

def evaluate_quiz(user_id, lab_id, mission_id, answer):
    """
    Evaluates a quiz answer against the database.
    Returns (success, message, xp_awarded)
    """
    quiz = MissionQuiz.query.filter_by(mission_id=mission_id).first()
    if not quiz:
        return False, "No quiz found for this mission.", 0

    user_raw = answer.strip().lower()
    target_raw = quiz.answer.strip().lower()

    user_clean = user_raw.replace('%', '').replace('_', ' ').replace('-', ' ').strip()
    target_clean = target_raw.replace('%', '').replace('_', ' ').replace('-', ' ').strip()

    user_nospace = ''.join(c for c in user_clean if c.isalnum())
    target_nospace = ''.join(c for c in target_clean if c.isalnum())

    correct = (
        (user_clean == target_clean) or 
        (user_raw == target_raw) or 
        (bool(user_nospace) and user_nospace == target_nospace)
    )
    
    # Also handle specific variations
    if not correct:
        if 'modify' in target_clean and 'wallet' in target_clean and ('modify' in user_clean and 'wallet' in user_clean):
            correct = True
        elif target_clean == 'unknown' and 'unknown' in user_clean:
            correct = True
        elif target_clean in ['95', '95%'] and ('95' in user_clean):
            correct = True
        elif 'orion' in target_clean and 'nexus' in target_clean and ('orion' in user_clean and 'nexus' in user_clean):
            correct = True
        elif 'nif' in target_clean and '2038' in target_clean and ('nif' in user_clean and '2038' in user_clean):
            correct = True
            
    # Record attempt
    attempt = QuizAttempt(user_id=user_id, mission_id=mission_id, answer=answer, correct=correct)
    db.session.add(attempt)
    
    if not correct:
        raw_lower = answer.strip().lower()
        if mission_id == 'lab6_m1' and ('0x7c41' in raw_lower or 'wallet' in raw_lower or '9b2d' in raw_lower):
            db.session.commit()
            return False, "Aapne wallet address daal diya! Question on-chain status pooch raha hai: Blockchain Status kya hai? (Hint: UNKNOWN)", 0
        if mission_id == 'lab6_m2' and ('orion-dec' in raw_lower or 'nova' in raw_lower):
            db.session.commit()
            return False, "That's the decision/feed! What was the specific intelligence reference code (starts with NIF-)?", 0
        if mission_id == 'lab6_m3' and ('intel-ingestor' in raw_lower):
            db.session.commit()
            return False, "That's the service name! What unexpected permission did it have? (Check Permissions column in Feed Registry)", 0
        if mission_id == 'lab6_m4' and ('orion-settlement' in raw_lower):
            db.session.commit()
            return False, "That's the profile name! What percentage threshold triggers auto-settle? (Look for % number in Policy Engine)", 0
    
    if correct:
        # Check if already completed
        mission_prog = MissionProgress.query.filter_by(user_id=user_id, mission_id=mission_id).first()
        if mission_prog and mission_prog.status == 'COMPLETED':
            # Even if already completed, ensure next mission is unlocked
            _unlock_next_mission(user_id, lab_id, mission_id)
            _collect_evidence_for_mission(user_id, lab_id, mission_id)
            db.session.commit()
            return True, "Correct! But already completed.", 0
             
        # Add XP
        xp = quiz.xp_reward
        lab_prog = LabProgress.query.filter_by(user_id=user_id, lab_id=lab_id).first()
        if lab_prog:
            lab_prog.score += xp
            db.session.add(lab_prog)
        
        # Mark as completed
        if not mission_prog:
            mission_prog = MissionProgress(user_id=user_id, lab_id=lab_id, mission_id=mission_id, status='COMPLETED')
        else:
            mission_prog.status = 'COMPLETED'
        db.session.add(mission_prog)

        # Unlock next mission
        _unlock_next_mission(user_id, lab_id, mission_id)

        # Auto-collect cryptographic evidence
        _collect_evidence_for_mission(user_id, lab_id, mission_id)
            
        db.session.commit()
        return True, "Correct! Next mission unlocked.", xp
    
    db.session.commit()
    return False, "Incorrect answer. Check the investigator clues and try again.", 0


def _unlock_next_mission(user_id, lab_id, mission_id):
    """Unlocks the next sequential mission in the lab."""
    current_mission = Mission.query.get(mission_id)
    if not current_mission:
        return
    next_m = Mission.query.filter_by(
        lab_id=lab_id,
        mission_number=current_mission.mission_number + 1
    ).first()
    if next_m:
        next_mp = MissionProgress.query.filter_by(user_id=user_id, mission_id=next_m.id).first()
        if not next_mp:
            next_mp = MissionProgress(user_id=user_id, lab_id=lab_id, mission_id=next_m.id, status='AVAILABLE')
            db.session.add(next_mp)
        elif next_mp.status == 'LOCKED':
            next_mp.status = 'AVAILABLE'
            db.session.add(next_mp)


def _collect_evidence_for_mission(user_id, lab_id, mission_id):
    """Auto-collects cryptographic evidence for lab6 chapters."""
    evidence_map = {
        'lab6_m1': 'e_l6_01',
        'lab6_m2': 'e_l6_02',
        'lab6_m3': 'e_l6_03',
        'lab6_m4': 'e_l6_04',
        'lab6_m5': 'e_l6_05'
    }
    ev_id = evidence_map.get(mission_id)
    if ev_id:
        ep = EvidenceProgress.query.filter_by(user_id=user_id, evidence_id=ev_id).first()
        if not ep:
            ep = EvidenceProgress(user_id=user_id, evidence_id=ev_id, collected=True)
            db.session.add(ep)
        elif not ep.collected:
            ep.collected = True
            db.session.add(ep)

