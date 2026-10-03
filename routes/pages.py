from flask import Blueprint, render_template, session, request
from models import Challenge, ChallengeProgress

pages_bp = Blueprint('pages', __name__)

# CyberLab Sim runs as its own Flask service (see docker-compose.yml's
# `cyberlab` service / cyberlab/Dockerfile), not inside this app. These
# challenge ids -> lab paths map the Challenge rows seeded by
# seed_cyberlab_challenges.py to the path each lab lives at inside that
# separate app, so the Challenges page can link straight to it.
CYBERLAB_LAB_PATHS = {
    'cyberlab_lab1': '/lab1/',
    'cyberlab_lab2': '/lab2/',
    'cyberlab_lab3': '/lab3/',
    'cyberlab_lab4': '/lab4/',
    'cyberlab_lab5': '/lab5/',
}
# Host port the cyberlab container is published on (see docker-compose.yml).
CYBERLAB_PORT = 5050


def _cyberlab_launch_urls():
    """Build launch URLs for the CyberLab challenges using the same
    hostname the student's browser is already using to reach this page,
    so it works whether the platform is on localhost or another host --
    only the port differs, since cyberlab is bound to 127.0.0.1 on the
    same machine (see docker-compose.yml comment on the cyberlab service).
    """
    hostname = request.host.split(':')[0]
    return {
        challenge_id: f"http://{hostname}:{CYBERLAB_PORT}{path}"
        for challenge_id, path in CYBERLAB_LAB_PATHS.items()
    }


@pages_bp.route('/challenges')
def challenges():
    challenges_list = Challenge.query.all()
    completed_ids = []
    if session.get('user_id'):
        user_progress = ChallengeProgress.query.filter_by(user_id=session.get('user_id')).all()
        completed_ids = [p.challenge_id for p in user_progress]

    return render_template(
        'challenges.html',
        title="Challenges",
        challenges=challenges_list,
        completed_ids=completed_ids,
        launch_urls=_cyberlab_launch_urls(),
    )

@pages_bp.route('/docs')
def docs():
    return render_template('docs.html', title="Documentation")

@pages_bp.route('/pricing')
def pricing():
    return render_template('pricing.html', title="Pricing")

@pages_bp.route('/achievements')
def achievements():
    return render_template('achievements.html', title="Achievements")

@pages_bp.route('/learning')
def learning():
    return render_template('learning.html', title="Learning")

@pages_bp.route('/profile')
def profile():
    from services.leaderboard_service import get_leaderboard
    
    stats = {
        'total_xp': 0,
        'labs_completed': 0,
        'missions_completed': 0,
        'rank': 'N/A'
    }
    
    if session.get('user_id'):
        username = session.get('username')
        leaderboard = get_leaderboard(limit=1000)
        for index, row in enumerate(leaderboard):
            if row['username'] == username:
                stats['total_xp'] = row['total_xp']
                stats['labs_completed'] = row['labs_completed']
                stats['missions_completed'] = row['missions_completed']
                stats['rank'] = f"#{index + 1}"
                break
                
    return render_template('profile.html', stats=stats)
