export function saveUserToStorage(user) {
  if (!user) return;
  localStorage.setItem("USER_EMAIL", user.email || "");
  localStorage.setItem("USER_ROLE", user.role || "user");
  localStorage.setItem("USER_FIRST_NAME", user.first_name || user.firstName || "");
}

export function clearUserStorage() {
  localStorage.removeItem("USER_EMAIL");
  localStorage.removeItem("USER_ROLE");
  localStorage.removeItem("USER_FIRST_NAME");
}

export function getUserFromStorage() {
  return {
    email: localStorage.getItem("USER_EMAIL") || null,
    role: localStorage.getItem("USER_ROLE") || null,
    firstName: localStorage.getItem("USER_FIRST_NAME") || null,
  };
}
