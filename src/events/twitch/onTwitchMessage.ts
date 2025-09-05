import { ChatUserstate } from "tmi.js";
import Layouts from "../../module_bindings/layouts.js";
import SetLayoutActiveReducer from "../../module_bindings/set_layout_active_reducer.js";
import ElementStruct from "../../module_bindings/element_struct.js";
import { WidgetElement } from "../../module_bindings/widget_element.js";
import UpdateElementStructReducer from "../../module_bindings/update_element_struct_reducer.js";
import WidgetElements from "../../module_bindings/widget_element.js";
import "../../module_bindings/elements.js";
import Elements from "../../module_bindings/elements.js";
import { execPath } from "process";



let charlist: string[] = []; 
let WordList: string[] = 
[  
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
let WordSelected = false;
let countdownInterval: ReturnType<typeof setInterval> | null = null;

function startCountdown() {
    timeLeft = 10;

    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    const element = Elements.findById(elementId);
    if (!element) return;

    const widgetStruct: ElementStruct = element.element;

    countdownInterval = setInterval(() => {
        timeLeft--;

        let displayTime = timeLeft > 0 ? timeLeft.toString() : "Drawing....";
        if (displayTime == "Drawing....") {
            drawChatWidget(NUJ, "_ _ _ _ _");
            Listener = true;
        } else {
            const MainScreenCopy = JSON.parse(JSON.stringify(MainScreen));
            MainScreenCopy.bodyTag = MainScreenCopy.bodyTag
                .replace("{{NUJ}}", NUJ)
                .replace("{{CurrentPhase}}", CurrentPhase.toString())
                .replace("{{CurrentTime}}", displayTime);

            (widgetStruct.value as WidgetElement).rawData = JSON.stringify(MainScreenCopy);
            UpdateElementStructReducer.call(elementId, widgetStruct);
        }

        if (timeLeft <= 0) {
            clearInterval(countdownInterval!);
            countdownInterval = null;
        }
    }, 1000);
}


const elementId = 1;
let CurrentPhase = 2;
let NUJ = "";
let MainScreen = {
  "widgetName": "Hangman",
  "widgetWidth": 128,
  "widgetHeight": 128,
  "headerTag": "<meta charset=\"UTF-8\">\n<title>Hangman</title>",
  "bodyTag": "<h1 id=\"newestUser\">{{NUJ}}</h1>\n<div id=\"countdown\" style=\"font-size: 24px; color: #2c3e50; margin-bottom: 20px;\">{{CurrentTime}}</div>\n<div class=\"hangman-container\">\n  <svg viewBox=\"0 0 200 300\">\n    <line x1=\"20\" y1=\"280\" x2=\"180\" y2=\"280\" class=\"gallow-line\" id=\"base\"/>\n    <line x1=\"50\" y1=\"280\" x2=\"50\" y2=\"20\" class=\"gallow-line\" id=\"vertical\"/>\n    <line x1=\"50\" y1=\"20\" x2=\"130\" y2=\"20\" class=\"gallow-line\" id=\"top\"/>\n    <line x1=\"130\" y1=\"20\" x2=\"130\" y2=\"50\" class=\"gallow-line\" id=\"rope\"/>\n    <circle cx=\"130\" cy=\"70\" r=\"20\" class=\"part\" id=\"head\"/>\n    <line x1=\"130\" y1=\"90\" x2=\"130\" y2=\"150\" class=\"part\" id=\"body\"/>\n    <line x1=\"130\" y1=\"100\" x2=\"100\" y2=\"130\" class=\"part\" id=\"left-arm\"/>\n    <line x1=\"130\" y1=\"100\" x2=\"160\" y2=\"130\" class=\"part\" id=\"right-arm\"/>\n    <line x1=\"130\" y1=\"150\" x2=\"100\" y2=\"190\" class=\"part\" id=\"left-leg\"/>\n    <line x1=\"130\" y1=\"150\" x2=\"160\" y2=\"190\" class=\"part\" id=\"right-leg\"/>\n    <circle cx=\"124\" cy=\"65\" r=\"2\" class=\"part\" id=\"eye-left\"/>\n    <circle cx=\"136\" cy=\"65\" r=\"2\" class=\"part\" id=\"eye-right\"/>\n    <path d=\"M124,80 Q130,85 136,80\" stroke=\"#e74c3c\" stroke-width=\"2\" fill=\"none\" class=\"part\" id=\"mouth\"/>\n  </svg>\n</div>\n<div style=\"text-align:center; font-size: 40px; color: #2c3e50; margin-top: 60px;\">!enter</div>",
  "styleTag": "body {\n    font-family: 'Segoe UI', sans-serif;\n    background: linear-gradient(to bottom, #f0f0f0, #d9e2f3);\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: flex-start;\n    min-height: 100vh;\n    margin: 0;\n    padding: 40px;\n}\n\nh1 {\n    color: #2c3e50;\n    margin-bottom: 30px;\n    text-shadow: 1px 1px 2px #aaa;\n}\n\n.hangman-container {\n    width: 300px;\n    height: 400px;\n    position: relative;\n    margin-bottom: 30px;\n}\n\nsvg {\n    width: 100%;\n    height: 100%;\n}\n\n.gallow-line, .part {\n    stroke-linecap: round;\n    stroke-linejoin: round;\n    opacity: 0;\n    transition: opacity 0.3s ease-in;\n}\n\n.gallow-line {\n    stroke: #2c3e50;\n    stroke-width: 8;\n}\n\n.part {\n    stroke: #e74c3c;\n    stroke-width: 6;\n    fill: none;\n}\n\n.visible {\n    opacity: 1;\n}\n",
  "scriptTag": `
const phases = [
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
function updateUsername(name){
    document.getElementById('newestUser').textContent = name;
}

function updateCurrentTime(time){
    document.getElementById('countdown').textContent = time;
}

// Initialize
setPhase(MainScreen.variables.find(v=>v.variableName==='CurrentPhase').variableValue);
updateUsername(MainScreen.variables.find(v=>v.variableName==='NUJ').variableValue);
updateCurrentTime(MainScreen.variables.find(v=>v.variableName==='CurrentTime').variableValue);

// Countdown logic updating MainScreen variables
let timeLeft = MainScreen.variables.find(v=>v.variableName==='CurrentTime').variableValue;
const countdownInterval = setInterval(()=>{
    timeLeft--;
    if(timeLeft < 0) timeLeft = 0;

    // Update CurrentTime variable and display
    const currentTimeVar = MainScreen.variables.find(v=>v.variableName==='CurrentTime');
    if(currentTimeVar){
        currentTimeVar.variableValue = timeLeft;
    }
    updateCurrentTime(timeLeft);

    // Map timeLeft to hangman phase (0-9)
    const phaseVar = MainScreen.variables.find(v=>v.variableName==='CurrentPhase');
    if(phaseVar){
        // Linear mapping: 10 seconds → 10 phases
        const phase = Math.min(9, 10 - timeLeft);
        phaseVar.variableValue = phase;
        setPhase(phase);
    }

    if(timeLeft <= 0){
        updateCurrentTime("Time's up!");
        clearInterval(countdownInterval);
    }
}, 1000);
`,
  "variables": [
    {
      "variableName": "CurrentPhase",
      "variableType": 1,
      "variableValue": CurrentPhase
    },
    {
      "variableName": "NUJ",
      "variableType": 3,
      "variableValue": NUJ
    },
    {
      "variableName": "CurrentTime",
      "variableType": 1,
      "variableValue": timeLeft
    }
  ]
};
let ChatWidget = {
  "widgetName": "ChatUI",
  "widgetWidth": 300,
  "widgetHeight": 200,
  "headerTag": "<meta charset=\"UTF-8\">\n<title>Chat UI</title>",
  "bodyTag": "<div class=\"chat-container\">\n  <div class=\"selected-user\">Selected: <span id=\"username\">{{Username}}</span></div>\n  <div class=\"instruction\">Please select a word or guess the word</div>\n  <div class=\"guess\" id=\"guess\">{{Guess}}</div>\n</div>",
  "styleTag": "body {\n  font-family: Arial, sans-serif;\n  background: #f5f5f5;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 50px;\n}\n\n.chat-container {\n  background: #fff;\n  border-radius: 10px;\n  padding: 20px 30px;\n  box-shadow: 0 4px 10px rgba(0,0,0,0.1);\n  width: 300px;\n}\n\n.selected-user {\n  font-weight: bold;\n  margin-bottom: 10px;\n  color: #2c3e50;\n}\n\n.instruction {\n  font-size: 14px;\n  color: #555;\n  margin-bottom: 15px;\n}\n\n.guess {\n  background: #ecf0f1;\n  padding: 10px;\n  border-radius: 5px;\n  color: #34495e;\n  font-weight: bold;\n}\n",
  "scriptTag": `
function updateUsername(name){
    document.getElementById('username').textContent = name;
}

function updateGuess(guess){
    document.getElementById('guess').textContent = guess;
}

// Initialize with variables
updateUsername(ChatWidget.variables.find(v=>v.variableName==='Username').variableValue);
updateGuess(ChatWidget.variables.find(v=>v.variableName==='Guess').variableValue);
`,
  "variables": [
    {
      "variableName": "Username",
      "variableType": 3,
      "variableValue": "JohnDoe"
    },
    {
      "variableName": "Guess",
      "variableType": 3,
      "variableValue": "_ _ _ _ _"
    }
  ]
};

function onTwitchMessage(channel: string, tags: ChatUserstate, message: string) {
  const [command, arg] = message.slice(1).split(" ");
  if (!command) return;

  if (Listener)
  {
    if (tags.username == SelectedUser)
    {
      if (message == SelectedWord)
      {

      }
      if (message in charlist)
      {

      }
      else
      {

      }
    }
  }
  else
  {
    switch (command.toLowerCase()) {
  case "start":
      if (!message.startsWith("!")) return;
      if (!AuthenticatedUser(tags.username ?? "")) return;
      running = true;
      SelectWord();
      console.log("Event started!");
      startCountdown();
      break;

    case "enter":
      if (!running) return;
      EnterUser(channel, tags, message);
      break;

    case "stop":
        if (!message.startsWith("!")) return;
      if (!AuthenticatedUser(tags.username ?? "")) return;
      running = false;
      console.log("Event stopped!");
      break;

    default:
      console.log("Unknown command:", command);
  }
  }
  
}

function EnterUser(channel: string, tags: ChatUserstate, message: string) {
    const username = tags.username?.toLowerCase() || tags['display-name']?.toLowerCase() || 'unknown';

    if (UsersEntered.includes(username)) {
        console.log(`${username} has already entered.`);
        return;
    }

    UsersEntered.push(username);
    console.log(`${username} entered`);
    NUJ = username;

    // Increment the phase
    CurrentPhase = Math.min(CurrentPhase + 1, 9);

    const element = Elements.findById(elementId);
    if (!element) {
        console.log("Couldn't find the specified element!");
        return;
    }

    const widgetStruct: ElementStruct = element.element;

    // Update the widget data
    const MainScreenCopy = JSON.parse(JSON.stringify(MainScreen));
    MainScreenCopy.bodyTag = MainScreenCopy.bodyTag
        .replace("{{NUJ}}", NUJ)
        .replace("{{CurrentPhase}}", CurrentPhase.toString())
        .replace("{{CurrentTime}}", timeLeft.toString());

    (widgetStruct.value as WidgetElement).rawData = JSON.stringify(MainScreenCopy);
    UpdateElementStructReducer.call(elementId, widgetStruct);
    console.log(timeLeft)
}

function AuthenticatedUser(username: string): boolean {
  return Authenticated.includes(username.toLowerCase());
}



function drawChatWidget(username: string, guess: string) {


  const randomIndex = Math.floor(Math.random() * UsersEntered.length);
  SelectedUser = UsersEntered[randomIndex];

    const element = Elements.findById(elementId);
    if (!element) {
        console.log("Couldn't find the specified element for ChatWidget!");
        return;
    }

    const widgetStruct: ElementStruct = element.element;

    // Clone ChatWidget and replace placeholders
    const ChatWidgetCopy = JSON.parse(JSON.stringify(ChatWidget));
    ChatWidgetCopy.bodyTag = ChatWidgetCopy.bodyTag
        .replace("{{Username}}", SelectedUser)
        .replace("{{Guess}}", guess);

    (widgetStruct.value as WidgetElement).rawData = JSON.stringify(ChatWidgetCopy);
    UpdateElementStructReducer.call(elementId, widgetStruct);
}


function SelectWord()
{
  const randomIndex = Math.floor(Math.random() * WordList.length);
  SelectedWord = WordList[randomIndex];

  for (const char of SelectedWord) {
    charlist.push(char);
  }
  
}
export default onTwitchMessage;
