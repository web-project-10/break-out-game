// 웹프로그래밍 10팀

window.onload = pageLoad;

function pageLoad() {
  selectSetting();
  displayBallSetting();
  selectSetting(SetWhat.DEFAULT_SETTING);
  //환경 설정
  $("#dif-setting").css({ display: "none" }); // 난이도 설정 창
  $("#side-menu").css({ display: "none" }); //사용자 환경 설정시 사이드 메뉴 숨김
  $("#user-setting input.setting-select-input").change(() =>
    selectSetting(SetWhat.DEFAULT_SETTING)
  ); //환경 설정 버튼 선택시 css style 변화
  $("#to-next-btn").on("click", completeSetting); //환경 설정 마무리

  $("#dif-setting input.setting-select-input").change(() =>
    selectSetting(SetWhat.DIFFICULTY)
  ); //난이도 선택시 css style 변화
  $("#start-btn").on("click", startGame); //난이도 선택 마무리, 게임 시작
  $("#start-btn").on("click", playGame);
}

let difficulty; // 난이도 별로 숫자로 관리. normal = 1, hard = 2, extreme = 3

const SetWhat = {
  DEFAULT_SETTING: "defaultSetting",
  DIFFICULTY: "difficulty",
};

function selectSetting(setWhat) {
  if (setWhat == SetWhat.DEFAULT_SETTING) {
    $("#user-setting input.setting-select-input").each(function () {
      const checked = $(this).prop("checked");
      const inputId = $(this).attr("id");
      const $label = $(`label[for=${inputId}]`);

      if (checked) {
        $label.css({
          "background-color": "#71929d",
          color: "white",
        });

        $(this).attr("id") == "square-ball"
          ? changeBallShape("square")
          : changeBallShape("circle");
      } else {
        $label.css({
          "background-color": "#fff",
          color: "#000",
        });
      }
    });
  } else {
    $("#dif-setting input.setting-select-input").each(function () {
      const checked = $(this).prop("checked");
      const inputId = $(this).attr("id");
      const $label = $(`label[for=${inputId}]`);

      if (checked) {
        $label.css({
          "background-color": "#71929d",
          color: "white",
        });

        switch (inputId) {
          case "normal-dif":
            difficulty = 1;
            break;
          case "hard-dif":
            difficulty = 2;
            break;
          case "extreme-dif":
            difficulty = 3;
            break;
        }
        $("#side-dif").text(
          $(":input:radio[name=difficulty-btn]:checked").val()
        );

        console.log("난이도 :", difficulty);
      } else {
        $label.css({
          "background-color": "#fff",
          color: "#000",
        });
      }
    });
  }

  // 테마 변경 시 배경색 조정
  $(function () {
    const themeStyles = {
      Default: {
        backgroundColor: "#233239",
        elements: {
          "#code-line-num": { "background-color": "#1D2A30", color: "#98A1AB" },
          ".side-txt, .side-title, #side-score": { color: "#98A1AB" },
          "#side-setting": { color: "#56AFCE" },
        },
      },
      Butterfly: {
        backgroundColor: "#FFFFFF",
        elements: {
          "#user-setting, #dif-setting": { "background-color": "#233239" },
          "#code-line-num": { "background-color": "#EAF0F8", color: "#434343" },
          ".side-txt, .side-title, #side-score": { color: "#434343" },
          "#side-setting": { color: "#56AFCE" },
        },
      },
      Dracula: {
        backgroundColor: "#282A36",
        elements: {
          "#user-setting, #dif-setting": { "background-color": "#233239" },
          "#code-line-num": { "background-color": "#3A3933", color: "#C7C5D6" },
          ".side-txt, .side-title, #side-score": { color: "#C7C5D6" },
          "#side-setting": { color: "#56AFCE" },
        },
      },
    };

    $("input[name=theme-btn]").change(function () {
      const theme = $(this).val();
      const { backgroundColor, elements } = themeStyles[theme];

      $("#content").css("background-color", backgroundColor);

      for (const selector in elements) {
        $(selector).css(elements[selector]);
      }
    });
  });
}

function completeSetting() {
  $("#user-setting").css({ display: "none" });
  $("#side-menu").css({ display: "block" });
  $("#dif-setting").css({ display: "flex" });
  $("#code-container").css({ width: "calc(100vw - 230.5px)" });
  $("#code-area").css({ width: "calc(100vw - 230px)" });

  $("#side-playername").text($("#player-name").val());
  $("#side-theme").text($(":input:radio[name=theme-btn]:checked").val());
  $("#side-ball").text($(":input:radio[name=ball-shape-btn]:checked").val());

  selectSetting(SetWhat.DIFFICULTY);
}

const BallShape = {
  CIRCLE: "circle",
  SQUARE: "square",
};
let ballShape = BallShape.CIRCLE;
let ball;

function displayBallSetting() {
  const canvas = document.getElementById("game-canvas");

  // // 메모리에 실제 크기 설정 (픽셀 밀도를 고려하여 크기 조정)
  const canvasWidth = canvas.offsetWidth;
  const canvasHeight = canvas.offsetHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const circleRadius = 3;
  const rectWidth = circleRadius * 2;

  let x = Math.floor(Math.random() * (canvasWidth - rectWidth * 2) + rectWidth);
  let y = Math.floor(
    Math.random() * (canvasHeight - rectWidth * 2) + rectWidth
  );

  const direct = [1, -1];
  let dx =
    0.3 * difficulty * speed[stage - 1] * direct[Math.floor(Math.random() * 2)];
  let dy =
    0.3 * difficulty * speed[stage - 1] * direct[Math.floor(Math.random() * 2)];

  ball = setInterval(function () {
    draw();
  }, 1);

  const context = canvas.getContext("2d");

  function draw() {
    drawBall();

    if (x < 0 + circleRadius || x > canvasWidth - circleRadius) {
      dx *= -1;
    }
    if (y < 0 + circleRadius || y > canvasHeight - circleRadius) {
      dy *= -1;
    }

    x += dx;
    y += dy;

    function drawBall() {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.beginPath();

      if (ballShape === BallShape.CIRCLE) {
        context.arc(x, y, circleRadius, 0, 2 * Math.PI, true);
      } else {
        context.rect(
          x - rectWidth / 2,
          y - rectWidth / 2,
          rectWidth,
          rectWidth
        );
      }
      context.fillStyle = "#71929d";
      context.fill();
    }
  }
}

function changeBallShape(shape) {
  ballShape = shape == "circle" ? BallShape.CIRCLE : BallShape.SQUARE;
}

let stage = 1;
let speed = [2, 3, 4]; // stage 별로 공 속도 증가 관리. stage1 = 2배, stage2 = 3배, stage3 = 4배
let score = 0;
let lives = 3;
let gameInterval;
let transitionTimeout;
const scoreStandard = {
  1: [300, 600, 1000],
  2: [500, 1000, 1500],
  3: [1000, 2000, 3000],
};

function startGame() {
  $("#dif-setting").css({ display: "none" });
  $("#side-score-box").css({ display: "block" });
  clearInterval(ball);
}

//실제 게임 화면 구성
function playGame() {
  //공 위치가 캔버스 중앙으로 초기화 되고, 블록이 나타나고, 패들이 나타나고, 목숨이 나타나고, 스테이지가 보임.
  //공이 움직이면서 벽돌을 깸
  //일정 점수 이상 되면, 스테이지가 넘어간 것을 show() 해주고, 공 위치가 초기화됨.
  //스테이지 3까지 깨면, 난이도를 클리어한 것을 show() 해주고, 다음 난이도로 넘어감.

  const canvas = document.getElementById("game-canvas");
  const context = canvas.getContext("2d");

  const canvasWidth = canvas.offsetWidth;
  const canvasHeight = canvas.offsetHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const circleRadius = 3;
  const rectWidth = circleRadius * 2;

  let x = canvasWidth;
  let y = canvasHeight;

  const direct = [1, -1];
  let dx =
    0.3 * difficulty * speed[stage - 1] * direct[Math.floor(Math.random() * 2)];
  let dy = 0.3 * difficulty * speed[stage - 1] * direct[1];

  var brick = [];
  var brickColumn = 4;
  var brickRow = 10;
  var brickWidth = 100;
  var brickHeight = 50;
  var brickPadding = 30;

  for (var c = 0; c < brickColumn; c++) {
    brick[c] = [];
    for (var r = 0; r < brickRow; r++) {
      brick[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  var paddleWidth = 100;
  var paddleHeight = 10;
  var paddleX = (canvasWidth - paddleWidth) / 2;
  var paddleY = canvasHeight - paddleHeight - 10;

  function gameDraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawBrick();
    collisionCheck();
    drawPaddle();
    drawLives();
    updateStage();

    if (x < circleRadius || x > canvasWidth - circleRadius) {
      dx *= -1;
    }
    if (y < circleRadius) {
      dy *= -1;
    } else if (y > canvasHeight - paddleHeight - circleRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy *= -1;
      } else {
        //TODO 목숨 하나 잃었다는 알림 띄우고 다시 공 출발할 떄까지 2~3초 텀 두기
        lives--;
        if (!lives) {
          alert("GAME OVER"); //TODO Game Over도 alert가 아니라, 게임 자체 창으로 띄우기
          document.location.reload();
        } else {
          resetBall();
        }
      }
    }

    x += dx;
    y += dy;
  }

  gameInterval = setInterval(gameDraw, 10);

  function drawBall() {
    context.beginPath();
    ballShape == BallShape.CIRCLE
      ? context.arc(x, y, circleRadius, 0, 2.0 * Math.PI, true)
      : context.rect(x, y, rectWidth, rectWidth);
    context.fillStyle = "#71929d"; // 공 색깔 바꾸는 코드 이용해서 바꾸기
    context.fill();
    context.closePath();
  }

  function resetBall() {
    x = paddleX + paddleWidth / 2;
    y = canvasHeight - paddleHeight - 10 - circleRadius;
    dx =
      0.3 *
      difficulty *
      speed[stage - 1] *
      direct[Math.floor(Math.random() * 2)];
    dy = 0.3 * difficulty * speed[stage - 1] * direct[1];
  }

  function drawBrick() {
    for (var c = 0; c < brickColumn; c++) {
      for (var r = 0; r < brickRow; r++) {
        var brickOffsetLeft =
          (canvasWidth -
            brickWidth * brickRow -
            brickPadding * (brickRow - 1)) /
          2;
        var brickOffsetTop = 50;

        if (brick[c][r].status == 1) {
          var brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
          var brickY = c * (brickHeight + brickPadding) + brickOffsetTop;

          brick[c][r].x = brickX;
          brick[c][r].y = brickY;

          context.beginPath();
          context.rect(brickX, brickY, brickWidth, brickHeight);
          context.fillStyle = "#56AFCE"; // 색상을 어떻게 할지 고민입니다.
          context.fill();
          
          context.closePath();
        }
      }
    }
  }

  function collisionCheck() {
    for (var c = 0; c < brickColumn; c++) {
      for (var r = 0; r < brickRow; r++) {
        var b = brick[c][r];
        if (b.status == 1) {
          if (
            x > b.x &&
            x < b.x + brickWidth &&
            y > b.y &&
            y < b.y + brickHeight
          ) {
            var overLeft = Math.abs(x - (b.x + brickWidth));
            var overTop = Math.abs(y - (b.y + brickHeight));
            var overRight = Math.abs(x + dx - b.x);
            var overBottom = Math.abs(y + dy - b.y);

            if (Math.min(overLeft, overRight) < Math.min(overTop, overBottom)) {
              dx *= -1;
            } else {
              dy *= -1;
            }

            b.status = 0;
            score += 100;
            document.getElementById("side-score").innerHTML = score;

            checkStage();
          }
        }
      }
    }
  }

  function checkStage() {
    const currentStageScore = scoreStandard[difficulty][stage - 1];
    if (score >= currentStageScore) {
      score = 0;
      if (stage < 3) {
        stage++;
        stageTransition("Go To Next Stage!");
      } else {
        if (difficulty < 3) {
          difficulty++;
          stage = 1;
          stageTransition("You Win!! Go To Next Level!!");
        } else {
          stageTransition("Congratulation!!! You Win This Game!!!", true);
        }
      }
    }
  }

  function stageTransition(message, resetGame = false) {
    clearInterval(gameInterval);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "24px Arial"; // 글씨체 수정
    context.fillStyle = "#56AFCE"; // 글씨색깔 수정
    context.textAlign = "center";
    context.fillText(message, canvasWidth / 2, canvasHeight / 2);
    setTimeout(() => {
      if (resetGame) {
        window.location.reload();
      } else {
        resetBall();
        document.getElementById("side-score").innerHTML = score;
        if (difficulty == 2) {
          document.getElementById("side-dif").innerHTML = "Hard";
        } else if (difficulty == 3) {
          document.getElementById("side-dif").innerHTML = "Extreme";
        }
        gameInterval = setInterval(gameDraw, 10);
      }
    }, 3000);
  }

  document.addEventListener("mousemove", mouseMoveHandler, false);
  function mouseMoveHandler(e) {
    var relativeX = e.clientX - 290.5;
    if (relativeX > 0 && relativeX < canvasWidth) {
      paddleX = relativeX - paddleWidth / 2;
    }
  }
  function drawPaddle() {
    context.beginPath();
    context.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    context.fillStyle = "#56AFCE"; // 패드 색깔 바꾸는 코드 이용해서 바꾸기
    context.fill();
    context.closePath();
  }

  function drawLives() {
    context.font = "24px Source Code Pro"; // 글씨체 수정
    context.fillStyle = "#56AFCE"; // 글씨색깔 수정
    context.textAlign = "right";
    context.fillText("Lives: " + lives, canvas.width - 50, 30);
  }

  function updateStage() {
    context.font = "24px Source Code Pro"; // 글씨체 수정
    context.fillStyle = "#56AFCE"; // 글씨색깔 수정
    context.textAlign = "left";
    context.fillText("Stage: " + stage, 40, 30);
  }
}

//목숨, 스테이지, 다음 스테이지 안내문. 글씨체 및 색깔 고민
