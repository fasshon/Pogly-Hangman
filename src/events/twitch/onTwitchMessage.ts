import { ChatUserstate } from "tmi.js";
import Layouts from "../../module_bindings/layouts.js";
import SetLayoutActiveReducer from "../../module_bindings/set_layout_active_reducer.js";
import ElementStruct from "../../module_bindings/element_struct.js";
import { WidgetElement } from "../../module_bindings/widget_element.js";
import UpdateElementStructReducer from "../../module_bindings/update_element_struct_reducer.js";
import WidgetElements from "../../module_bindings/widget_element.js";
import "../../module_bindings/elements.js";
import Elements from "../../module_bindings/elements.js";

let WordList: string[] = [
  "apple", "brave", "chair", "dream", "eagle",
  "flame", "grape", "happy", "ivory", "jolly",
  "knack", "lemon", "mango", "noble", "ocean",
  "pearl", "queen", "river", "sunny", "tiger",
  "urban", "vivid", "witty", "xenon", "young",
  "zebra", "acorn", "bliss", "candy", "daisy",
  "ember", "frost", "giant", "honey", "inbox",
  "jelly", "karma", "lunar", "magic", "ninja",
  "olive", "piano", "quill", "robin", "smile",
  "train", "unity", "vigor", "whale", "xylem",
  "yield", "zesty", "alien", "beach", "crisp",
  "dodge", "elite", "fairy", "glide", "haste",
  "index", "jumps", "koala", "latch", "medal",
  "novel", "oasis", "punch", "quest", "rover",
  "spark", "trick", "umbra", "vocal", "wheat",
  "xerox", "yacht", "zonal", "angel", "bloom",
  "crown", "drift", "eager", "flock", "grove",
  "heart", "input", "jokes", "knock", "liver",
  "march", "night", "orbit", "plume", "quick",
  "rider", "stone", "tower", "under", "vowel"
];

let SelectedWord = "";
let Authenticated: string[] = ["akaoutlaw", "n333mo_", "junzioi", "fasshn"];
let UsersEntered: string[] = [];
let running = false;
let SelectedUser = "";
let Listener = false;
let timeLeft: number = 10;
let countdownInterval: ReturnType<typeof setInterval> | null = null;
let guessedLetters: string[] = [];
let wrongGuesses: number = 0;
let currentDisplay: string = "";

const elementId = 2;
let CurrentPhase = 0;
let NUJ = "";

function startCountdown(isInitial: boolean = true) {
  timeLeft = isInitial ? 10 : 5;

  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }

  const element = Elements.findById(elementId);
  if (!element) return;

  const widgetStruct: ElementStruct = element.element;

  countdownInterval = setInterval(() => {
    timeLeft--;

    let displayTime = timeLeft > 0 ? timeLeft.toString() : "Starting...";
    
    if (displayTime == "Starting...") {
      clearInterval(countdownInterval!);
      countdownInterval = null;
      selectRandomUser();
      currentDisplay = getWordDisplay();
      drawChatWidget(SelectedUser, currentDisplay);
      Listener = true;
    } else {
      drawMainScreen(NUJ || "Waiting...", displayTime);
    }
  }, 1000);
}

function drawMainScreen(userText: string, timeText: string) {
  const element = Elements.findById(elementId);
  if (!element) return;

  const widgetStruct: ElementStruct = element.element;
  
  const MainScreen = {
    widgetName: "Hangman",
    widgetWidth: 128,
    widgetHeight: 128,
    headerTag: `<meta charset="UTF-8">
<title>Hangman</title>`,
    bodyTag: `<h1 id="newestUser">${userText}</h1>
<div id="countdown" style="font-size: 24px; color: #ffffff; margin-bottom: 20px;">${timeText}</div>
<div class="hangman-container">
  <svg viewBox="0 0 200 300">
    <line x1="20" y1="280" x2="180" y2="280" class="gallow-line" id="base"/>
    <line x1="50" y1="280" x2="50" y2="20" class="gallow-line" id="vertical"/>
    <line x1="50" y1="20" x2="130" y2="20" class="gallow-line" id="top"/>
    <line x1="130" y1="20" x2="130" y2="50" class="gallow-line" id="rope"/>
    <circle cx="130" cy="70" r="20" class="part" id="head"/>
    <line x1="130" y1="90" x2="130" y2="150" class="part" id="body"/>
    <line x1="130" y1="100" x2="100" y2="130" class="part" id="left-arm"/>
    <line x1="130" y1="100" x2="160" y2="130" class="part" id="right-arm"/>
    <line x1="130" y1="150" x2="100" y2="190" class="part" id="left-leg"/>
    <line x1="130" y1="150" x2="160" y2="190" class="part" id="right-leg"/>
    <circle cx="124" cy="65" r="2" class="part" id="eye-left"/>
    <circle cx="136" cy="65" r="2" class="part" id="eye-right"/>
    <path d="M124,80 Q130,85 136,80" stroke="#e74c3c" stroke-width="2" fill="none" class="part" id="mouth"/>
  </svg>
</div>
<div style="text-align:center; font-size: 40px; color: #e5f2ff; margin-top: 60px;">!enter</div>`,
    styleTag: `body {
    font-family: 'Segoe UI', sans-serif;
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    margin: 0;
    padding: 40px;
}

h1 {
    color: #ffffff;
    margin-bottom: 30px;
    text-shadow: 0 0 10px #56f9ff, 0 0 20px #56f9ff, 0 0 30px #42e9ff;
    font-size: 32px;
    letter-spacing: 2px;
}

#countdown {
    font-size: 48px;
    color: #00ffff;
    margin-bottom: 20px;
    text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
    font-weight: bold;
}

.hangman-container {
    width: 300px;
    height: 400px;
    position: relative;
    margin-bottom: 30px;
    background: rgba(20, 20, 20, 0.8);
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
}

svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.5));
}

.gallow-line, .part {
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: 0;
    transition: opacity 0.3s ease-in;
}

.gallow-line {
    stroke: #00ffff;
    stroke-width: 8;
}

.part {
    stroke: #ff0066;
    stroke-width: 6;
    fill: none;
}

.visible {
    opacity: 1;
}

body > div:last-child {
    text-align: center;
    font-size: 40px;
    color: #ffff00;
    margin-top: 60px;
    text-shadow: 0 0 10px #ffff00, 0 0 20px #ffff00;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
}`,
    scriptTag: `const phases = [
    [],
    ['base'],
    ['base','vertical'],
    ['base','vertical','top'],
    ['base','vertical','top','rope'],
    ['base','vertical','top','rope','head'],
    ['base','vertical','top','rope','head','body'],
    ['base','vertical','top','rope','head','body','left-arm','right-arm'],
    ['base','vertical','top','rope','head','body','left-arm','right-arm','left-leg','right-leg'],
    ['base','vertical','top','rope','head','body','left-arm','right-arm','left-leg','right-leg','eye-left','eye-right','mouth']
];

function setPhase(currentPhase){
    document.querySelectorAll('.gallow-line, .part').forEach(p => p.classList.remove('visible'));
    if(currentPhase >= 0 && currentPhase <= 9){
        phases[currentPhase].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.classList.add('visible');
        });
    }
}

setPhase(${CurrentPhase});`
  };

  (widgetStruct.value as WidgetElement).rawData = JSON.stringify(MainScreen);
  UpdateElementStructReducer.call(elementId, widgetStruct);
}

function getWordDisplay(): string {
  return SelectedWord
    .split('')
    .map(char => guessedLetters.includes(char) ? char : '_')
    .join(' ');
}

function selectRandomUser() {
  if (UsersEntered.length === 0) return;
  const randomIndex = Math.floor(Math.random() * UsersEntered.length);
  SelectedUser = UsersEntered[randomIndex];
  console.log(`Selected user: ${SelectedUser}`);
}

function checkWin(): boolean {
  return SelectedWord.split('').every(char => guessedLetters.includes(char));
}

function selectNewPlayer(message: string) {
  Listener = false;
  drawChatWidget(SelectedUser, message);
  
  setTimeout(() => {
    if (UsersEntered.length === 0) {
      console.log("No users available for selection");
      return;
    }
    
    startCountdown(false);
  }, 3000);
}

function handleGuess(guess: string) {
  guess = guess.toLowerCase().trim();
  
  if (guess.length > 1) {
    if (guess === SelectedWord) {
      currentDisplay = SelectedWord.split('').join(' ').toUpperCase();
      drawChatWidget(SelectedUser, `YOU WIN!\n${currentDisplay}`);
      
      setTimeout(() => {
        if (running) {
          resetGame();
        }
      }, 5000);
      return;
    } else {
      wrongGuesses += 2;
      CurrentPhase = Math.min(CurrentPhase + 2, 9);
      
      if (checkLoss()) {
        return;
      }
      
      selectNewPlayer("❌ WRONG WORD!");
      return;
    }
  }
  
  if (guess.length === 1 && /[a-z]/.test(guess)) {
    if (guessedLetters.includes(guess)) {
      console.log(`Letter ${guess} already guessed`);
      return;
    }
    
    guessedLetters.push(guess);
    
    if (SelectedWord.includes(guess)) {
      console.log(`Correct! Letter ${guess} is in the word`);
      currentDisplay = getWordDisplay();
      
      if (checkWin()) {
        currentDisplay = SelectedWord.split('').join(' ').toUpperCase();
        drawChatWidget(SelectedUser, `YOU WIN!\n${currentDisplay}`);
        
        setTimeout(() => {
          if (running) {
            resetGame();
          }
        }, 5000);
        return;
      }
      
      drawChatWidget(SelectedUser, currentDisplay);
    } else {
      console.log(`Wrong! Letter ${guess} is not in the word`);
      wrongGuesses++;
      CurrentPhase = Math.min(CurrentPhase + 1, 9);
      
      if (checkLoss()) {
        return;
      }
      
      selectNewPlayer(`❌`);
    }
  }
}

function checkLoss(): boolean {
  if (CurrentPhase >= 9) {
    drawChatWidget(SelectedUser, `GAME OVER!\nWord: ${SelectedWord.toUpperCase()}`);
    
    setTimeout(() => {
      if (running) {
        resetGame();
      }
    }, 5000);
    return true;
  }
  return false;
}

function resetGame() {
  Listener = false;
  guessedLetters = [];
  wrongGuesses = 0;
  CurrentPhase = 0;
  SelectedWord = "";
  SelectedUser = "";
  
  console.log("Round ended! Starting new round in 3 seconds...");
  
  drawMainScreen("Next Round Starting...", "Get Ready!");
  
  setTimeout(() => {
    if (!running) {
      console.log("Game was stopped, not starting new round");
      return;
    }
    
    SelectWord();
    console.log(`New round started! Word: ${SelectedWord}`);
    startCountdown(true);
  }, 3000);
}

function onTwitchMessage(channel: string, tags: ChatUserstate, message: string) {
  const username = tags.username?.toLowerCase() || 'unknown';
  
  if (Listener && username === SelectedUser) {
    if (!message.startsWith("!")) {
      handleGuess(message);
      return;
    }
  }
  
  if (!message.startsWith("!")) return;
  
  const [command, ...args] = message.slice(1).split(" ");
  if (!command) return;
  
  switch (command.toLowerCase()) {
    case "start":
      if (!AuthenticatedUser(username)) return;
      if (running) {
        console.log("Game already running!");
        return;
      }
      
      running = true;
      UsersEntered = [];
      guessedLetters = [];
      wrongGuesses = 0;
      CurrentPhase = 0;
      SelectWord();
      console.log(`Event started! Word: ${SelectedWord}`);
      startCountdown(true);
      break;

    case "enter":
      if (!running) return;
      if (Listener) {
        console.log("Too late! Game already started.");
        return;
      }
      EnterUser(channel, tags, message);
      break;

    case "stop":
      if (!AuthenticatedUser(username)) return;
      running = false;
      Listener = false;
      UsersEntered = [];
      guessedLetters = [];
      wrongGuesses = 0;
      CurrentPhase = 0;
      SelectedWord = "";
      SelectedUser = "";
      NUJ = "";
      
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
      
      drawMainScreen("Game Stopped", "Type !enter to join");
      console.log("Event stopped!");
      break;

    default:
      break;
  }
}

function EnterUser(channel: string, tags: ChatUserstate, message: string) {
  const username = tags.username?.toLowerCase() || tags['display-name']?.toLowerCase() || 'unknown';

  if (UsersEntered.includes(username)) {
    console.log(`${username} has already entered.`);
    return;
  }

  UsersEntered.push(username);
  console.log(`${username} entered. Total: ${UsersEntered.length}`);
  NUJ = `Last: ${username}`;

  drawMainScreen(NUJ, timeLeft.toString());
}

function AuthenticatedUser(username: string): boolean {
  return Authenticated.includes(username.toLowerCase());
}

function drawChatWidget(username: string, guess: string) {
  console.log(`Drawing chat widget for ${username} with guess: ${guess}`);
  
  const element = Elements.findById(elementId);
  if (!element) {
    console.log("Couldn't find the specified element for ChatWidget!");
    return;
  }

  const widgetStruct: ElementStruct = element.element;
  
  const ChatWidget = {
    widgetName: "ChatUI",
    widgetWidth: 300,
    widgetHeight: 200,
    headerTag: "<meta charset=\"UTF-8\">\n<title>Chat UI</title>",
    bodyTag: `<div class="chat-container">
  <div class="selected-user">Selected: <span id="username"> ${username}</span></div>
  <div class="instruction">Guess a letter or the full word!</div>
  <div class="guess" id="guess">${guess}</div>
  <div class="wrong-guesses">Wrong guesses: ${wrongGuesses}/6</div>
</div>`,
    styleTag: `body {
  font-family: 'Courier New', monospace;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  min-height: 100vh;
}

.chat-container {
  background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
  border-radius: 15px;
  padding: 25px 35px;
  box-shadow: 0 8px 32px rgba(71, 255, 255, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5);
  width: 350px;
  border: 2px solid #00ffff;
}


.selected-user {
  font-weight: bold;
  margin-bottom: 15px;
  color: #f9fcf9;
  text-shadow: 0 0 10px #33f1ff;
  font-size: 18px;
}

.instruction {
  font-size: 14px;
  color: #00ffff;
  margin-bottom: 20px;
  text-shadow: 0 0 5px #00ffff;
}

.guess {
  background: rgba(0, 0, 0, 0.1);
  padding: 15px;
  border-radius: 10px;
  color: #ffffff;
  font-weight: bold;
  font-size: 28px;
  letter-spacing: 8px;
  text-align: center;
  margin-bottom: 15px;
  border: 2px solid #55cfff;
  text-shadow: 0 0 10px #575757;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrong-guesses {
  color: #ff0000;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0 0 8px #ff0066;
}
`,
    scriptTag: ""
  };

  (widgetStruct.value as WidgetElement).rawData = JSON.stringify(ChatWidget);
  UpdateElementStructReducer.call(elementId, widgetStruct);
}

function SelectWord() {
  const randomIndex = Math.floor(Math.random() * WordList.length);
  SelectedWord = WordList[randomIndex].toLowerCase();
  console.log(`Selected word: ${SelectedWord}`);
}

export default onTwitchMessage;