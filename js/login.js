document.getElementById("loginButton").onclick = function (event) {
  event.preventDefault();

  const formEmail = document.getElementById("email").value;
  const formPassword = document.getElementById("password").value;

  let activeUser;

  const allUsersData = localStorage.getItem("allUsersData")
    ? JSON.parse(localStorage.getItem("allUsersData"))
    : [];

  let userExist = true;

  if (allUsersData.length > 0) {
    allUsersData.forEach((userItem) => {
      if (formEmail == userItem.email) {
        if (formPassword == userItem.password) {
          activeUser = userItem;
          localStorage.setItem("activeUser", JSON.stringify(activeUser));

          window.location.replace("../pages/quiz-page.html");
        } else {
          window.alert("Password is not correct");
        }
      } else {
        userExist = false;
      }
    });
  } else {
    window.alert("This account doesn't exist");
  }

  if (!userExist) {
    window.alert("This account doesn't exist");
  }
};

document.getElementById("forms-navigator").addEventListener("click", () => {
  window.location.replace("./registration.html");
});
