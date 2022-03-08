const ballCollisionSound = new Audio('audio.wav');
const paddleHitSound = new Audio('paddleHit.wav');
const backgroundSound = new Audio('back.mp3');

let level = localStorage.getItem("Level");
const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");
const Width_Of_Paddle = 20;
const Height_Of_Paddle = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const RADIUS_Of_Ball = 12;
const BACKGROUND = new Image;
const totalGamePoints = 10;
let isStart = false;
let upArrow = false;
let downArrow = false;
let upKey = false;
let downKey = false;
let player1Score = 0;
let player2Score = 0;
let gameOver = false;
let checkObstacleStatus = false;


let COLORS = {
    paddel1Color : "#D68910 ",
    paddel2Color : "yellow",
    stableObstacleColor: "cyan",
    movingObstacleColor1: "green",
    movingObstacleColor2: "#D68910", 
};
//paddle class *****************************************************************************
class Paddle {
    dy = 5;
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

    }
    paddleDraw(colorChoice) {
        context.fillStyle =colorChoice ;
        context.fillRect(this.x, this.y, this.width, this.height);

        context.strokeStyle = "white";
        context.strokeRect(this.x, this.y, this.width, this.height);


    }
}

//obstacle class*****************************************************************************
class Obstacle {
    dy = 2;
    constructor(x, y, obsWidth, obsHeight) {
        this.x = x;
        this.y = y;
        this.obsWidth = obsWidth;
        this.obsHeight = obsHeight;
    }
    obstacleDraw(colorChoice) {
        context.fillStyle = colorChoice;
        context.fillRect(this.x, this.y, this.obsWidth, this.obsHeight);
    }

    movingObstacleMovement(check) {
        if (check) {
       
            this.y += this.dy;
        }
        else {
          
            this.y -= this.dy
        }

    }
    obstacleCollision() {
        if (ball.y + ball.radius >= this.y && ball.y - ball.radius <= this.y + this.obsHeight && ball.x + ball.radius >= this.x && ball.x - ball.radius <= this.x + this.obsWidth) {
            ball.dx = -ball.dx;
            ball.dy = ball.dy;
        }
    }


}
//level checking according to user input************************************************************************************* */
if (level == "easy") {
    easy();
} else if (level == "medium") {
    medium();
} else {
    hard();
}


let playerSecond = localStorage.getItem("PlayerSecond");
let playerName = localStorage.getItem("userName");

//definition of ball
const ball = {
    x: canvas.width - 1000,
    y: paddleLeft.y - RADIUS_Of_Ball,
    radius: RADIUS_Of_Ball,
    speed: 4,
    dx: +3,
    dy: -3 * (Math.random() * 2 - 1)
}

//Drawing of ball
function drawBall() {

    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = "#3498DB ";
    context.fill();
    context.strokeStyle = "black";
    context.stroke();
    context.closePath();
}

// ball movement function 
function ballMovement() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}


// define the collision of ball with walls 
function ballCollisionWithWalls() {
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {

        ballCollisionSound.play();
        ball.dx = -ball.dx;
        ball.dy = ball.dy;
        if (ball.x + ball.radius > canvas.width) {
            ballCollisionSound.play();
            player1Score++;
        }
        if (ball.x - ball.radius < 0) {
            ballCollisionSound.play();
            player2Score++;
        }
    }
    if (ball.y - ball.radius < 0) {
        ballCollisionSound.play();
        ball.dy = -ball.dy;
        ball.dx = ball.dx;
    }
    if (ball.y + ball.radius > canvas.height) {
        ballCollisionSound.play();
        ball.dy = -ball.dy;
    }

}

// key press events for paddle movement 
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp") {
        upArrow = true;
    } else if (event.key === "ArrowDown") {
        downArrow = true;
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowUp") {
        upArrow = false;
    } else if (event.key === "ArrowDown") {
        downArrow = false;
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === 'a' || event.key === 'A') {
        upKey = true;
    } else if (event.key === "z" || event.key === "Z") {
        downKey = true;
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key === 'a' || event.key === 'A') {
        upKey = false;
    } else if (event.key === 'z' || event.key === 'Z') {
        downKey = false;
    }
});


// Right paddle movement according to key press 
function paddleRightMovement() {
    if (downArrow && paddleRight.y + paddleRight.height < canvas.height - 5) {
        paddleRight.y += paddleRight.dy;
    } else if (upArrow && paddleRight.y > 5) {
        paddleRight.y -= paddleRight.dy;
    }
}

// Left  paddle movement according to key press 
function paddleLeftMovement() {
    if (downKey && paddleLeft.y + paddleLeft.height < canvas.height - 5) {
        paddleLeft.y += paddleLeft.dy;
    } else if (upKey && paddleLeft.y > 5) {
        paddleLeft.y -= paddleLeft.dy;
    }
}

// Ball collision definition with right paddle
function ballCollisionWithRightPaddle() {
    if (ball.x + ball.radius <= paddleRight.x + paddleRight.width && ball.x + ball.radius >= paddleRight.x && ball.y <= paddleRight.y + paddleRight.height && ball.y >= paddleRight.y) {
        paddleHitSound.play();
        let collidePoint = ball.x - (paddleRight.x + paddleRight.width / 2);

        collidePoint = collidePoint / (paddleRight.width / 2);

        let angle = collidePoint * Math.PI / 3;
        paddleHitSound.play();
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
        ball.speed += 0.05;

    }
}

// Ball collision definition with Left  paddle
function ballCollisionWithLeftPaddle() {
    if (ball.x - ball.radius <= paddleLeft.x + paddleLeft.width && ball.x - ball.radius >= paddleLeft.x && ball.y <= paddleLeft.y + paddleLeft.height && ball.y >= paddleLeft.y) {
        paddleHitSound.play();
        let collidePoint = ball.x - (paddleLeft.x + paddleLeft.width / 2);

        collidePoint = collidePoint / (paddleLeft.width / 2);

        let angle = collidePoint * Math.PI / 3;
        paddleHitSound.play();
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = ball.speed * Math.cos(angle);
        ball.speed += 0.05;
    }
}


//computer paddle movement when user choose to play with computer 
function computerPaddleLoose() {
    let temp = !!(Math.floor(Math.random() * 2))
    console.log(temp);
    if (temp) {
        if (paddleLeft.y + paddleLeft.height < ball.y + ball.radius) {
            paddleLeft.y += paddleLeft.dy;
            //    +5
        } else if (paddleLeft.y > ball.y + ball.radius) {
            paddleLeft.y -= paddleLeft.dy;

        }
    }
}
function computerPaddleWin() {
    if (paddleLeft.y > ball.y - (paddleLeft.height / 2)) {
        if (ball.x > paddleLeft.x + paddleLeft.width) {
            paddleLeft.y -= 10 / 1;
            ball.speed += 1 * 0.0001;
        }
        else {
            paddleLeft.y -= 10 / 4;
            ball.speed += 1 * 0.0001;

        }
    }
    if (paddleLeft.y < ball.y - (paddleLeft.height / 2)) {
        if (ball.x > paddleLeft.x + paddleLeft.width) {
            paddleLeft.y += 10 / 1;
            ball.speed += 1 * 0.0001;
        }
        else {
            paddleLeft.y += 10 / 4;
            ball.speed += 1 * 0.0001;
        }
    }
}


// display function for winning or lossing and also to display player name and score 
function displayFunction(text, textX, textY) {
    context.fillStyle = "white";
    context.font = "22px bold";
    context.fillText(text, textX, textY);
}


// function which decide game end
function gameEnd() {
    if (player1Score >= totalGamePoints || player2Score >= totalGamePoints) {

        let rating = parseInt(localStorage.getItem("Rating"));
        let newRatingPl1;
        if (player2Score >= totalGamePoints) {
            // alert('you win');
            newRatingPl1 = rating + 37.5;
            displayFunction(playerName + " won!!!", canvas.width / 2 - 50, canvas.height / 2 + 60);
        }
        if (player1Score >= totalGamePoints) {
            displayFunction(playerSecond + " won!!!", canvas.width / 2 - 50, canvas.height / 2 + 60);
            // alert('you loss');
        }
        gameOver = true;
        displayFunction("Game Over", canvas.width / 2 - 50, canvas.height / 2);
        displayFunction("Play Again !", canvas.width / 2 - 50, canvas.height / 2 + 30);
        localStorage.setItem("LeftScore", player1Score);
        localStorage.setItem("RightScore", player2Score);
        localStorage.setItem("Rating", newRatingPl1);
        writeUserData(player1Score, player2Score, newRatingPl1, playerSecond);
    }

}

//calls when user choose to play in easy mode
function easy() {
    backgroundSound.play();
    backgroundSound.loop = true;
    BACKGROUND.src = "PongHard.jpg";
    let computerStatus = localStorage.getItem("Status");
    let computerName = "";
    if (computerStatus == 'false') {
        computerName = "Computer";
    }
    paddleLeft = new Paddle(canvas.width - 1097, canvas.height / 2 - Height_Of_Paddle / 2, Width_Of_Paddle, Height_Of_Paddle );
    paddleRight = new Paddle(canvas.width - 25, canvas.height / 2, Width_Of_Paddle, Height_Of_Paddle)


    
    function draw() {
        paddleLeft.paddleDraw(COLORS.paddel1Color);
        paddleRight.paddleDraw(COLORS.paddel2Color);
        drawBall();
        displayFunction("Score:" + player1Score, 35, 25);
        displayFunction("Score:" + player2Score, 990, 25);
        displayFunction(playerName, 1000, 50);
        let status = localStorage.getItem("Status");
        if (status == 'true') {
            displayFunction(playerSecond, 35, 50);
        }
        else {
            displayFunction(computerName, 35, 50);
        }
    }
    let temp = !!(Math.floor(Math.random() * 2))
    function update() {
        paddleRightMovement();
        let status = localStorage.getItem("Status");
        if (status == 'true') {
            paddleLeftMovement();
        } else {
            if (temp) {
                computerPaddleLoose();
                // console.log("true computer")
            } else {
                computerPaddleWin();
                // console.log("false computer")
            }
        }
        ballMovement();
        ballCollisionWithWalls();
        ballCollisionWithRightPaddle();
        ballCollisionWithLeftPaddle();
        gameEnd();
    }


    //update positions of game components
    function loop() {
        context.drawImage(BACKGROUND, 0, 0, 1200, 1000);
        if (isStart) {
            draw();
            update();
        }

        if (!gameOver) {
            requestAnimationFrame(loop);
        }
    }
    var counter = 4;
    function print() {
        if (counter > 1) {
            document.getElementById("counter").innerHTML = counter - 1;
        } else {
            document.getElementById("counter").innerHTML = "Go";

        }
        if (counter == 0) {
            isStart = true;
            document.getElementById("counter").style.display = "none";
        }
        counter--;
    }

    var intervalid = setInterval(() => {
        print();
        if (counter < 0) {
            clearInterval(intervalid);
        }
    }, 1000);
    loop();
    requestAnimationFrame(loop);
}

// restart function and set scores to 0
function restart() {
    player1Score = 0;
    player2Score = 0;
    location.reload(true);
}


// medium will call when user choose to play in medium mode 
function medium() {
    backgroundSound.play();
    backgroundSound.loop = true;
    BACKGROUND.src = "medium1.jpg";
    let computerStatus = localStorage.getItem("Status");
    let computerName = "";
    if (computerStatus == 'false') {
        computerName = "Computer";
    }
    paddleLeft = new Paddle(canvas.width - 1097, canvas.height / 2 - Height_Of_Paddle / 2, Width_Of_Paddle, Height_Of_Paddle);
    paddleRight = new Paddle(canvas.width - 25, canvas.height / 2, Width_Of_Paddle, Height_Of_Paddle)
    obs1 = new Obstacle(canvas.width / 2, canvas.height / 2 - 25, 10, 80);

    
    function draw() {
        paddleLeft.paddleDraw(COLORS.paddel1Color);
        paddleRight.paddleDraw(COLORS.paddel2Color);
        drawBall();
        obs1.obstacleDraw(COLORS.stableObstacleColor);
        displayFunction("Score:" + player1Score, 35, 25);
        displayFunction("Score:" + player2Score, 990, 25);
        displayFunction(playerName, 1000, 50);
        let status = localStorage.getItem("Status");
        if (status == 'true') {
            displayFunction(playerSecond, 35, 50);
        }
        else {
            displayFunction(computerName, 35, 50);
        }
    }

    let temp = !!(Math.floor(Math.random() * 2))
    function update() {
        paddleRightMovement();
        let status = localStorage.getItem("Status");
        if (status == 'true') {
            paddleLeftMovement();
        } else {
            if (temp) {
                computerPaddleLoose();
                console.log("true computer")
            } else {
                computerPaddleWin();
                console.log("false computer")

            }
        }
        ballMovement();
        obs1.obstacleCollision();
        ballCollisionWithWalls();
        ballCollisionWithRightPaddle();
        ballCollisionWithLeftPaddle();
        gameEnd();
    }

    function loop() {
        context.drawImage(BACKGROUND, 0, 0, 1200, 1000);
        if (isStart) {
            draw();
            update();
        }

        if (!gameOver) {
            requestAnimationFrame(loop);
        }
    }
    var counter = 4;
    function print() {
        if (counter > 1) {
            document.getElementById("counter").innerHTML = counter - 1;
        } else {
            document.getElementById("counter").innerHTML = "Go";
        }
        if (counter == 0) {
            isStart = true;
            document.getElementById("counter").style.display = "none";
        }
        counter--;
    }
    var intervalid = setInterval(() => {
        print();
        if (counter < 0) {
            clearInterval(intervalid);
        }
    }, 1000);
    loop();
    requestAnimationFrame(loop);
}

/***********************************************************************************************************/
function hard() {
    backgroundSound.play();
    backgroundSound.loop = true;
    BACKGROUND.src = "PongBackground.png";
    let checkObstacleStatus = false;
    let computerStatus = localStorage.getItem("Status");
    let computerName = "";
    if (computerStatus == 'false') {
        computerName = "Computer";
    }
    paddleLeft = new Paddle(canvas.width - 1097, canvas.height / 2 - Height_Of_Paddle / 2, Width_Of_Paddle, Height_Of_Paddle);
    paddleRight = new Paddle(canvas.width - 25, canvas.height / 2, Width_Of_Paddle, Height_Of_Paddle);
    movingObstacle1 = new Obstacle(canvas.width / 2 - 10, 0, 10, 60);
    movingObstacle2 = new Obstacle(canvas.width / 2 + 20, canvas.height - 50, 10, 60);
    
    function draw() {
        paddleLeft.paddleDraw(COLORS.paddel1Color);
        paddleRight.paddleDraw(COLORS.paddel2Color);
        drawBall();
        movingObstacle1.obstacleDraw(COLORS.movingObstacleColor1);
        movingObstacle2.obstacleDraw(COLORS.movingObstacleColor2);
        displayFunction("Score:" + player1Score, 35, 25);
        displayFunction("Score:" + player2Score, 990, 25);
        displayFunction(playerName, 1000, 50);
        let status = localStorage.getItem("Status");

        if (status == 'true') {
            displayFunction(playerSecond, 35, 50);
        }
        else {
            displayFunction(computerName, 35, 50);
        }
    }
    let checkObstacleStatus1 = false;
    let temp = !!(Math.floor(Math.random() * 2))
    function update() {
        paddleRightMovement();
        let status = localStorage.getItem("Status");
        if (status == 'true') {
            paddleLeftMovement();
        } else {
            if (temp) {
                computerPaddleLoose();
                console.log("true computer")
            } else {
                computerPaddleWin();
                console.log("false computer")
            }
        }
        ballMovement();
        if (movingObstacle1.y <= 0) {
            checkObstacleStatus = true;

        }
        else if (movingObstacle1.y >= canvas.height - movingObstacle1.obsHeight) {
            checkObstacleStatus = false;
        }

        if (movingObstacle2.y <= 0) {
            checkObstacleStatus1 = true;
        }
        else if (movingObstacle2.y >= canvas.height - movingObstacle2.obsHeight) {
            checkObstacleStatus1 = false;
        }
        movingObstacle1.obstacleCollision();
        movingObstacle2.obstacleCollision();
        movingObstacle1.movingObstacleMovement(checkObstacleStatus);
        movingObstacle2.movingObstacleMovement(checkObstacleStatus1);
        ballCollisionWithWalls();
        ballCollisionWithRightPaddle();
        ballCollisionWithLeftPaddle();
        gameEnd();
    }

    function loop() {
        context.drawImage(BACKGROUND, 0, 0, 1200, 1000);
        if (isStart) {
            draw();
            update();
        }
        if (!gameOver) {
            requestAnimationFrame(loop);
        }
    }
    var counter = 4;
    function print() {
        if (counter > 1) {
            document.getElementById("counter").innerHTML = counter - 1;
        } else {
            document.getElementById("counter").innerHTML = "Go";
        }
        if (counter == 0) {
            isStart = true;
            document.getElementById("counter").style.display = "none";
        }
        counter--;
    }
    var intervalid = setInterval(() => {
        print();
        if (counter < 0) {
            clearInterval(intervalid);
        }

    }, 1000);
    loop();
    requestAnimationFrame(loop);
}