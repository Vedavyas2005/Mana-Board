# app.py (corrected)
from fastapi import FastAPI, HTTPException, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from typing import Optional

app = FastAPI()

# --- CORS: enable for dev + deployed frontend ---
# Add the frontend origin(s) you need; for local dev keep http://localhost:3000
# If you need multiple origins, list them explicitly.
origins = [
    "http://localhost:3000",
    # "https://your-production-frontend.example.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              # do NOT set ["*"] together with allow_credentials=True
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (dev only)
users = []
plans = []
notifications = []
billings = []

# ---------------------------
# Health check
# ---------------------------
@app.get("/")
def health_check():
    return {"message": "Backend is up and running!"}

# ---------------------------
# Auth
# ---------------------------
@app.post("/auth/signup")
def signup(user: dict):
    """
    Expect user dict with at least: email, password, role(optional).
    We will save the user object as-is (simple dev store).
    """
    email = user.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    # ensure role exists, default user
    if "role" not in user or not user.get("role"):
        user["role"] = "user"
    users.append(user)
    return {"message": "User signed up successfully", "user": user}


@app.post("/auth/login")
def login(credentials: dict):
    email = credentials.get("email")
    password = credentials.get("password")
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")
    for user in users:
        if user.get("email") == email and user.get("password") == password:
            # return user object (contains role if created via signup)
            return {"message": "Login successful", "user": user}
    raise HTTPException(status_code=401, detail="Invalid credentials")


@app.get("/auth/me")
def get_current_user(email: Optional[str] = None):
    """
    Simple endpoint that returns user metadata by email param.
    Frontend uses email as query param.
    """
    if not email:
        raise HTTPException(status_code=400, detail="Email parameter missing")
    # in real DB you would lookup the user and return proper details
    for u in users:
        if u.get("email") == email:
            return {"email": u.get("email"), "role": u.get("role", "user")}
    # If not found, still return minimal
    return {"email": email, "role": "user"}


# ---------------------------
# User profile & dashboard
# ---------------------------
@app.get("/user/profile")
def get_user_profile(email: Optional[str] = None):
    """
    Fetch profile for a specific user only.
    Accessible by logged-in user (frontend uses saved email header).
    """
    if not email:
        raise HTTPException(status_code=400, detail="Missing email parameter")
    # try to find user in in-memory store
    for u in users:
        if u.get("email") == email:
            # return stored profile keys (pick safe keys)
            return {
                "email": u.get("email"),
                "first_name": u.get("first_name", ""),
                "last_name": u.get("last_name", ""),
                "role": u.get("role", "user"),
                "dashboard": {
                    "notifications": ["Welcome!", "Your plan is active."],
                    "plans": [{"name": "Basic Plan", "status": "Active"}],
                },
            }
    # dummy fallback (for dev)
    return {
        "email": email,
        "first_name": "Lucky",
        "last_name": "M",
        "role": "user",
        "dashboard": {
            "notifications": ["Welcome!", "Your plan is active."],
            "plans": [{"name": "Basic Plan", "status": "Active"}],
        },
    }


@app.post("/user/profile/update")
def update_user_profile(data: dict):
    """
    Update user profile (only their own info).
    Body must contain email and fields to update (first_name, last_name).
    """
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email required")
    # Find user in store and update
    for u in users:
        if u.get("email") == email:
            # update permitted fields
            if "first_name" in data:
                u["first_name"] = data["first_name"]
            if "last_name" in data:
                u["last_name"] = data["last_name"]
            return {"message": f"Profile for {email} updated successfully!", "user": u}
    # If user not found, optionally create? For now return error
    raise HTTPException(status_code=404, detail="User not found")


@app.get("/user/dashboard")
def user_dashboard(email: Optional[str] = None):
    """
    Get user dashboard info — only their own data.
    """
    if not email:
        raise HTTPException(status_code=400, detail="Missing email parameter")
    # In a real DB return personalized data; dev return dummy
    return {
        "email": email,
        "notifications": ["Welcome to your dashboard!", "New updates available."],
        "plans": [
            {"name": "Basic Plan", "renewal": "2025-12-31"},
            {"name": "Add-on Storage", "renewal": "2025-06-30"},
        ],
    }


# ---------------------------
# Admin routes
# ---------------------------
@app.get("/admin/dashboard")
def admin_dashboard(role: Optional[str] = Header(None)):
    """
    Admin-only overview.
    Request must include header 'role: admin' (frontend interceptor sets that).
    """
    if role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    return {
        "total_users": len(users) if users else 25,
        "active_users": len(users),  # simple metric for dev
        "pending_users": 0,
        "notifications": ["5 new signups today", "1 plan upgrade pending approval"],
    }


@app.get("/admin/users")
def get_all_users(role: Optional[str] = Header(None)):
    """
    Admin-only route: Fetch all users and their dashboards.
    """
    if role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    # Return either stored users or sample list
    if users:
        # map to safe shape
        safe_users = []
        for u in users:
            safe_users.append({
                "email": u.get("email"),
                "first_name": u.get("first_name", ""),
                "last_name": u.get("last_name", ""),
                "role": u.get("role", "user"),
            })
        return {"users": safe_users}
    # fallback sample
    return {
        "users": [
            {"email": "user1@gmail.com", "first_name": "Luci", "last_name": "M", "role": "user"},
            {"email": "admin@gmail.com", "first_name": "Vedavyas", "last_name": "Dasari", "role": "admin"},
        ]
    }

# NOTE: you asked NOT to add /admin/users/update — we keep it excluded here.


# ---------------------------
# Generic endpoints used by frontend
# ---------------------------
@app.get("/users")
def get_users():
    """
    Public listing of users (for dev) — your frontend uses /users in some places.
    """
    safe = []
    for u in users:
        safe.append({"email": u.get("email"), "first_name": u.get("first_name", ""), "last_name": u.get("last_name", ""), "role": u.get("role", "user")})
    return {"users": safe}


# Billing
@app.post("/billing")
def add_billing(bill: dict):
    billings.append(bill)
    return {"message": "Billing saved", "bill": bill}


@app.get("/billing")
def get_billing():
    return {"billings": billings}


# Notifications
@app.get("/notifications")
def get_notifications():
    return {"notifications": notifications}


@app.post("/notifications")
def add_notification(note: dict):
    notifications.append(note)
    return {"message": "Notification added", "note": note}


# Plans management
@app.get("/plans")
def get_plans():
    return {"plans": plans}


@app.post("/plans")
def add_plan(plan: dict):
    plans.append(plan)
    return {"message": "Plan added", "plan": plan}


# Lambda handler
handler = Mangum(app)
