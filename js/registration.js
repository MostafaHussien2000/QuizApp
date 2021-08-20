const allUsersData = localStorage.getItem("allUsersData")
  ? JSON.parse(localStorage.getItem("allUsersData"))
  : [];

let activeUser;

document.getElementById("signUpButton").addEventListener("click", (e) => {
  e.preventDefault();

  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const repeatPassword = document.getElementById("repeatPassword").value;

  if (firstName && lastName && email && password && repeatPassword) {
    if (password === repeatPassword) {
      // Redirects the user to another webpage if the passwords are matching

      let accountExist = false;

      if (allUsersData.length > 0) {
        allUsersData.forEach((userItem) => {
          if (email === userItem.email) {
            accountExist = true;
          }

          if (!accountExist) {
            const userData = {
              firstName,
              lastName,
              email,
              password,
            };

            allUsersData.push(userData);

            localStorage.setItem("allUsersData", JSON.stringify(allUsersData));

            window.location.replace("../pages/quiz-page.html");
          } else {
            window.alert("Account Already Exist!");
          }
        });
      } else {
        const userData = {
          firstName,
          lastName,
          email,
          password,
        };

        activeUser = userData;

        localStorage.setItem("activeUser", JSON.stringify(activeUser));

        allUsersData.push(userData);

        localStorage.setItem("allUsersData", JSON.stringify(allUsersData));

        window.location.replace("../pages/quiz-page.html");
      }
    } else {
      window.alert("Passwords didn’t match try again");
    }
  }
  // OR localStorage.setItem("email", email), localstorage.setItem("password", password) without JSON.stringify()
});

document.getElementById("forms-navigator").addEventListener("click", () => {
  window.location.replace("./login.html");
});
