let buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let started = false;
let userClickedPattern = [];
let level = 1;

// Listeners

// Start Game listener
$(document).keypress(() => {
  if (started === false) {
    gamePattern = [];
    userClickedPattern = [];
    started = true;
    nextSequence();
    // Needs button animation
    $("h1")[0].innerHTML = "Level 1";
  };
});

// Button click listener
$(".btn").click((e) => {
  if (started === true) {
    // Only allows click action if the game has been started (a key was pressed)
    let userChosenColor = e.target.attributes[1].value;
    userClickedPattern.push(userChosenColor);

    // Click animation
    e.target.classList.add("pressed");
    setTimeout(() => e.target.classList.remove("pressed"), 100);

    // Win/Lose logic (WIP)
    started = false;
    if (userClickedPattern.length === gamePattern.length) {
      if (userChosenColor === gamePattern[gamePattern.length - 1]) {
        // Pattern is complete and correct; level up; Play sound;
        levelComplete(userChosenColor);
      } else if (userChosenColor !== gamePattern[gamePattern.length - 1]) {
        // Loss condition if incorrect button is selected    
        lossSequence();
      };
    } else if (userClickedPattern.length !== gamePattern.length) {
      // Pattern is incomplete
      for (i in userClickedPattern) {
        if (userClickedPattern[i] === gamePattern[i]) {
          playAudio(userChosenColor);
          started = true;
          continue;
        } else if (userClickedPattern[i] !== gamePattern[i]) { 
          // Loss condition if incorrect button is selected    
          lossSequence();
          break;
        };
      };
    };
  };
});


// Methods

// returns an audio element for the chosen file (name)
function createButtonAudio(name) {
  let audio = new Audio(`sounds/${name}.mp3`);
  return audio;
};

async function playAudio(name) {
  await new Promise((resolve) => {
    let sound = createButtonAudio(name);
    sound.onended = resolve;
    sound.play();
  });
};

// Loss condition if incorrect button is selected   
function lossSequence() { 
  createButtonAudio("wrong").play();
  $("h1")[0].innerHTML = "Incorrect pattern. Game over.";
  level = 1;
  started = false;
};

// Level completed successfully
function levelComplete(color) {
  $("h1")[0].innerHTML = "Correct!";
  createButtonAudio(color).play();
  level++;
  userClickedPattern = [];
  setTimeout(() => {
    $("h1")[0].innerHTML = `Level ${level}`;
    nextSequence();
    started = true;
  }, 1000);
};

// Add new random color to gamePattern
function nextSequence() {
  let randomNumber = Math.floor(Math.random() * 4);
  let randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);

  // Button animation
  demonstrateGamePattern(gamePattern);
};

// Plays button audio and animations for gamePattern
async function demonstrateGamePattern(arr) {
  for (let i = 0; i < arr.length; i++) {
    // A promise is used to await the end of the previous sound before playing the next
    await new Promise((resolve) => {
      let sound = createButtonAudio(arr[i]);
      $(`#${arr[i]}`)[0].classList.add('pressed');
      setTimeout(() => $(`#${arr[i]}`)[0].classList.remove('pressed'), 100)
      sound.onended = resolve;
      sound.play();
    });
  };
};
