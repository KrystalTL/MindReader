let uName;
let clickCount = 0;
let currentQuestion = 0;
let responses = [];
let progress = 0;
let interval;

// Array to hold criteria for each question (Question number, question text, input type, options)
const questions = [
    {
        number: "Question 1",
        text: "What's your name?",
        inputType: "text"
    },
    {
        number: "Question 2",
        text: "Where are you right now?",
        inputType: "radio",
        options: ["Home", "School", "Work", "Outside"]
    },
    {
        number: "Question 3",
        text: "What color is your shirt?",
        inputType: "buttons",
        options: ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink", "Black", "White"]
    },
    {
        number: "Question 4",
        text: "Are you having fun?",
        inputType: "buttons",
        options: ["Yes", "No"]
    },
    {
        number: "Question 5",
        text: "Think of a number from 1 to 10",
        inputType: "number"
    }
];

// Function to initiate the start of game
function start(){
    // Triggered by clicks
    const introText = document.getElementById("intro-text");

    if (clickCount === 0) {
        introText.innerHTML = "Are you ready to get your mind read?";
    } else if (clickCount === 1) {
        introText.innerHTML = "Don't worry ;) <br> it won't hurt...";
    } else if (clickCount === 2) {
        introText.innerHTML = '<img src="MindReader/pictures/faceOriginalBlack.png" alt="faceOriginal" style="width:300px; height:auto;">';
    } else if (clickCount === 3) {
        // Change screen from intro to start of the questions
        document.getElementById("intro").style.display = "none";
        document.getElementById("questions").style.display = "block";
        // Call the function to load questions
        loadQuestion();
    }

    // Increase click count to change the screen text
    clickCount++
}


// Function to load the questions
// Uses the questios array at the top to load the question number, question text, input type, and the input options is needed
function loadQuestion() {
    const q = questions[currentQuestion];
    document.getElementById("question-number").innerText = q.number;
    document.getElementById("question-text").innerText = q.text;

    const inputArea = document.getElementById("input-area");
    inputArea.innerHTML = "";

    const submitBtn = document.getElementById("submit-btn");

    if (q.inputType === "text"){
        inputArea.innerHTML = '<input type="text" id="text-input" placeholder="Type your name...">';
        submitBtn.style.display = "inline-block";
    }
    else if (q.inputType === "radio") {
        q.options.forEach((opt, i) => {
            inputArea.innerHTML += `
              <label>
                <input type="radio" id="radio-input" name="radio-input" value="${opt}"> ${opt}
              </label><br>`;
          });
        submitBtn.style.display = "inline-block";
    }
    else if (q.inputType === "buttons") {
        q.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.classList.add("btn-option");
            
            btn.innerText = opt;
            btn.onclick = () => {
              inputArea.dataset.selected = opt;
              submitAnswer();
            };
            inputArea.appendChild(btn);
          });
          submitBtn.style.display = "none";
        } 
    else if (q.inputType === "number") {
        inputArea.innerHTML = '<input type="number" id="number-input" min="1" max="10">';
        submitBtn.style.display = "inline-block";
    }
}

// Function to store the answer choices in responses array
function submitAnswer() {
    const q = questions[currentQuestion];
    let answer = "";

    if (q.inputType === "text"){
        answer = document.getElementById("text-input").value.trim();
    }
    else if (q.inputType === "radio") {
        const radios = document.getElementsByName("radio-input");
        for (let radio of radios) {
            if (radio.checked) {
                answer = radio.value;
                break;
            }
        }
    }
    else if (q.inputType === "buttons") {
        answer = document.getElementById("input-area").dataset.selected;
    }
    else if (q.inputType === "number") {
        answer = document.getElementById("number-input").value;
    }

    if (!answer) {
        alert("Please provide an answer or select an option!");
        return;
    }

    responses[currentQuestion] = answer;

     // Show response screen
     // Get rid of this later
    document.getElementById("questions").style.display = "none";
    document.getElementById("loading-screen").style.display = "block";

    // Set the appropriate image
    const imgElement = document.getElementById("loading-image");

    if (currentQuestion === 3) {
        // Question 4 logic (0-indexed): choose image based on answer
        const isYes = answer.toLowerCase() === "yes";
        imgElement.src = isYes ? "pictures/q4-yes-monkey.png" : "pictures/q4-no-monkey.png";
    } else {
        // General question logic
        imgElement.src = `pictures/q${currentQuestion + 1}-monkey.png`;
    }

    // Reset and animate progress bar
    progress = 0;
    document.getElementById("myBar").style.width = "0%";
    document.getElementById("myBar").innerText = "";

    interval = setInterval(() => {
        if (progress >= 100) {
            clearInterval(interval);
            document.getElementById("loading-screen").style.display = "none";

            currentQuestion++;
            if (currentQuestion < questions.length) {
                document.getElementById("questions").style.display = "block";
                loadQuestion();
            } else {
                showResults();
            }
        } else {
            progress += 3;
            if (progress > 100) progress = 100;
            const bar = document.getElementById("myBar");
            bar.style.width = progress + "%";
            bar.innerText = progress + "%";
        }
    }, 50);
    // document.getElementById("response-screen").style.display = "block";
    // document.getElementById("response-text").innerText = `You said: "${answer}"`;

    // // Update progress bar
    // const questionProgress = ((currentQuestion + 1) / questions.length) * 100;
    // document.getElementById("progress-bar").style.width = questionProgress + "%";

    // // Advance
    // setTimeout(() => {
    //     document.getElementById("response-screen").style.display = "none";
    //     document.getElementById("loading-screen").style.display = "block";

    //     progress = 0;
    //     document.getElementById("myBar").style.width = "0%";
    //     document.getElementById("myBar").style.innerText = "";

    //     interval = setInterval(() => {
    //         if (progress >= 100) {
    //             clearInterval(interval);
    //             document.getElementById("loading-screen").style.display = "none";
    
    //             currentQuestion++;
    //             if (currentQuestion < questions.length) {
    //                 document.getElementById("questions").style.display = "block";
    //                 loadQuestion();
    //             } else {
    //                 showResults();
    //             }
    //         } else {
    //             progress += 3;
    //             if (progress > 100){
    //                 progress = 100;
    //             }
    //             const bar = document.getElementById("myBar");
    //             bar.style.width = progress + "%";
    //             bar.innerText = progress + "%";
    //         }
    //     }, 50);
    // }, 1000);
}

function showResults() {
    document.getElementById("response-screen").style.display = "none";
    document.getElementById("loading-screen").style.display = "block";

    progress = 0;
    document.getElementById("myBar").style.width = "0%";
    document.getElementById("myBar").innerText = "";

    interval = setInterval(() => {
        if (progress >= 100) {
            clearInterval(interval);
            document.getElementById("loading-screen").style.display = "none";
            document.getElementById("final-screen").style.display = "block";

            const number = responses[4];

            // Step 1: Show initial text
            const finalMsg = document.getElementById("final-message");
            finalMsg.innerHTML = `You're thinking of...`;

            // Step 2: After 2 seconds, append the number line
            setTimeout(() => {
                finalMsg.innerHTML += `<br> the number <span class="big-number">${number}</span>`;
                document.getElementsByClassName("final-btns")[0].style.display = "block";
                document.getElementsByClassName("final-btns")[1].style.display = "block";
            }, 1500);
        } else {
            progress++;
            const bar = document.getElementById("myBar");
            bar.style.width = progress + "%";
            bar.innerText = progress + "%";
        }
    }, 20);
}

function showCrazyScreen() {
    document.getElementById("final-screen").style.display = "none";
    document.getElementById("crazy-screen").style.display = "block";
}

function backToFinalScreen() {
    document.getElementById("crazy-screen").style.display = "none";
    document.getElementById("final-screen").style.display = "block";
}

function showBruhScreen() {
    document.getElementById("final-screen").style.display = "none";
    document.getElementById("bruh-screen").style.display = "block";
}

function showDisUScreen() {
    document.getElementById("bruh-screen").style.display = "none";
    document.getElementById("bruh-disu-screen").style.display = "block";

    setTimeout(() => {
        document.getElementById("bruh-disu-screen").style.display = "none";
        showBruhReveal();
    }, 2000);
}
  
function showBruhReveal() {
    document.getElementById("bruh-final-screen").style.display = "block";

    const location = responses[1].toLowerCase(); // e.g., "school"
    const shirtColor = responses[2].toLowerCase(); // e.g., "blue"

    const bgImg = `pictures/${location}.png`;
    const shirtImg = `pictures/shirt-${shirtColor}.png`;

    document.getElementById("bruh-bg").src = bgImg;
    document.getElementById("bruh-overlay").src = shirtImg;
}


document.getElementById("submit-btn").onclick = submitAnswer;