import os
import requests

api_key = os.environ.get('ELEVENLABS_API_KEY', 'sk_36cc88373abb9fb6f6054b7144e8485d98857eff66fe51f6')
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
