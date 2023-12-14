let canvas = document.getElementById('game');
let context = canvas.getContext('2d');


let Ball = {
    x: 300,
    y: 670,
    dx: 5,
    dy: 8,
    radius: 7
}

let Catching = {
    width: 160,
    height: 15,
    x: 240,
    y: canvas.height - 20,
    radius: [5],
    speed: 8,
    flagMoveLeft: false,
    flagMoveRight: false
}

let Brick = {
    offsetX: 15,
    offsetY: 15,
    margin: 15,
    width: 50,
    height: 15,
    radius: [5],
    totalRow: 7,
    totalCol: 9
}

let arrBricks = [];

let isGAME_OVER = false;
let isGAME_WIN = false;
let isUSER_SCORE = 0;
let isMAX_SCORE = Brick.totalRow * Brick.totalCol;

for (let i = 0; i < Brick.totalRow; i++) {
    for (let j = 0; j < Brick.totalCol; j++) {
        arrBricks.push({
            x: Brick.offsetX + j * (Brick.width + Brick.margin),
            y: Brick.offsetY + i * (Brick.height + Brick.margin),
            isBrocken: false,
        })
    }
}


// bắt sự kiện phím trái phải
document.addEventListener('keyup', function (event) {
    if (event.keyCode === 37) {
        Catching.flagMoveLeft = false;
    } else if (event.keyCode === 39) {
        Catching.flagMoveRight = false;
    }
})

document.addEventListener('keydown', function (event) {
    if (event.keyCode === 37) {
        Catching.flagMoveLeft = true;
    } else if (event.keyCode === 39) {
        Catching.flagMoveRight = true;
    }
})

function drawBall() {
    context.beginPath()
    context.arc(Ball.x, Ball.y, Ball.radius, 0, Math.PI * 2)
    context.fillStyle = 'black'
    context.fill();
    context.strokeStyle = 'black'
    context.stroke();
    context.closePath()
}

function updateBallPosition() {
    Ball.x += Ball.dx;
    Ball.y += Ball.dy;
}

function drawBricks() {
    arrBricks.forEach(function (b) {
        if (!b.isBrocken) {
            context.beginPath();
            context.roundRect(b.x, b.y, Brick.width, Brick.height, Brick.radius);
            context.fillStyle = 'red';
            context.fill();
            context.closePath();
        }
    })
}

function drawCatching() {
    context.beginPath();
    context.roundRect(Catching.x, Catching.y, Catching.width, Catching.height, Catching.radius);
    context.fillStyle = 'blue';
    context.fill();
    context.closePath();

}

function checkCatchingOutCanvas() {
    if (Catching.flagMoveLeft) {
        Catching.x -= Catching.speed;
    } else if (Catching.flagMoveRight) {
        Catching.x += Catching.speed;
    }

    if (Catching.x < 0) {
        Catching.x = 0;
    } else if (Catching.x > canvas.width - Catching.width) {
        Catching.x = canvas.width - Catching.width;
    }
}

function handleBallCollideBounds() {
    if (Ball.x < Ball.radius || Ball.x > canvas.width - Ball.radius) {
        Ball.dx = -Ball.dx;
    }
    if (Ball.y < Ball.radius) {
        Ball.dy = -Ball.dy;
    }
}

function handleBallCollideCatching() {
    if (Ball.x + Ball.radius >= Catching.x &&
        Ball.x + Ball.radius <= Catching.x + Catching.width &&
        Ball.y + Ball.radius >= canvas.height - Catching.height) {
        Ball.dy = -Ball.dy;
    }
}

function handleBallCollideBrick() {
    arrBricks.forEach(function (b) {
        if (!b.isBrocken) {
            if (Ball.x >= b.x &&
                Ball.x <= b.x + Brick.width &&
                Ball.y + Ball.radius >= b.y &&
                Ball.y - Ball.radius <= b.y + Brick.height) {
                Ball.dy = -Ball.dy;
                b.isBrocken = true;
                isUSER_SCORE += 1;
                document.getElementById('userScore').innerHTML = isUSER_SCORE;
                if (isUSER_SCORE >= isMAX_SCORE) {
                    isGAME_OVER = true;
                    isGAME_WIN = true;
                }
            }
        }
    })
}

function checkGAMEOVER() {
    if (Ball.y > canvas.height - Ball.radius) {
        isGAME_OVER = true;
    }
}



function handleGAMEOVER() {
    if (isGAME_WIN) {
        let arr = getLocal();
        arr.push({
                noPlayer: arr.length + 1,
                namePlayer: `${document.getElementById('namePlayer').value}`,
                pointPlayer: isUSER_SCORE,
                statusWinLose: 'WIN'
            }
        )
        setLocal(arr)
        document.getElementById('notiGAMEOVER').innerText = 'BẠN ĐÃ CHIẾN THẮNG !!';
    } else {
        let arr = getLocal();
        arr.push({
                noPlayer: arr.length + 1,
                namePlayer: `${document.getElementById('namePlayer').value}`,
                pointPlayer: isUSER_SCORE,
                statusWinLose: 'LOSE'
            }
        )
        setLocal(arr)
        document.getElementById('notiGAMEOVER').innerText = 'BẠN ĐÃ THUA CUỘC...';
    }
}

const HISTORY_GAME = 'HISTORY_GAME';

// localStorage.setItem(HISTORY_GAME, JSON.stringify([]));

function getLocal() {
    return JSON.parse(localStorage.getItem(HISTORY_GAME));
}

function setLocal(arr) {
    localStorage.setItem(HISTORY_GAME, JSON.stringify(arr));
}

function saveWINLOSE() {
    let history = JSON.parse(localStorage.getItem(HISTORY_GAME));
    let str = '';
    for (let i = 0; i < history.length; i++) {
        str += `
            <tr style="text-align: center">
                <td>${[i+1]}</td>
                <td>${history[i].namePlayer}</td>
                <td>${history[i].pointPlayer}</td>
                <td>${history[i].statusWinLose}</td>
            </tr>
        `
    }
    document.getElementById('historyGameInTable').innerHTML = str;
}

function drawMain() {
    if (!isGAME_OVER) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        drawBall();

        drawBricks();

        drawCatching();

        handleBallCollideBounds();

        updateBallPosition();

        checkCatchingOutCanvas();

        handleBallCollideCatching();

        handleBallCollideBrick()

        checkGAMEOVER();

        requestAnimationFrame(drawMain);
    } else {
        handleGAMEOVER();
    }
}

drawBall();
drawBricks();
drawCatching();
saveWINLOSE();

function buttonSTART() {
    let a = document.getElementById('namePlayer').value;
    if (a === '') {
        alert(`Chưa nhập tên !!`)
        return;
    }
    document.getElementById('popupInputName').hidden = true;
    document.getElementById('background').hidden = true;
    drawMain();
}

function buttonRESET() {
    location.reload();
}






