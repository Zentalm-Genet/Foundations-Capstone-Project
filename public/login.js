const loginForm = document.getElementById("loginForm");

const loginUser = userData => axios
    .post("http://localhost:4000/login", userData)
    .then(response => {
        console.log(response.data); 
        window.location.href = "index.html";
    })
    .catch(error => {
        console.error("Error:", error.response.data);
        alert("Username or password is incorrect. Please try again!");
    });


loginForm.addEventListener("submit", event => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const userData = { username, password };
    loginUser(userData);
});
