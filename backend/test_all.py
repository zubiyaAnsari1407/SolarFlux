import urllib.request, urllib.error, json, sys
from pymongo import MongoClient

print('=' * 60)
print('SOLARFLUX SYSTEM DIAGNOSTIC & VERIFICATION TEST')
print('=' * 60)

# 1. TEST MONGODB
print('\n[1/4] TESTING MONGODB CONNECTION...')
try:
    client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=3000)
    client.admin.command('ping')
    print('  [PASS] MongoDB Server: CONNECTED (localhost:27017)')
    
    db = client['solarflux']
    collections = db.list_collection_names()
    print('  [PASS] Database \"solarflux\" found. Collections:')
    for coll in ['dashboard', 'alerts', 'impact', 'recommendations', 'energy_history', 'weather']:
        count = db[coll].count_documents({})
        status = '[PASS]' if count > 0 else '[WARN]'
        print(f'     {status} {coll}: {count} document(s)')
except Exception as e:
    print(f'  [FAIL] MongoDB Connection Error: {e}')

# 2. TEST BACKEND API
print('\n[2/4] TESTING FASTAPI BACKEND ENDPOINTS...')
endpoints = [
    ('/', 'Root / Home'),
    ('/api/health', 'Health Check'),
    ('/api/dashboard/summary', 'Dashboard Summary'),
    ('/api/alerts', 'Alerts List'),
    ('/api/impact/today', 'Today Impact'),
    ('/api/recommendations', 'Recommendations'),
    ('/api/energy/history', 'Energy History'),
]

for path, desc in endpoints:
    url = f'http://127.0.0.1:8000{path}'
    try:
        req = urllib.request.urlopen(url, timeout=3)
        status = req.status
        body = req.read().decode()
        data = json.loads(body)
        print(f'  [PASS] {desc:22} ({path}): HTTP {status} OK')
    except Exception as e:
        print(f'  [FAIL] {desc:22} ({path}): FAILED ({e})')

# 3. TEST FRONTEND
print('\n[3/4] TESTING FRONTEND DEV SERVER...')
try:
    req = urllib.request.urlopen('http://localhost:5173/', timeout=3)
    print(f'  [PASS] Frontend Server: HTTP {req.status} OK (http://localhost:5173/)')
except Exception as e:
    print(f'  [FAIL] Frontend Server: FAILED ({e})')

# 4. TEST ESP32 HARDWARE
print('\n[4/4] TESTING ESP32 HARDWARE CONNECTION...')
try:
    req = urllib.request.urlopen('http://172.20.10.6/data', timeout=3)
    body = req.read().decode()
    data = json.loads(body)
    print('  [PASS] ESP32 Hardware: CONNECTED (http://172.20.10.6/data)')
    print(f'     Live Data: {data}')
except urllib.error.URLError as e:
    print(f'  [INFO] ESP32 Hardware: Currently unreachable ({e.reason})')
    print('     (Turn on ESP32 & connect to \"Ash\" hotspot when ready for live telemetry)')
except Exception as e:
    print(f'  [INFO] ESP32 Hardware: {e}')

print('\n' + '=' * 60)
print('DIAGNOSTIC FINISHED')
print('=' * 60)
