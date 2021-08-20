/*All Questions Data*/
let httpReq = new XMLHttpRequest();

const JSON_URL =
  "https://opentdb.com/api.php?amount=50&difficulty=easy&type=multiple";

const questionsData = [];

const dataArray = (httpReq.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    let data = JSON.parse(httpReq.responseText).results;

    data.forEach((item) => {
      delete item.category;
      delete item.type;
      delete item.difficulty;
      item.answers = shuffle([...item.incorrect_answers, item.correct_answer]);
      delete item.incorrect_answers;
      questionsData.push(item);
    });

    document
      .getElementById("current-question-answers")
      .removeChild(document.getElementById("loader"));

    appLogic();
    interval = setInterval(timeUpdateHandler, 1000);
  }
});

httpReq.open("GET", JSON_URL, true);
httpReq.send();

/*****m*****m****oooo*****ssss***tttttttttt****a******ffffffff***a******************/
/*****mm***mm***o****o***s***********tt*******a*a*****ff********a*a*****************/
/*****m*m*m*m***o****o***sss*********tt******a***a****fffff****a***a****************/
/*****m*mm**m***o****o******s********tt*****aaaaaaa***ff******aaaaaaa***************/
/*****m*****m****oooo***ssss*********tt****a*******a**ff*****a*******a**************/

let userScore = 0;

function appLogic() {
  /*Helpers Variables*/
  let currentQuestionIndex = 0;
  let maxNumOfQuestions = 10;

  localStorage.setItem("maxNum", maxNumOfQuestions);

  /*Collecting Sample of 10 Questions*/

  let allDataShuffled = shuffle(questionsData); // Shuffling all data to get random number of questions every session
  let randomSessionQuestions = [];

  for (let i = 0; i < maxNumOfQuestions; i++) {
    randomSessionQuestions.push(allDataShuffled[i]);
    randomSessionQuestions[i].index = i + 1;
    randomSessionQuestions[i].answered = false;
    randomSessionQuestions[i].selectedAnswer = null;
  }

  /*DOM Elements*/
  const questionNumberWrapper = document.getElementById("question-number");
  const questionHeadWrapper = document.getElementById("current-question-head");
  const answersWrapper = document.getElementById("current-question-answers");

  /*Display the first Question*/
  questionNumberWrapper.innerHTML = "01";
  questionHeadWrapper.innerHTML = randomSessionQuestions[0].question;
  randomSessionQuestions[0].answers.forEach((ans, i) => {
    const answerLabel = document.createElement("label");
    answerLabel.setAttribute("class", "answer");
    answerLabel.setAttribute("for", `answer${i}`);

    const answerInput = document.createElement("input");
    answerInput.setAttribute("type", "radio");
    answerInput.setAttribute("name", "quizAnswers");
    answerInput.setAttribute("id", `answer${i}`);
    answerInput.setAttribute("value", ans);

    const answerText = document.createElement("p");
    answerText.innerHTML = ans;

    answerLabel.appendChild(answerInput);
    answerLabel.appendChild(answerText);

    answersWrapper.appendChild(answerLabel);
  });

  /*Updating UI Function*/

  /*Selecting an Answer Function*/
  const allLabels = document.querySelectorAll(".answer");
  allLabels.forEach((label) => {
    label.addEventListener("click", selectAnswerHandler);
  });

  function selectAnswerHandler(e) {
    document.querySelectorAll(".selected").forEach((selection) => {
      selection.classList.remove("selected");
    });
    e.target.parentElement.classList.add("selected");
  }

  /*Go To Next Question*/

  const nextQuesBtn = document.getElementById("next");

  /*Check Inputs*/

  function checkInputsHandler() {
    const firstChoice = document.querySelector("#answer0").checked;
    const secondChoice = document.querySelector("#answer1").checked;
    const thirdChoice = document.querySelector("#answer2").checked;
    const fourthChoice = document.querySelector("#answer3").checked;

    if (firstChoice || secondChoice || thirdChoice || fourthChoice) {
      return true;
    }

    return false;
  }

  nextQuesBtn.addEventListener("click", goToNextQuestionHandler);

  function goToNextQuestionHandler() {
    if (checkInputsHandler()) {
      if (currentQuestionIndex <= maxNumOfQuestions - 1) {
        // store the checked value
        document.querySelectorAll("input[type='radio']").forEach((radio) => {
          if (radio.checked) {
            randomSessionQuestions[currentQuestionIndex] = {
              ...randomSessionQuestions[currentQuestionIndex],
              answered: true,
              selectedAnswer: radio.value,
            };
          }
        });

        // resetting UI content
        questionNumberWrapper.innerHTML = "";
        questionHeadWrapper.innerHTML = "";
        answersWrapper.innerHTML = "";

        // enabling previous button
        prevQuesBtn.addEventListener("click", goToPrevQuestionHandler);
        prevQuesBtn.style.cursor = "pointer";
        prevQuesBtn.style.background = "#46a9f7";

        // rendering next question
        createCurrentQuestionUIElements(++currentQuestionIndex);

        // checking for navigating buttons validity
        if (currentQuestionIndex === maxNumOfQuestions - 1) {
          // disabling next button
          nextQuesBtn.removeEventListener("click", goToNextQuestionHandler);
          nextQuesBtn.style.cursor = "not-allowed";
          nextQuesBtn.style.background = "#92b5cf";
          // displaying submit button
          document.getElementById("submit").style.display = "block";
        }
      }
    } else {
      window.alert(
        "Select an answer or mark the question and come back later!"
      );
    }
  }

  /*Go To Previous Question*/

  const prevQuesBtn = document.getElementById("prev");

  function goToPrevQuestionHandler() {
    if (currentQuestionIndex >= 0) {
      document.getElementById("submit").style.display = "none";
      questionNumberWrapper.innerHTML = "";
      questionHeadWrapper.innerHTML = "";
      answersWrapper.innerHTML = "";

      createCurrentQuestionUIElements(--currentQuestionIndex);

      nextQuesBtn.addEventListener("click", goToNextQuestionHandler);
      nextQuesBtn.style.cursor = "pointer";
      nextQuesBtn.style.background = "#46a9f7";

      if (currentQuestionIndex === 0) {
        prevQuesBtn.removeEventListener("click", goToPrevQuestionHandler);
        prevQuesBtn.style.cursor = "not-allowed";
        prevQuesBtn.style.background = "#92b5cf";
      }
    }
  }

  /* Creating UI Elements */

  function createCurrentQuestionUIElements(quesIndex = 0) {
    // Question Head Elements
    questionNumberWrapper.innerHTML =
      quesIndex + 1 < 10 ? `0${quesIndex + 1}` : quesIndex + 1;
    questionHeadWrapper.innerHTML = randomSessionQuestions[quesIndex].question;

    // Answers Elements
    randomSessionQuestions[quesIndex].answers.forEach((ans, i) => {
      const answerLabel = document.createElement("label");
      answerLabel.setAttribute("class", "answer");
      answerLabel.setAttribute("for", `answer${i}`);
      randomSessionQuestions[quesIndex].selectedAnswer === ans
        ? answerLabel.classList.add("selected")
        : true;

      const answerInput = document.createElement("input");
      answerInput.setAttribute("type", "radio");
      answerInput.setAttribute("name", "quizAnswers");
      answerInput.setAttribute("id", `answer${i}`);
      answerInput.setAttribute("value", ans);

      randomSessionQuestions[quesIndex].selectedAnswer === ans
        ? (answerInput.checked = true)
        : true;

      const answerText = document.createElement("p");
      answerText.innerHTML = ans;

      answerLabel.appendChild(answerInput);
      answerLabel.appendChild(answerText);
      answersWrapper.appendChild(answerLabel);
    });

    const allLabels = document.querySelectorAll(".answer");
    allLabels.forEach((label) => {
      label.addEventListener("click", selectAnswerHandler);
    });

    progressBarHandler(quesIndex);
  }

  /*Mark Question for Later Answer*/

  let numOfMarkedQuestions = 0;

  const markedQuestionsIndexes = [];

  const markBtn = document.getElementById("mark");
  markBtn.addEventListener("click", markQuestionHandler);

  // Function

  function markQuestionHandler() {
    if (numOfMarkedQuestions < 5) {
      if (markedQuestionsIndexes.includes(currentQuestionIndex)) {
        window.alert("Already there!");
      } else {
        markedQuestionsIndexes.push(currentQuestionIndex);

        // Creating Marked Question UI Elements
        const markedQuestionWrapper = document.createElement("div");
        markedQuestionWrapper.className = "marked-question";
        markedQuestionWrapper.setAttribute("index", currentQuestionIndex);

        const markedQuestionNumber = document.createElement("h2");
        markedQuestionNumber.className = "marked-question-num";
        markedQuestionNumber.textContent =
          randomSessionQuestions[currentQuestionIndex].index + 1 < 10
            ? `0${randomSessionQuestions[currentQuestionIndex].index}`
            : randomSessionQuestions[currentQuestionIndex].index;

        const markedQuestionHead = document.createElement("p");
        markedQuestionHead.className = "marked-question-title";
        markedQuestionHead.innerHTML =
          randomSessionQuestions[currentQuestionIndex].question;

        markedQuestionWrapper.appendChild(markedQuestionNumber);
        markedQuestionWrapper.appendChild(markedQuestionHead);

        document
          .getElementById("marked-questions")
          .appendChild(markedQuestionWrapper);

        numOfMarkedQuestions++;

        // GO TO MARKED QUESTION
        markedQuestionWrapper.addEventListener("click", (e) => {
          // for responsive purposes
          if (window.innerWidth < 750) {
            asideToggle();
          }

          // getting the targeted question index
          const questionIndex = parseInt(e.target.getAttribute("index"));

          // resetting UI elements
          questionNumberWrapper.innerHTML = "";
          questionHeadWrapper.innerHTML = "";
          answersWrapper.innerHTML = "";

          // setting ** currentQuestionIndex ** for rendering purposes
          currentQuestionIndex = questionIndex;

          // creating actual question UI elements and adding it on the UI
          createCurrentQuestionUIElements(currentQuestionIndex);

          /****************************************************************/
          /****************************************************************/

          // next button and previous button validity checking

          if (currentQuestionIndex < maxNumOfQuestions - 1) {
            if (currentQuestionIndex > 0) {
              // enable nextBtn
              nextQuesBtn.addEventListener("click", goToNextQuestionHandler);
              nextQuesBtn.style.cursor = "pointer";
              nextQuesBtn.style.background = "#46a9f7";

              // enable prevBtn
              prevQuesBtn.addEventListener("click", goToPrevQuestionHandler);
              prevQuesBtn.style.cursor = "pointer";
              prevQuesBtn.style.background = "#46a9f7";

              // disable submitBtn
              document.getElementById("submit").style.display = "none";
            } else if (currentQuestionIndex === 0) {
              // enable nextBtn
              nextQuesBtn.addEventListener("click", goToNextQuestionHandler);
              nextQuesBtn.style.cursor = "pointer";
              nextQuesBtn.style.background = "#46a9f7";

              // disable prevBtn
              prevQuesBtn.removeEventListener("click", goToPrevQuestionHandler);
              prevQuesBtn.style.cursor = "not-allowed";
              prevQuesBtn.style.background = "#92b5cf";

              // disable submitBtn
              document.getElementById("submit").style.display = "none";
            }
          } else if (currentQuestionIndex === maxNumOfQuestions - 1) {
            // disable nextBtn
            nextQuesBtn.removeEventListener("click", goToNextQuestionHandler);
            nextQuesBtn.style.cursor = "not-allowed";
            nextQuesBtn.style.background = "#92b5cf";

            // enable prevBtn
            prevQuesBtn.addEventListener("click", goToPrevQuestionHandler);
            prevQuesBtn.style.cursor = "pointer";
            prevQuesBtn.style.background = "#46a9f7";

            // enable submitBtn
            document.getElementById("submit").style.display = "block";
          }
        });

        // Delete Marked Question

        markedQuestionWrapper.addEventListener("contextmenu", (e) => {
          e.preventDefault();

          e.target.parentElement.removeChild(e.target);
        });

        /****************************************************************/
        /****************************************************************/
        /****************************************************************/
        /****************************************************************/
      }

      // GO TO NEST QUESTION
      if (currentQuestionIndex < 9) {
        questionNumberWrapper.innerHTML = "";
        questionHeadWrapper.innerHTML = "";
        answersWrapper.innerHTML = "";

        createCurrentQuestionUIElements(++currentQuestionIndex);
        prevQuesBtn.addEventListener("click", goToPrevQuestionHandler);
        prevQuesBtn.style.cursor = "pointer";
        prevQuesBtn.style.background = "#46a9f7";
      } else {
        nextQuesBtn.removeEventListener("click", goToNextQuestionHandler);
        document.getElementById("submit").style.display = "block";
      }
    } else {
      window.alert("You have reached Maximum number of marked questions!");
    }
  }

  /*Submit */
  const submitBtn = document.getElementById("submit");
  submitBtn.addEventListener("click", submitHandler);

  function submitHandler() {
    if (checkInputsHandler()) {
      document.querySelectorAll("input[type='radio']").forEach((radio) => {
        if (radio.checked) {
          randomSessionQuestions[currentQuestionIndex] = {
            ...randomSessionQuestions[currentQuestionIndex],
            answered: true,
            selectedAnswer: radio.value,
          };
        }
      });

      progressBarHandler(maxNumOfQuestions);

      userScoreCalculator();

      window.location.replace("./final-stage.html");
    } else {
      window.alert("Yo, You Need To select an answer to be able to submit!");
    }
  }

  /*Calculating Score*/

  function userScoreCalculator() {
    randomSessionQuestions.forEach((item) => {
      if (item.correct_answer === item.selectedAnswer) {
        userScore++;
      }
    });

    localStorage.setItem("user-score", userScore);

    window.alert(`You finished the QUIZ!`);
  }
}

/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
/*******************************************************************/
/*******************************************************************/

/*Shuffling any Array*/

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

/*Moving Progress Bar*/
function progressBarHandler(percentage) {
  document
    .getElementById("progress")
    .setAttribute("style", `transform: translateX(-${100 - percentage * 10}%)`);
}

let isMenuOpened = false;

document.getElementById("open-aside").addEventListener("click", asideToggle);
document.getElementById("close-aside").addEventListener("click", asideToggle);

window.addEventListener("resize", () => {
  if (window.innerWidth > 750) {
    document.querySelector("aside").style.transform = `translateX(0%)`;
  }
});

function asideToggle() {
  if (isMenuOpened) {
    document.querySelector("aside").style.transform = `translateX(100%)`;
    isMenuOpened = false;
  } else {
    document.querySelector("aside").style.transform = `translateX(0%)`;
    isMenuOpened = true;
  }
}

const timeWrapper = document.getElementById("time");
const totalTime = 1.2;
let remainingQuizTime = totalTime * 60;

function timeUpdateHandler() {
  const minutes = Math.floor(remainingQuizTime / 60);
  const seconds = remainingQuizTime % 60;

  timeWrapper.innerHTML = `${minutes >= 10 ? minutes : `0${minutes}`}:${
    seconds >= 10 ? seconds : `0${seconds}`
  }`;
  remainingQuizTime--;

  if (remainingQuizTime < 0) {
    clearInterval(interval);
    window.alert("TIME OUT 🗡🗡 !!!!");
    localStorage.setItem("user-score", userScore);
    window.location.replace("./final-stage.html");
  }
}
