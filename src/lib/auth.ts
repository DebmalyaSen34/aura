export function handleLogout() {
  // Clear cookies
  document.cookie =
    "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Clear localStorage
  localStorage.removeItem("profile");
  localStorage.removeItem("profile_timestamp");
  localStorage.removeItem("posts");

  // Redirect to sign in page
  window.location.href = "/login";
}
