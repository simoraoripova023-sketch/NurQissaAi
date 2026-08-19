import os
import requests

api_key = os.environ.get('ELEVENLABS_API_KEY', 'sk_a2f342ffaaf5d1c4a6c0c1585187cfd7baeca773a9de137b')
headers = {
    'xi-api-key': api_key
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
