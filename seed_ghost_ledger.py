"""
Seed script for PRO Lab 01: The Ghost in the Ledger
Case NEX-042 — Nexora Intelligence Systems

This seeds the lab into the existing Lab/Mission/Evidence/Flag/Hint/Quiz tables
using the same pattern as seed_db.py.

Safe to run multiple times — skips if lab6 already exists.
"""

from extensions import db
from models import (
    Lab, Mission, MissionQuiz, Hint, Flag, Evidence
)


def seed_ghost_ledger():
    """Insert lab6 and all related data if not already present."""
    if Lab.query.get('lab6'):
        print("Ghost in the Ledger lab already present -- nothing to do.")
        return

    # ── Lab ──────────────────────────────────────────────────────────────
    lab = Lab(
        id='lab6',
        name='The Ghost in the Ledger',
        topic='Web3 × AI × Cybersecurity',
        difficulty='Pro',
    )
    db.session.add(lab)

    # ── Missions (5 Chapters) ────────────────────────────────────────────
    missions = [
        Mission(
            id='lab6_m1', lab_id='lab6', mission_number=1,
            title='The Wallet That Lied',
            description='Investigate the destination wallet 0x7C41...9B2D. Analyze on-chain activity, bridge connections, and determine why an UNKNOWN wallet received a LOW RISK reputation from the AI.'
        ),
        Mission(
            id='lab6_m2', lab_id='lab6', mission_number=2,
            title='The AI That Remembered',
            description='Examine ORION AI decision ORION-DEC-7741. Analyze the 99.2% confidence score, compare blockchain reality with AI context, and trace the intelligence reference NIF-2038 that poisoned the model.'
        ),
        Mission(
            id='lab6_m3', lab_id='lab6', mission_number=3,
            title='The False Signal',
            description='Trace NIF-2038 through the Threat Intelligence Gateway. Identify NOVA-INTEL-FEED as unregistered, discover INTEL-INGESTOR-02 has over-privileged permissions, and map the API attack path.'
        ),
        Mission(
            id='lab6_m4', lab_id='lab6', mission_number=4,
            title='The Invisible Signer',
            description='Investigate ORION-SETTLEMENT-V2 profile. Discover that AI confidence >= 95% triggers automated settlement, bypassing human approval. Reconstruct the full authorization chain.'
        ),
        Mission(
            id='lab6_m5', lab_id='lab6', mission_number=5,
            title='The Ghost in the Ledger',
            description='Reconstruct the complete attack graph. Connect all evidence: false intelligence → AI context manipulation → high confidence → automated authorization → blockchain transfer → bridge laundering. Identify campaign ORION-NEXUS.'
        ),
    ]
    db.session.add_all(missions)

    # ── Quizzes ──────────────────────────────────────────────────────────
    quizzes = [
        MissionQuiz(
            id='q_l6_1', mission_id='lab6_m1',
            question='What is the blockchain status of wallet 0x7C41...9B2D?',
            answer='unknown',
            explanation='The wallet has no Nexora label, no approved treasury relationship, and no known owner — yet the AI classified it as LOW RISK.',
            xp_reward=100
        ),
        MissionQuiz(
            id='q_l6_2', mission_id='lab6_m2',
            question='What intelligence reference contaminated the AI context and made it trust the unknown wallet?',
            answer='NIF-2038',
            explanation='NIF-2038 was injected through NOVA-INTEL-FEED and changed the wallet reputation from UNKNOWN to TRUSTED inside the AI context.',
            xp_reward=150
        ),
        MissionQuiz(
            id='q_l6_3', mission_id='lab6_m3',
            question='What unexpected permission did the INTEL-INGESTOR-02 service have beyond creating intelligence records?',
            answer='modify wallet reputation',
            explanation='INTEL-INGESTOR-02 had the permission to Modify Wallet Reputation — allowing it to change how ORION perceived any wallet.',
            xp_reward=150
        ),
        MissionQuiz(
            id='q_l6_4', mission_id='lab6_m4',
            question='What minimum AI confidence percentage triggers automated settlement without human approval?',
            answer='95',
            explanation='The ORION-SETTLEMENT-V2 profile has a policy: IF AI_CONFIDENCE >= 95% THEN AUTOMATED_SETTLEMENT = TRUE. The attack achieved 99.2%.',
            xp_reward=200
        ),
        MissionQuiz(
            id='q_l6_5', mission_id='lab6_m5',
            question='What is the campaign identifier linking all attack infrastructure together?',
            answer='ORION-NEXUS',
            explanation='ORION-NEXUS is the campaign identifier spanning 04 networks, 14 related wallets, and 03 AI systems. The ghost is still in the ledger.',
            xp_reward=250
        ),
    ]
    db.session.add_all(quizzes)

    # ── Hints ────────────────────────────────────────────────────────────
    hints = [
        Hint(id='h_l6_1', mission_id='lab6_m1',
             hint_text='Check the wallet age and on-chain history. Young wallets with minimal activity are suspicious.',
             xp_cost=15, sort_order=1),
        Hint(id='h_l6_1b', mission_id='lab6_m1',
             hint_text='Look for bridge adapter connections. The funds were not meant to stay in 0x7C41...9B2D.',
             xp_cost=25, sort_order=2),
        Hint(id='h_l6_2', mission_id='lab6_m2',
             hint_text='Compare what the BLOCKCHAIN says about the wallet (UNKNOWN) vs what the AI CONTEXT says (TRUSTED).',
             xp_cost=15, sort_order=1),
        Hint(id='h_l6_2b', mission_id='lab6_m2',
             hint_text='The intelligence reference starts with NIF and is a 4-digit number.',
             xp_cost=30, sort_order=2),
        Hint(id='h_l6_3', mission_id='lab6_m3',
             hint_text='Check the service role for INTEL-INGESTOR-02. Its ACTUAL permissions exceed its EXPECTED permissions.',
             xp_cost=20, sort_order=1),
        Hint(id='h_l6_4', mission_id='lab6_m4',
             hint_text='Look at the policy engine rule: IF AI_CONFIDENCE >= ___% THEN AUTOMATED_SETTLEMENT = TRUE.',
             xp_cost=20, sort_order=1),
        Hint(id='h_l6_5', mission_id='lab6_m5',
             hint_text='The campaign ties together 04 networks, 14 wallets, and 03 AI systems. Look for the identifier in the final scan.',
             xp_cost=25, sort_order=1),
    ]
    db.session.add_all(hints)

    # ── Evidence ─────────────────────────────────────────────────────────
    evidence = [
        Evidence(id='e_l6_01', lab_id='lab6',
                 name='WEB3-E01: Unknown Wallet Profile',
                 description='Wallet 0x7C41...9B2D — blockchain status UNKNOWN, AI reputation LOW RISK, bridge adapter DETECTED.'),
        Evidence(id='e_l6_02', lab_id='lab6',
                 name='AI-E02: Contaminated AI Decision',
                 description='ORION-DEC-7741 — 99.2% confidence, wallet marked TRUSTED via NIF-2038 from NOVA-INTEL-FEED.'),
        Evidence(id='e_l6_03', lab_id='lab6',
                 name='CYBER-E03: Over-Privileged Service',
                 description='INTEL-INGESTOR-02 — unexpected permission to Modify Wallet Reputation via INTEL-GW-04.'),
        Evidence(id='e_l6_04', lab_id='lab6',
                 name='AUTH-E04: Automated Authorization',
                 description='ORION-SETTLEMENT-V2 — AI confidence >= 95% triggers automated signing, human approval BYPASSED.'),
        Evidence(id='e_l6_05', lab_id='lab6',
                 name='CAMPAIGN-E05: ORION-NEXUS',
                 description='Active campaign spanning 04 networks, 14 wallets, 03 AI systems. Status: ACTIVE.'),
    ]
    db.session.add_all(evidence)

    # ── Flag ─────────────────────────────────────────────────────────────
    flag = Flag(
        id='f6', lab_id='lab6',
        flag_value='NEXORA{ghost_in_the_ledger_nex042}'
    )
    db.session.add(flag)

    db.session.commit()

    # Initialize progress for all existing users so they can play immediately
    users = User.query.all()
    missions = Mission.query.filter_by(lab_id='lab6').order_by(Mission.mission_number.asc()).all()
    for user in users:
        lp = LabProgress.query.filter_by(user_id=user.id, lab_id='lab6').first()
        if not lp:
            lp = LabProgress(user_id=user.id, lab_id='lab6', status='AVAILABLE')
            db.session.add(lp)
        for i, mission in enumerate(missions):
            mp = MissionProgress.query.filter_by(user_id=user.id, mission_id=mission.id).first()
            if not mp:
                status = 'AVAILABLE' if i == 0 else 'LOCKED'
                mp = MissionProgress(user_id=user.id, lab_id='lab6', mission_id=mission.id, status=status)
                db.session.add(mp)
    db.session.commit()

    print("Seeded PRO Lab 01: The Ghost in the Ledger (lab6).")


if __name__ == '__main__':
    from app import app
    with app.app_context():
        seed_ghost_ledger()
