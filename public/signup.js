const signupForm = document.getElementById("signupForm");

const signupUser = userData => axios
    .post("http://localhost:4000/signup", userData)
    .then(response => {
        console.log(response.data); 
        window.location.href = 'login.html'; 
    })
    .catch(error => {
        console.error("Error:", error.response.data);
        if (error.response && error.response.data && error.response.data.message) {
            alert(error.response.data.message); 
        } else {
            alert("An error occurred while signing up. Please try again later."); 
        }
    });

signupForm.addEventListener("submit", event => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const userData = { username, email, password };
    signupUser(userData);
});
