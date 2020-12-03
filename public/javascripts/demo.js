window.addEventListener("load", (e) => {
  const email = document.getElementById("emailAddress");
  const password = document.getElementById("password");
  document.getElementById("button").addEventListener("click", (e) => {
    email.value = "demo@demo.com";
    password.value = "Demo#123";
  });
});
