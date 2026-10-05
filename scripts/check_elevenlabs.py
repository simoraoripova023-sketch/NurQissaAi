import os
import requests

api_key = os.environ.get('ELEVENLABS_API_KEY')
if not api_key:
    # Try reading from .env.local
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('ELEVENLABS_API_KEY='):
                    api_key = line.split('=', 1)[1].strip()
                    break

headers = {
    'xi-api-key': api_key or ''
}

# Check user subscription / quota info
user_res = requests.get('https://api.elevenlabs.io/v1/user', headers=headers)
print("User info status:", user_res.status_code)
if user_res.status_code == 200:
    sub = user_res.json().get('subscription', {})
    print("Subscription tier:", sub.get('tier'))
    print("Character count:", sub.get('character_count'))
    print("Character limit:", sub.get('character_limit'))
    print("Can clone voice:", sub.get('can_use_instant_voice_cloning'))
