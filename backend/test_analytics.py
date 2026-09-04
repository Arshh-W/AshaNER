# test_analytics.py
import requests

BASE_URL = "http://127.0.0.1:8000/api/v1"

def test_analytics_endpoints():
    print("🔑 Step 1: Authenticating to obtain JWT Access Token...")
    login_payload = {
        "username": "caregiver@example.com",
        "password": "password123"
    }
    
    auth_resp = requests.post(f"{BASE_URL}/auth/login", data=login_payload)
    if auth_resp.status_code != 200:
        print(f"❌ Login failed ({auth_resp.status_code}): {auth_resp.text}")
        return

    token = auth_resp.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    patient_id = 1
    print("✅ Authenticated successfully!\n")

    # 1. Trajectory Endpoint (7 Days)
    print("📈 Step 2: Testing 7-Day Clinical Trajectories...")
    traj_resp = requests.get(f"{BASE_URL}/analytics/patient/{patient_id}/trajectory?days=7", headers=headers)
    print(f"Status: {traj_resp.status_code}")
    print(f"Response: {traj_resp.json()}\n")

    # 2. Sundowning Agitation Heatmap Endpoint
    print("🔥 Step 3: Testing Sundowning Agitation Heatmap...")
    heatmap_resp = requests.get(f"{BASE_URL}/analytics/patient/{patient_id}/sundowning-heatmap", headers=headers)
    print(f"Status: {heatmap_resp.status_code}")
    print(f"Sample (First 3 Hours): {heatmap_resp.json().get('hourly_heatmap', [])[:3]}\n")

    # 3. Adherence & Game Completion Endpoint
    print("💊 Step 4: Testing Daily Adherence & Game Completion Rates...")
    adh_resp = requests.get(f"{BASE_URL}/analytics/patient/{patient_id}/adherence", headers=headers)
    print(f"Status: {adh_resp.status_code}")
    print(f"Response: {adh_resp.json()}\n")

    # 4. XAI Clinical Event Cards Endpoint
    print("🎴 Step 5: Testing Explainable AI (XAI) Clinical Cards...")
    xai_resp = requests.get(f"{BASE_URL}/analytics/patient/{patient_id}/xai-cards", headers=headers)
    print(f"Status: {xai_resp.status_code}")
    print(f"Response: {xai_resp.json()}\n")

if __name__ == "__main__":
    test_analytics_endpoints()