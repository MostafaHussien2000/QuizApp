const userNameElement = document.getElementById("user-name");
const score = document.getElementById("score");
const totalNum = document.getElementById("total-num");

const activeUser = JSON.parse(localStorage.getItem("activeUser"));
const userScore = JSON.parse(localStorage.getItem("user-score"));
const maxNumOfQuestions = JSON.parse(localStorage.getItem("maxNum"));

userNameElement.innerHTML = activeUser.firstName;
score.innerHTML = userScore;
totalNum.innerHTML = maxNumOfQuestions;
