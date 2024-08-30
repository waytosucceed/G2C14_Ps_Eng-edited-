var questions = [];
var i = 0;
var count = 0;
var score = 0;
var Ansgiven = []; // Store answers given by the user
var previousQuestionIndex = null; // Track the previously displayed question
var topicName = ''; // Variable to store the topic name
const submitSound =document.getElementById("submit-sound");

const uniqueKey = 2_14;

// Helper function to save data in local storage under the unique key
function saveToLocalStorage(key, value) {
  let storageData = JSON.parse(localStorage.getItem(uniqueKey)) || {};
  storageData[key] = value;
  localStorage.setItem(uniqueKey, JSON.stringify(storageData));
}

// Helper function to get data from local storage under the unique key
function getFromLocalStorage(key) {
  let storageData = JSON.parse(localStorage.getItem(uniqueKey)) || {};
  return storageData[key];
}


// Fetch the questions from the JSON file
fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    // Get the selected topic from the URL
    const urlParams = new URLSearchParams(window.location.search);
    topicName = urlParams.get('topic'); // Store topic name for later use

    // Find the questions for the selected topic
    const selectedTopic = data.topics.find(t => t.heading === topicName);

    if (selectedTopic) {
      questions = selectedTopic.questions; // Access the questions array for the selected topic
      count = questions.length;

      // // Store total number of questions in localStorage
      // localStorage.setItem(topicName + '_totalQuestions', count);

      // Store total number of questions in localStorage
      saveToLocalStorage(topicName + '_totalQuestions', count);

      // Load the heading from the selected topic
      document.getElementById('heading').innerText = topicName || 'PS'; // Set default heading if not provided
      loadButtons();
      loadQuestion(i);

      // Store topics in local storage for the results page
      const topics = JSON.parse(localStorage.getItem('topics')) || [];
      if (!topics.find(t => t.heading === topicName)) {
        topics.push(selectedTopic);
        // localStorage.setItem('topics', JSON.stringify(topics));
        saveToLocalStorage('topics', topics);

      }
    } else {
      document.getElementById('heading').innerText = 'Topic not found';
      document.getElementById('buttonContainer').innerHTML = 'No questions available for this topic.';
    }
  });

function loadButtons() {
  var buttonContainer = document.getElementById("buttonContainer");
  buttonContainer.innerHTML = ""; // Clear previous buttons
  for (var j = 0; j < questions.length; j++) {
    var btn = document.createElement("button");
    btn.className = "btn btn-default smallbtn";
    btn.innerHTML = "Q" + (j + 1);
    btn.setAttribute("onclick", "abc(" + (j + 1) + ")");

    // // Check if the topic has been completed and disable the button if necessary
    // if (localStorage.getItem(topicName + '_completed')) {
    //   btn.classList.add("disabled-btn");
    //   btn.disabled = true;
    // }

       // Check if the topic has been completed and disable the button if necessary
       if (getFromLocalStorage(topicName + '_completed')) {
        btn.classList.add("disabled-btn");
        btn.disabled = true;
      }

    buttonContainer.appendChild(btn);
  }
  // Highlight the button for the current question
  highlightButton(i);
  // Update button styles based on answered questions
  updateButtonStyles();
}


function playOptionSound(option) {
  // Create a new Audio object with the sound file URL
  var sound = new Audio(option);
  
  // Play the sound
  sound.play();
}

// function loadQuestion(index) {
//   var randomQuestion = questions[index];
  
//   // Set image source to either the provided image or the default image
//   var imageElement = document.getElementById("math_ques");
//   imageElement.src = randomQuestion.image || "./assests/images/dummy-img.png";

//   // document.getElementById("numdiv").innerHTML = randomQuestion.questionNo;
//   document.getElementById("question").innerHTML = randomQuestion.question;
//   document.getElementById("options").innerHTML = "";

//   // Check if there is a sound associated with the question
//   if (randomQuestion.questionSound) {
//     var soundButton = document.createElement("button");
//     soundButton.className = "btn btn-sound";
//     soundButton.innerText = "Play Sound";
//     soundButton.onclick = function() {
//       var sound = new Audio(randomQuestion.questionSound);
//       sound.play();
//     };
//     document.getElementById("question").appendChild(soundButton);
//   }

//   randomQuestion.options.forEach(function(option, idx) {
//     var li = document.createElement("li");

//     // Check if the option is a sound file (.mp3)
//     if (option.endsWith('.mp3')) {
//       // Get the label for the option
//       var optionLabel = getOptionLabel(option);

//       li.innerHTML = '<input type="radio" name="answer" value="' + idx + '" onchange="handleAnswerChange()"> ' +
//                      '<button class="btn btn-sound" onclick="playOptionSound(\'' + option + '\')"> ' + optionLabel + '</button>';
//     } else {
//       li.innerHTML = '<input type="radio" name="answer" value="' + idx + '" onchange="handleAnswerChange()"> ' + option;
//     }

//     document.getElementById("options").appendChild(li);
//   });

//   // Load the previously selected answer if available
//   var previouslySelected = Ansgiven[index];
//   if (previouslySelected !== null && previouslySelected !== undefined) {
//     document.querySelector('input[name="answer"][value="' + previouslySelected + '"]').checked = true;
//   }

//   // Remove highlight from the previously displayed question
//   if (previousQuestionIndex !== null) {
//     document.getElementById("question").classList.remove("highlight");
//   }

//   // Highlight the current question
//   document.getElementById("question").classList.add("highlight");

//   // Save the current question index
//   previousQuestionIndex = index;

//   // Update button visibility based on whether an answer is selected
//   updateButtonVisibility();
//   // Highlight the button for the current question
//   highlightButton(index);
//   // Update button styles
//   updateButtonStyles();

//   // Update the Next button or Submit Answers button
//   updateButtonText();
// }


// function loadQuestion(index) {
//   var randomQuestion = questions[index];
  
//   // Set image source to either the provided image or the default image
//   var imageElement = document.getElementById("math_ques");
//   imageElement.src = randomQuestion.image || "./assests/images/dummy-img.png";

//   // Set question number and question text
//   document.getElementById("question").innerHTML = randomQuestion.question;
//   document.getElementById("options").innerHTML = "";

//   // Check if there is a sound associated with the question
//   if (randomQuestion.questionSound) {
//     var soundButton = document.createElement("button");
//     soundButton.className = "btn btn-sound";
//     soundButton.innerText = "Play Sound";
//     soundButton.onclick = function() {
//       var sound = new Audio(randomQuestion.questionSound);
//       sound.play();
//     };
//     document.getElementById("question").appendChild(soundButton);
//   }

//   // Debugging: Log options data
//   console.log("Options data:", randomQuestion.options);

//   // Iterate through the options and display them
//   randomQuestion.options.forEach(function(option, idx) {
//     var li = document.createElement("li");
//     console.log("Creating option:", option);

//     // Create the radio button for the option
//     var radioButton = document.createElement("input");
//     radioButton.type = "radio";
//     radioButton.name = "answer";
//     radioButton.value = idx;
//     radioButton.onchange = handleAnswerChange;

//     // Create the image element for the option
//     var optionImage = document.createElement("img");
//     optionImage.src = option.image || "./assests/images/dummy-img.png";
//     optionImage.alt = "Option Image";
//     optionImage.style.width = "100px";
//     optionImage.style.height = "100px";
//     optionImage.style.cursor = "pointer";
//     optionImage.onmouseover = function() {
//       if (option.sound) {
//         playOptionSound(option.sound);
//       }
//     };

//     // Append the radio button and image to the list item
//     li.appendChild(radioButton);
//     li.appendChild(optionImage);
    
//     // Append the list item to the options container
//     document.getElementById("options").appendChild(li);
//   });

//   // Load the previously selected answer if available
//   var previouslySelected = Ansgiven[index];
//   if (previouslySelected !== null && previouslySelected !== undefined) {
//     document.querySelector('input[name="answer"][value="' + previouslySelected + '"]').checked = true;
//   }

//   // Highlight the current question
//   if (previousQuestionIndex !== null) {
//     document.getElementById("question").classList.remove("highlight");
//   }
//   document.getElementById("question").classList.add("highlight");

//   // Save the current question index
//   previousQuestionIndex = index;

//   // Update button visibility and styles
//   updateButtonVisibility();
//   highlightButton(index);
//   updateButtonStyles();

//   // Update the Next button or Submit Answers button
//   updateButtonText();
// }


function loadQuestion(index) {
  var randomQuestion = questions[index];
  
  if (!randomQuestion) {
    console.error("No question found at index:", index);
    return;
  }

  // Set image source to either the provided image or the default image
  // var imageElement = document.getElementById("math_ques");
  // if (imageElement) {
  //   imageElement.src = randomQuestion.image;
  // } else {
  //   console.error("Element with ID 'math_ques' not found.");
  // }

  // Set question text
  var questionElement = document.getElementById("question");
  if (questionElement) {
    questionElement.innerHTML = randomQuestion.question; // Set the question text
  } else {
    console.error("Element with ID 'question' not found.");
    return;
  }

  // Check if there is a sound associated with the question
  if (randomQuestion.questionSound) {
    var soundButton = document.createElement("button");
    soundButton.className = "btn btn-sound";
    soundButton.innerText = "Play Sound";
    soundButton.onclick = function() {
      var sound = new Audio(randomQuestion.questionSound);
      sound.play();
    };
    questionElement.appendChild(soundButton);
  }

  // Debugging: Log options data
  console.log("Options data:", randomQuestion.options);

  // Iterate through the options and display them
  var optionsElement = document.getElementById("options");
  if (optionsElement) {
    optionsElement.innerHTML = ""; // Clear existing options
    randomQuestion.options.forEach(function(option, idx) {
      var li = document.createElement("li");
      console.log("Creating option:", option);

      // Create the radio button for the option
      var radioButton = document.createElement("input");
      radioButton.type = "radio";
      radioButton.name = "answer";
      radioButton.value = idx;
      radioButton.style.display = "none"; // Hide the radio button

      // Create the image element for the option
      var optionImage = document.createElement("img");
      optionImage.src = option.image || "./assests/images/dummy-img.png";
      optionImage.alt = "Option Image";
      // optionImage.style.width = "100px";
      optionImage.style.height = "120px";
      optionImage.style.cursor = "pointer";
      optionImage.style.borderRadius="12px"
      optionImage.onclick = function() {
        radioButton.checked = true; // Select the corresponding radio button
        handleAnswerChange(); // Call the answer change handler
      };

      optionImage.onmouseover = function() {
        optionImage.style.borderStyle="solid";
        optionImage.style.borderWidth="5px";
        if (option.sound) {
          playOptionSound(option.sound);
        }
      };

      optionImage.onmouseout = function() {
        optionImage.style.borderStyle = "none";
        optionImage.style.borderWidth="none";
    };

      // Append the radio button and image to the list item
      li.appendChild(radioButton);
      li.appendChild(optionImage);
      
      // Append the list item to the options container
      optionsElement.appendChild(li);
    });
  } else {
    console.error("Element with ID 'options' not found.");
  }

  // Load the previously selected answer if available
  var previouslySelected = Ansgiven[index];
  if (previouslySelected !== null && previouslySelected !== undefined) {
    var previouslySelectedElement = document.querySelector('input[name="answer"][value="' + previouslySelected + '"]');
    if (previouslySelectedElement) {
      previouslySelectedElement.checked = true;
    }
  }

  // Remove highlight from the previously displayed question
  if (previousQuestionIndex !== null) {
    questionElement.classList.remove("highlight");
  }

  // Highlight the current question
  questionElement.classList.add("highlight");

  // Save the current question index
  previousQuestionIndex = index;

  // Update button visibility based on whether an answer is selected
  updateButtonVisibility();
  // Highlight the button for the current question
  highlightButton(index);
  // Update button styles
  updateButtonStyles();

  // Update the Next button or Submit Answers button
  updateButtonText();
}



// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}



function capitalizeFirstLetter(string) {
  return string.charAt(0) + string.slice(1);
}


function getOptionLabel(option) {
  if (option.endsWith('.mp3')) {
    var label = option.split('/').pop().replace('.mp3', '');
    return capitalizeFirstLetter(label);
  }
  return option;
}


function handleAnswerChange() {
  // Show the Submit Answer button and hide the Next button when an answer is selected
  document.getElementById("subbtn").style.display = "inline-block";
  document.getElementById("nextbtn").style.display = "none";
}

function newques() {
  // Save the answer for the current question
  saveCurrentAnswer();

  if (i === count - 1) {
    document.getElementById("questiondiv").style.textAlign = "center";
    
    // Display results
    displayResults();    
  
    // Hide buttonContainer
    document.getElementById("buttonContainer").style.display = "none";

// // window.location.href = "./graph.html";

  } else {
    // Move to the next question
    i++;
    loadQuestion(i);
    document.getElementById("result").innerHTML = "";
    document.getElementById("subbtn").style.display = "inline-block";
    document.getElementById("nextbtn").style.display = "none";
    
    // Update button visibility and styles
    updateButtonVisibility();
    updateButtonStyles();
  }
}


// Save the answer for the current question
function saveCurrentAnswer() {
  var selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (selectedAnswer) {
    Ansgiven[i] = parseInt(selectedAnswer.value); // Store answer as an index
  } else {
    Ansgiven[i] = null; // Mark as not answered
  }
  console.log("score", score);
  saveToLocalStorage('Ansgiven', Ansgiven); // Save the updated answers array to local storage

}
function getOptionLabel(option) {
  if (option.endsWith('.mp3')) {
    var label = option.split('/').pop().replace('.mp3', '');
    document.querySelectorAll('.menu li').forEach(function(item) {
      item.style.marginBottom = '0';
    });
    return capitalizeFirstLetter(label);
  }
  return option;
}


// function displayResults() {
//   window.location.href = "./graph.html";

//   score = Ansgiven.reduce((total, answer, index) => {
//     return answer === questions[index].answer ? total + 1 : total;
//   }, 0);

//  saveToLocalStorage(topicName + '_score', score);
//  saveToLocalStorage(topicName + '_completed', 'true'); // Mark topic as completed

  
//   // Calculate percentage and feedback message
//   var percentage = (score / count) * 100;
//   var progressBarColor = "";
//   var feedbackMessage = "";


//   var home = "<a href='./graph.html'><b class='btn btn-success next-btn-progress'>Click here to View Report</b></a><br>";
//   var content = home;
//     saveToLocalStorage(topicName + '_results_content', content);

//   var questionsPerPage = 8;
//   var numberOfPages = Math.ceil(questions.length / questionsPerPage);
//   var questionContent = "";
//   var paginationControls = "";

//   for (var page = 0; page < numberOfPages; page++) {
//     var start = page * questionsPerPage;
//     var end = Math.min(start + questionsPerPage, questions.length);
//     var pageDiv = "<div class='question-page' style='display: " + (page === 0 ? "block" : "none") + ";'><h2>Page " + (page + 1) + "</h2>";

//     for (var j = start; j < end; j++) {
//       var quesgroup = questions[j];
//       var ques = quesgroup.question;
//       var ans = quesgroup.options[quesgroup.answer];
//       var given = Ansgiven[j] !== undefined ? (Ansgiven[j] !== null ? quesgroup.options[Ansgiven[j]] : "Not Answered") : "Not Answered";

//       var num = j + 1;
//       pageDiv += "Q." + num + " " + ques + "<br>" + "Correct Answer: " + ans + "<br>" + "Answer Given: " + given + "<br><br>";
//     }

//     pageDiv += "</div>";
//     questionContent += pageDiv;
//   }

//   paginationControls = "<div class='pagination-controls' style='text-align: center; margin-top: 20px;'>";
//   for (var page = 0; page < numberOfPages; page++) {
//     paginationControls += "<button class='btn btn-default' onclick='showPage(" + page + ")'>" + (page + 1) + "</button> ";
//   }
//   paginationControls += "</div>";

//   saveToLocalStorage(topicName + '_question_content', questionContent);

//   document.getElementById("picdiv").innerHTML = "";
//   document.getElementById("picdiv").style.display = "none";
//   document.getElementById("questiondiv").style.display = "none";
//   document.getElementById("nextbtn").style.textAlign = "center";



//   confetti({
//     particleCount: 200,
//     spread: 70,
//     origin: { y: 0.6 }
//   });

//   var sound = new Audio('./assests/sounds/well-done.mp3'); // Update with the correct path to your sound file
//   sound.play();

  
// }
// function displayResults() {
//   window.location.href = "./graph.html";

//   score = Ansgiven.reduce((total, answer, index) => {
//     return answer === questions[index].answer ? total + 1 : total;
//   }, 0);

//   saveToLocalStorage(topicName + '_score', score);
//   saveToLocalStorage(topicName + '_completed', 'true'); // Mark topic as completed

//   var percentage = (score / count) * 100;
//   var progressBarColor = "";
//   var feedbackMessage = "";

//   var home = "<a href='./graph.html'><b class='btn btn-success next-btn-progress'>Click here to View Report</b></a><br>";
//   var content = home;
//   saveToLocalStorage(topicName + '_results_content', content);

//   var questionsPerPage = 8;
//   var numberOfPages = Math.ceil(questions.length / questionsPerPage);
//   var questionContent = "";
//   var paginationControls = "";

//   for (var page = 0; page < numberOfPages; page++) {
//     var start = page * questionsPerPage;
//     var end = Math.min(start + questionsPerPage, questions.length);
//     var pageDiv = "<div class='question-page' style='display: " + (page === 0 ? "block" : "none") + ";'><h2>Page " + (page + 1) + "</h2>";

//     for (var j = start; j < end; j++) {
//       var quesgroup = questions[j];
//       var ques = quesgroup.question;
//       var ans = getOptionLabel(quesgroup.options[quesgroup.answer]); // Convert the correct answer
//       var given = Ansgiven[j] !== undefined ? (Ansgiven[j] !== null ? getOptionLabel(quesgroup.options[Ansgiven[j]]) : "Not Answered") : "Not Answered"; // Convert the given answer

//       var num = j + 1;
//       pageDiv += "Q." + num + " " + ques + "<br>" + "Correct Answer: " + ans + "<br>" + "Answer Given: " + given + "<br><br>";
//     }

//     pageDiv += "</div>";
//     questionContent += pageDiv;
//   }

//   paginationControls = "<div class='pagination-controls' style='text-align: center; margin-top: 20px;'>";
//   for (var page = 0; page < numberOfPages; page++) {
//     paginationControls += "<button class='btn btn-default' onclick='showPage(" + page + ")'>" + (page + 1) + "</button> ";
//   }
//   paginationControls += "</div>";

//   saveToLocalStorage(topicName + '_question_content', questionContent);

//   document.getElementById("picdiv").innerHTML = "";
//   document.getElementById("picdiv").style.display = "none";
//   document.getElementById("questiondiv").style.display = "none";
//   document.getElementById("nextbtn").style.textAlign = "center";

//   confetti({
//     particleCount: 200,
//     spread: 70,
//     origin: { y: 0.6 }
//   });

//   var sound = new Audio('./assests/sounds/well-done.mp3'); // Update with the correct path to your sound file
//   sound.play();
// }

// function displayResults() {
//   window.location.href = "./graph.html";

//   // Calculate the score
//   score = Ansgiven.reduce((total, answer, index) => {
//     return answer === questions[index].answer ? total + 1 : total;
//   }, 0);

//   // Save score and completion status to local storage
//   saveToLocalStorage(topicName + '_score', score);
//   saveToLocalStorage(topicName + '_completed', 'true'); // Mark topic as completed

//   var percentage = (score / count) * 100;
//   var progressBarColor = "";
//   var feedbackMessage = "";

//   // Save report content to local storage
//   var home = "<a href='./graph.html'><b class='btn btn-success next-btn-progress'>Click here to View Report</b></a><br>";
//   var content = home;
//   saveToLocalStorage(topicName + '_results_content', content);

//   var questionsPerPage = 8;
//   var numberOfPages = Math.ceil(questions.length / questionsPerPage);
//   var questionContent = "";
//   var paginationControls = "";

//   // Iterate through the pages of questions
//   for (var page = 0; page < numberOfPages; page++) {
//     var start = page * questionsPerPage;
//     var end = Math.min(start + questionsPerPage, questions.length);
//     var pageDiv = "<div class='question-page' style='display: " + (page === 0 ? "block" : "none") + ";'><h2>Page " + (page + 1) + "</h2>";

//     for (var j = start; j < end; j++) {
//       var quesgroup = questions[j];
//       var ques = quesgroup.question;

//       // Display correct answer: If the option has an image, display the image
//       var ans = quesgroup.options[quesgroup.answer];
//       var ansContent = ans.image ? "<img src='" + ans.image + "' alt='Answer Image' style='width: 50px; height: 50px;'>" : getOptionLabel(ans);

//       // Display given answer: If the option has an image, display the image
//       var givenAnswer = Ansgiven[j] !== undefined ? quesgroup.options[Ansgiven[j]] : null;
//       var givenContent = givenAnswer ? (givenAnswer.image ? "<img src='" + givenAnswer.image + "' alt='Given Answer Image' style='width: 50px; height: 50px;'>" : getOptionLabel(givenAnswer)) : "Not Answered";

//       var num = j + 1;
//       pageDiv += "Q." + num + " " + ques + "<br>" + "Correct Answer: " + ansContent + "<br>" + "Answer Given: " + givenContent + "<br><br>";
//     }

//     pageDiv += "</div>";
//     questionContent += pageDiv;
//   }

//   // Pagination controls
//   paginationControls = "<div class='pagination-controls' style='text-align: center; margin-top: 20px;'>";
//   for (var page = 0; page < numberOfPages; page++) {
//     paginationControls += "<button class='btn btn-default' onclick='showPage(" + page + ")'>" + (page + 1) + "</button> ";
//   }
//   paginationControls += "</div>";

//   // Save question content to local storage
//   saveToLocalStorage(topicName + '_question_content', questionContent);

//   // Hide unnecessary elements
//   document.getElementById("picdiv").innerHTML = "";
//   document.getElementById("picdiv").style.display = "none";
//   document.getElementById("questiondiv").style.display = "none";
//   document.getElementById("nextbtn").style.textAlign = "center";

//   // Play confetti animation
//   confetti({
//     particleCount: 200,
//     spread: 70,
//     origin: { y: 0.6 }
//   });

//   // Play well-done sound
//   var sound = new Audio('./assests/sounds/well-done.mp3'); // Update with the correct path to your sound file
//   sound.play();
// }

// function displayResults() {
//   window.location.href = "./graph.html";

//   // Calculate the score
//   score = Ansgiven.reduce((total, answer, index) => {
//     return answer === questions[index].answer ? total + 1 : total;
//   }, 0);

//   // Save score and completion status to local storage
//   saveToLocalStorage(topicName + '_score', score);
//   saveToLocalStorage(topicName + '_completed', 'true'); // Mark topic as completed

//   var percentage = (score / count) * 100;
//   var progressBarColor = "";
//   var feedbackMessage = "";

//   // Save report content to local storage
//   var home = "<a href='./graph.html'><b class='btn btn-success next-btn-progress'>Click here to View Report</b></a><br>";
//   var content = home;
//   saveToLocalStorage(topicName + '_results_content', content);

//   var questionsPerPage = 8;
//   var numberOfPages = Math.ceil(questions.length / questionsPerPage);
//   var questionContent = "";
//   var paginationControls = "";

//   // Iterate through the pages of questions
//   for (var page = 0; page < numberOfPages; page++) {
//     var start = page * questionsPerPage;
//     var end = Math.min(start + questionsPerPage, questions.length);
//     var pageDiv = "<div class='question-page' style='display: " + (page === 0 ? "block" : "none") + ";'><h2>Page " + (page + 1) + "</h2>";

//     for (var j = start; j < end; j++) {
//       var quesgroup = questions[j];
//       var ques = quesgroup.question;

//       // Handle correct answer
//       var ans = quesgroup.options[quesgroup.answer];
//       var ansContent = "";

//       // Handle given answer
//       var givenAnswer = Ansgiven[j] !== undefined ? quesgroup.options[Ansgiven[j]] : null;
//       var givenContent = "";

//       if (quesgroup.sound === true) {
//         // If sound is true, display a play button for sound
//         ansContent = "<button class='btn btn-sound' onclick='playOptionSound(\"" + ans.sound + "\")'>Play Correct Sound</button>";
//         givenContent = givenAnswer ? "<button class='btn btn-sound' onclick='playOptionSound(\"" + givenAnswer.sound + "\")'>Play Given Sound</button>" : "Not Answered";
//       } else {
//         // Otherwise, display the image or text label
//         ansContent = ans.image ? "<img src='" + ans.image + "' alt='Answer Image' style='width: 50px; height: 50px;'>" : getOptionLabel(ans);
//         givenContent = givenAnswer ? (givenAnswer.image ? "<img src='" + givenAnswer.image + "' alt='Given Answer Image' style='width: 50px; height: 50px;'>" : getOptionLabel(givenAnswer)) : "Not Answered";
//       }

//       var num = j + 1;
//       pageDiv += "Q." + num + " " + ques + "<br>" + "Correct Answer: " + ansContent + "<br>" + "Answer Given: " + givenContent + "<br><br>";
//     }

//     pageDiv += "</div>";
//     questionContent += pageDiv;
//   }

//   // Pagination controls
//   paginationControls = "<div class='pagination-controls' style='text-align: center; margin-top: 20px;'>";
//   for (var page = 0; page < numberOfPages; page++) {
//     paginationControls += "<button class='btn btn-default' onclick='showPage(" + page + ")'>" + (page + 1) + "</button> ";
//   }
//   paginationControls += "</div>";

//   // Save question content to local storage
//   saveToLocalStorage(topicName + '_question_content', questionContent);

//   // Hide unnecessary elements
//   document.getElementById("picdiv").innerHTML = "";
//   document.getElementById("picdiv").style.display = "none";
//   document.getElementById("questiondiv").style.display = "none";
//   document.getElementById("nextbtn").style.textAlign = "center";

//   // Play confetti animation
//   confetti({
//     particleCount: 200,
//     spread: 70,
//     origin: { y: 0.6 }
//   });

//   // Play well-done sound
//   var sound = new Audio('./assests/sounds/well-done.mp3'); // Update with the correct path to your sound file
//   sound.play();
// }

function displayResults() {
  window.location.href = "./graph.html";

  // Calculate the score
  score = Ansgiven.reduce((total, answer, index) => {
    return answer === questions[index].answer ? total + 1 : total;
  }, 0);

  // Save score and completion status to local storage
  saveToLocalStorage(topicName + '_score', score);
  saveToLocalStorage(topicName + '_completed', 'true'); // Mark topic as completed

  var percentage = (score / count) * 100;
  var progressBarColor = "";
  var feedbackMessage = "";

  // Save report content to local storage
  var home = "<a href='./graph.html'><b class='btn btn-success next-btn-progress'>Click here to View Report</b></a><br>";
  var content = home;
  saveToLocalStorage(topicName + '_results_content', content);

  var questionsPerPage = 8;
  var numberOfPages = Math.ceil(questions.length / questionsPerPage);
  var questionContent = "";
  var paginationControls = "";

  // Iterate through the pages of questions
  for (var page = 0; page < numberOfPages; page++) {
    var start = page * questionsPerPage;
    var end = Math.min(start + questionsPerPage, questions.length);
    var pageDiv = "<div class='question-page' style='display: " + (page === 0 ? "block" : "none") + ";'><h2>Page " + (page + 1) + "</h2>";

    for (var j = start; j < end; j++) {
      var quesgroup = questions[j];
      var ques = quesgroup.question;

      // Handle correct answer
      var ans = quesgroup.options[quesgroup.answer];
      var ansContent = "";

      // Handle given answer
      var givenAnswer = Ansgiven[j] !== undefined ? quesgroup.options[Ansgiven[j]] : null;
      var givenContent = "";

      // Display the image or text label for correct answer
      ansContent = ans.image ? "<img src='" + ans.image + "' alt='Answer Image' style='width: 50px; height: 50px;'>" : getOptionLabel(ans);

      // Display the image or text label for given answer
      givenContent = givenAnswer ? (givenAnswer.image ? "<img src='" + givenAnswer.image + "' alt='Given Answer Image' style='width: 50px; height: 50px;'>" : getOptionLabel(givenAnswer)) : "Not Answered";

      var num = j + 1;
      pageDiv += "Q." + num + " " + ques + "<br>" + "Correct Answer: " + ansContent + "<br>" + "Answer Given: " + givenContent + "<br><br>";
    }

    pageDiv += "</div>";
    questionContent += pageDiv;
  }

  // Pagination controls
  paginationControls = "<div class='pagination-controls' style='text-align: center; margin-top: 20px;'>";
  for (var page = 0; page < numberOfPages; page++) {
    paginationControls += "<button class='btn btn-default' onclick='showPage(" + page + ")'>" + (page + 1) + "</button> ";
  }
  paginationControls += "</div>";

  // Save question content to local storage
  saveToLocalStorage(topicName + '_question_content', questionContent);

  // Hide unnecessary elements
  document.getElementById("picdiv").innerHTML = "";
  document.getElementById("picdiv").style.display = "none";
  document.getElementById("questiondiv").style.display = "none";
  document.getElementById("nextbtn").style.textAlign = "center";

  // Play confetti animation
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 }
  });

  // Play well-done sound
  var sound = new Audio('./assests/sounds/well-done.mp3'); // Update with the correct path to your sound file
  sound.play();
}



// function displayResults() {
//   window.location.href = "./graph.html";

//   // Calculate the score
//   score = Ansgiven.reduce((total, answer, index) => {
//     return answer === questions[index].answer ? total + 1 : total;
//   }, 0);

//   // Save score and completion status to local storage
//   saveToLocalStorage(topicName + '_score', score);
//   saveToLocalStorage(topicName + '_completed', 'true'); // Mark topic as completed

//   var percentage = (score / count) * 100;
//   var progressBarColor = "";
//   var feedbackMessage = "";

//   // Save report content to local storage
//   var home = "<a href='./graph.html'><b class='btn btn-success next-btn-progress'>Click here to View Report</b></a><br>";
//   var content = home;
//   saveToLocalStorage(topicName + '_results_content', content);

//   var questionsPerPage = 8;
//   var numberOfPages = Math.ceil(questions.length / questionsPerPage);
//   var questionContent = "";
//   var paginationControls = "";

//   // Iterate through the pages of questions
//   for (var page = 0; page < numberOfPages; page++) {
//     var start = page * questionsPerPage;
//     var end = Math.min(start + questionsPerPage, questions.length);
//     var pageDiv = "<div class='question-page' style='display: " + (page === 0 ? "block" : "none") + ";'><h2>Page " + (page + 1) + "</h2>";

//     for (var j = start; j < end; j++) {
//       var quesgroup = questions[j];
//       var ques = quesgroup.question;

//       // Handle correct answer
//       var ans = quesgroup.options[quesgroup.answer];
//       var ansContent = "";

//       // Handle given answer
//       var givenAnswer = Ansgiven[j] !== undefined ? quesgroup.options[Ansgiven[j]] : null;
//       var givenContent = "";

//       if (quesgroup.sound === true) {
//         // If sound is true, display a play button for sound
//         ansContent = "<button class='btn btn-sound' onclick='playOptionSound(\"" + ans.sound + "\")'>Play Correct Sound</button>";
//         givenContent = givenAnswer ? "<button class='btn btn-sound' onclick='playOptionSound(\"" + givenAnswer.sound + "\")'>Play Given Sound</button>" : "Not Answered";
//       } else {
//         // Otherwise, display the image or text label
//         ansContent = ans.image ? "<img src='" + ans.image + "' alt='Answer Image' style='width: 50px; height: 50px;'>" : getOptionLabel(ans);
//         givenContent = givenAnswer ? (givenAnswer.image ? "<img src='" + givenAnswer.image + "' alt='Given Answer Image' style='width: 50px; height: 50px;'>" : getOptionLabel(givenAnswer)) : "Not Answered";
//       }

//       var num = j + 1;
//       pageDiv += "Q." + num + " " + ques + "<br>" + "Correct Answer: " + ansContent + "<br>" + "Answer Given: " + givenContent + "<br><br>";
//     }

//     pageDiv += "</div>";
//     questionContent += pageDiv;
//   }

//   // Pagination controls
//   paginationControls = "<div class='pagination-controls' style='text-align: center; margin-top: 20px;'>";
//   for (var page = 0; page < numberOfPages; page++) {
//     paginationControls += "<button class='btn btn-default' onclick='showPage(" + page + ")'>" + (page + 1) + "</button> ";
//   }
//   paginationControls += "</div>";

//   // Save question content to local storage
//   saveToLocalStorage(topicName + '_question_content', questionContent);

//   // Hide unnecessary elements
//   document.getElementById("picdiv").innerHTML = "";
//   document.getElementById("picdiv").style.display = "none";
//   document.getElementById("questiondiv").style.display = "none";
//   document.getElementById("nextbtn").style.textAlign = "center";

//   // Play confetti animation
//   confetti({
//     particleCount: 200,
//     spread: 70,
//     origin: { y: 0.6 }
//   });

//   // Play well-done sound
//   var sound = new Audio('./assests/sounds/well-done.mp3'); // Update with the correct path to your sound file
//   sound.play();
// }


// Helper function to get the label for an option (if option is a string)
function getOptionLabel(option) {
  return typeof option === 'string' ? option : option.text || '';
}

// Helper function to play sound
function playOptionSound(soundPath) {
  var sound = new Audio(soundPath);
  sound.play();
}


// Helper function to get the label for an option (if option is a string)
function getOptionLabel(option) {
  return typeof option === 'string' ? option : option.text || '';
}




function showPage(page) {
  var pages = document.querySelectorAll('.question-page');
  pages.forEach((p, index) => {
    p.style.display = index === page ? 'block' : 'none';
  });
}

function checkAnswer() {
  submitSound.play();

  saveCurrentAnswer();
  document.getElementById("subbtn").style.display = "none";
  document.getElementById("nextbtn").style.display = "inline-block";
}

function abc(x) {
  // Save the current answer before changing questions
  saveCurrentAnswer();
  i = x - 1;
  loadQuestion(i);
  document.getElementById("result").innerHTML = "";
  document.getElementById("subbtn").style.display = "inline-block";
  document.getElementById("nextbtn").style.display = "none";

  // Update button styles and visibility
  highlightButton(i);
  updateButtonStyles();
}

function updateButtonVisibility() {
  var selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (selectedAnswer) {
    document.getElementById("subbtn").style.display = "inline-block";
    document.getElementById("nextbtn").style.display = "none";
  } else {
    document.getElementById("subbtn").style.display = "none";
    document.getElementById("nextbtn").style.display = "none";
  }
}

function highlightButton(index) {
  var buttonContainer = document.getElementById("buttonContainer");
  var buttons = buttonContainer.getElementsByTagName("button");

  // Remove highlight from all buttons
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].classList.remove("highlighted-btn");
  }

  // Add highlight to the current button
  if (index >= 0 && index < buttons.length) {
    buttons[index].classList.add("highlighted-btn");
  }
}

function updateButtonStyles() {
  var buttonContainer = document.getElementById("buttonContainer");
  
  if (buttonContainer) {
    var buttons = buttonContainer.getElementsByTagName("button");

    // Remove "answered-btn" class from all buttons
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].classList.remove("answered-btn");
    }

    // Add "answered-btn" class to the button for the answered questions
    Ansgiven.forEach((answer, index) => {
      if (answer !== null && index >= 0 && index < buttons.length) {
        buttons[index].classList.add("answered-btn");
      }
    });
  } else {
    console.error("Button container not found");
  }
}


function updateButtonText() {
  var nextButton = document.getElementById("nextbtn");
  if (i === count - 1) {
    nextButton.innerHTML = "FINISH TEST";
    nextButton.onclick = function() {
      newques(); // Calls newques which will hide buttonContainer
    };

  } else {
    nextButton.innerHTML = "Next";
   
  }
}


