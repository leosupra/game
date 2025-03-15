let lion, rockImg, bgImg;
let lionX, lionY, lionSpeed = 15;
let score = 0;
let rocks = [];
let rockSpeed = 10;
let maxRocks = 3;
let gameOver = false;
let speedIncreaseTimer;
let myFont;

function preload() {
  // Load assets - update paths to your actual files
  lion = loadImage('assets/1.chd');
  rockImg = loadImage('assets/2.chd');
  bgImg = loadImage('assets/3.chd');
}
function setup() {
  createCanvas(windowWidth, windowHeight); // Full-screen canvas
  createCanvas(800, 600);
  textFont('Arial');
  textSize(24);
  
  // Initial lion position
  lionX = 20;
  lionY = height/2 - 40;
  
  speedIncreaseTimer = millis();
}

function draw() {
  // Draw background
  image(bgImg, 0, 0, width, height);
  
  if (!gameOver) {
    handleInput();
    updateGame();
    drawGame();
  } else {
    drawGameOver();
  }
}

function handleInput() {
  if (keyIsDown(UP_ARROW) && lionY > 0) {
    lionY -= lionSpeed;
  }
  if (keyIsDown(DOWN_ARROW) && lionY < height - 80) {
    lionY += lionSpeed;
  }
}

function updateGame() {
  // Increase difficulty over time
  if (millis() - speedIncreaseTimer > 3000) {
    rockSpeed += 0.5;
    maxRocks = min(10, maxRocks + 1);
    speedIncreaseTimer = millis();
  }
  
  // Update rocks
  for (let i = rocks.length-1; i >= 0; i--) {
    rocks[i].x -= rockSpeed;
    
    // Remove off-screen rocks
    if (rocks[i].x < -rocks[i].w) {
      rocks.splice(i, 1);
      score++;
    }
    // Collision detection
    else if (collision(rocks[i])) {
      gameOver = true;
    }
  }
  
  // Spawn new rocks
  if (random() < 0.05 && rocks.length < maxRocks) {
    spawnRock();
  }
}

function drawGame() {
  // Draw lion
  image(lion, lionX, lionY, 80, 80);
  
  // Draw rocks
  for (let rock of rocks) {
    image(rockImg, rock.x, rock.y, rock.w, rock.h);
  }
  
  // Draw score
  fill(76, 187, 23);
  text(`Score: ${score}`, 10, 30);
}

function drawGameOver() {
  fill(0);
  textAlign(CENTER);
  text(" soldier, You failed in your duty to protect Leo !", width/2, 180);
  fill(76, 187, 23);
  text(`Your Score: ${score}`, width/2, 275);
  fill(255);
  text("Press SPACE to Retry", width/2, 560);
}

function keyPressed() {
  if (gameOver && key === ' ') {
    // Reset game state
    lionY = height/2 - 40;
    score = 0;
    rocks = [];
    rockSpeed = 10;
    maxRocks = 3;
    gameOver = false;
    speedIncreaseTimer = millis();
  }
}

function spawnRock() {
  const w = random(40, 60);
  const h = random(40, 60);
  const y = random(height - h);
  rocks.push({
    x: width,
    y: y,
    w: w,
    h: h
  });
}

function collision(rock) {
  return (lionX < rock.x + rock.w &&
          lionX + 80 > rock.x &&
          lionY < rock.y + rock.h &&
          lionY + 80 > rock.y);
}
