let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let playerName = "";
let walletAddress = "";

const questionArea = document.getElementById('question-area');
const answerButtons = document.getElementById('answer-buttons');
const nextBtn = document.getElementById('next-btn');
const scoreBoard = document.getElementById('score-board');

async function fetchQuestions() {
  try {
    const res = await fetch("https://opentdb.com/api.php?amount=7&category=31&difficulty=medium&type=multiple");
    const data = await res.json();
    questions = data.results;
    showQuestion();
  } catch (err) {
    questionArea.innerHTML = "<p>Failed to load questions.</p>";
  }
}

function showQuestion() {
  resetState();
  const q = questions[currentQuestionIndex];
  questionArea.innerHTML = `<h3>${decodeHTML(q.question)}</h3>`;
  const answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
  answers.forEach(answer => {
    const btn = document.createElement('button');
    btn.textContent = decodeHTML(answer);
    btn.addEventListener('click', () => selectAnswer(btn, decodeHTML(q.correct_answer)));
    answerButtons.appendChild(btn);
  });
}

function selectAnswer(btn, correct) {
  const allButtons = answerButtons.querySelectorAll("button");
  allButtons.forEach(b => b.disabled = true);
  if (btn.textContent === correct) {
    btn.style.backgroundColor = "green";
    score++;
  } else {
    btn.style.backgroundColor = "red";
  }
  nextBtn.classList.remove("hidden");
}

function resetState() {
  nextBtn.classList.add("hidden");
  answerButtons.innerHTML = "";
}

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endGame();
  }
});

function endGame() {
  questionArea.innerHTML = `<h3>Quiz completed!</h3><p>Your score: ${score}/7</p>`;
  answerButtons.innerHTML = "";
  nextBtn.style.display = "none";
  if (score >= 5) {
    questionArea.innerHTML += "<p>🎉 You won 10 ANP tokens!</p>";
  } else {
    questionArea.innerHTML += "<p>👍 Thanks for playing! You earned 1 ANP token.</p>";
  }
}

function decodeHTML(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

document.getElementById("pseudo-ok").addEventListener("click", () => {
  const nameInput = document.getElementById("pseudo-input");
  if (nameInput.value.trim() !== "") {
    playerName = nameInput.value.trim();
    nameInput.disabled = true;
    alert("Pseudo enregistré : " + playerName);
  }
});

document.getElementById("connect-wallet").addEventListener("click", async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      walletAddress = accounts[0];
      document.getElementById("wallet-status").textContent = `Wallet: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    } catch (error) {
      alert("Wallet connection failed.");
    }
  } else {
    alert("MetaMask is not installed.");
  }
});

fetchQuestions();
