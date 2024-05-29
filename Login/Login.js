const API_URL = "http://localhost:8080/api"


async function handleHttpErrors(res) {
    if (!res.ok) {
      const errorResponse = await res.json();
      const error = new Error(errorResponse.message)
      // @ts-ignore
      error.fullResponse = errorResponse
      throw error
    }
    return res.json()
  }

  document.getElementById("loginForm").addEventListener("submit", login);
  document.getElementById("error").innerText = ""
  document.getElementById("usernameField").value = ""
  document.getElementById("passwordField").value = ""


async function login(event) {
    event.preventDefault();
    document.getElementById("error").innerText = ""
    const loginRequest = {
      username: document.getElementById("usernameField").value,
      password: document.getElementById("passwordField").value
    }
    const options = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(loginRequest)
    }
    try {
      const res = await fetch(API_URL + "/auth/login", options).then(r => handleHttpErrors(r))
      storeLoginDetails(res)
      window.location.href = "../HomePage/HomePage.html";
    } catch (err) {
      document.getElementById("error").innerText = err.message
    }
  }

  /**
 * Store username, roles and token in localStorage, and update UI-status
 * @param res - Response object with details provided by server for a succesful login
 */
function storeLoginDetails(res) {
    localStorage.setItem("token", res.token)
    localStorage.setItem("user", res.username)
    localStorage.setItem("roles", res.roles)
    //toggleLoginStatus(true)
  }
  
  
   function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("roles")
    toggleLoginStatus(false)
    window.router.navigate("/")
  }
  
   function toggleLoginStatus(loggedIn) {
    document.getElementById("login-container").style.display = loggedIn ? "none" : "block"
    document.getElementById("logout-container").style.display = loggedIn ? "block" : "none"
    
    const adminListItems = document.querySelectorAll('.admin-only');
    const userRoutes = document.querySelectorAll('.user-only');
    let isAdmin = false;
    let isUser = false;
    if (localStorage.getItem('roles')) {
       isAdmin = localStorage.getItem('roles').includes('ADMIN');
       isUser = localStorage.getItem('roles').includes('USER');
    }
    for (var i = 0; i < adminListItems.length; i++) {
      adminListItems[i].style.display = isAdmin ? "block" : 'none'; 
    }
    for (var i = 0; i < userRoutes.length; i++) {
      userRoutes[i].style.display = isUser ? 'block' : 'none';
    }
  }
  
