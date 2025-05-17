let uName;
let clickCount = 0;
let currentQuestion = 0;
let responses = ["Name","place","color","number"];
let progress = 0;
let interval;

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

function start(){
    const introText = document.getElementById("intro-text");

    if (clickCount === 0) {
        introText.innerHTML = "Are you ready to get your mind read?";
    } else if (clickCount === 1) {
        introText.innerHTML = "Don't worry, it won't hurt.";
    } else if (clickCount === 2) {
        introText.innerHTML = '<img src="pictures/faceOriginalBlack.png" alt="faceOriginal" style="width:300px; height:auto;">';
    } else if (clickCount === 3) {
        document.getElementById("intro").style.display = "none";
        document.getElementById("questions").style.display = "block";

        loadQuestion();
    }

    clickCount++
}

function loadQuestion() {
    const q = questions[currentQuestion];
    document.getElementById("question-number").innerText = q.number;
    document.getElementById("question-text").innerText = q.text;

    const inputArea = document.getElementById("input-area");
    inputArea.innerHTML = "";

    const submitBtn = document.getElementById("submit-btn");

    if (q.inputType === "text"){
        inputArea.innerHTML = '<input type="text" id="text-input" placeholder="Type your answer...">';
        submitBtn.style.display = "inline-block";
    }
    else if (q.inputType === "radio") {
        q.options.forEach((opt, i) => {
            inputArea.innerHTML += `
              <label>
                <input type="radio" name="radio-input" value="${opt}"> ${opt}
              </label><br>`;
          });
        submitBtn.style.display = "inline-block";
    }
    else if (q.inputType === "buttons") {
        q.options.forEach(opt => {
            const btn = document.createElement("button");
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

// function frame() {
//     if (progress >= 100) {
//         clearInterval(interval);
//     } else {
//         progress++;
//         document.getElementById("myBar").style.width = progress + "%";
//         document.getElementById("myBar").innerHTML = progress + "%";
//     }
// }

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
    document.getElementById("questions").style.display = "none";
    document.getElementById("response-screen").style.display = "block";
    document.getElementById("response-text").innerText = `You said: "${answer}"`;

    // Update progress bar
    const questionProgress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById("progress-bar").style.width = questionProgress + "%";

    // Advance
    setTimeout(() => {
        document.getElementById("response-screen").style.display = "none";
        document.getElementById("loading-screen").style.display = "block";

        progress = 0;
        document.getElementById("myBar").style.width = "0%";
        document.getElementById("myBar").style.innerText = "";

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
                if (progress > 100){
                    progress = 100;
                }
                const bar = document.getElementById("myBar");
                bar.style.width = progress + "%";
                bar.innerText = progress + "%";
            }
        }, 50);
    }, 1000);
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
            document.getElementById("final-message").innerText = `You're thinking of the number: ${number}`;
        } else {
            progress++;
            const bar = document.getElementById("myBar");
            bar.style.width = progress + "%";
            bar.innerText = progress + "%";
        }
    }, 20);
// document.getElementById("response-screen").style.display = "none";
// document.getElementById("loading-screen").style.display = "block";


//     let finalMessage = "You're thinking of the number " + $(responses[i]);

//     document.getElementById("response-text").innerText = finalMessage;
}

function showCrazyScreen() {
    document.getElementById("final-screen").style.display = "none";
    document.getElementById("crazy-screen").style.display = "block";
}

function showBruhScreen() {
    document.getElementById("final-screen").style.display = "none";
    document.getElementById("bruh-screen").style.display = "block";
}

document.getElementById("submit-btn").onclick = submitAnswer;

