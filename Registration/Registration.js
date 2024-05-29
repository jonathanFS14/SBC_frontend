const API_URL = "http://localhost:8080/api"
const URL = API_URL + "/student";

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

  document.getElementById("error").innerText = "";
  document.getElementById("succes").innerText = "";
  document.getElementById("usernameField").value = ""
  document.getElementById("passwordField").value = ""
  document.getElementById("loginForm").addEventListener("submit", signUp);

async function signUp(event) {
  event.preventDefault();
  document.getElementById("error").innerText = "";
  document.getElementById("succes").innerText = "";
  var username = document.getElementById("usernameField").value;
  var password = document.getElementById("passwordField").value;
  
  const student = {
    username,
    password,
  };
  const options = {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(student)
  }

  fetch(URL, options)
    .then(handleHttpErrors)
    .then(Response => { 
      document.getElementById("succes").innerText = "successfully created";
      document.getElementById("loginForm").reset();
      setTimeout(() => {
        window.location.href = "../Login/Login.html";
      }, 2000); //2 seconds
  })
  .catch(error => {
    const errorMessage = error.message;
    document.getElementById("error").innerHTML = errorMessage;
  });
  
}
