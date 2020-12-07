window.addEventListener("load", (e) => {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  document.getElementById("demo-login").addEventListener("click", (e) => {
    email.value = "demo@gmail.com";
    password.value = "Password12!";
  });
});
