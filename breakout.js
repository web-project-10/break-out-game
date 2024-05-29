// 웹프로그래밍 10팀

window.onload = pageLoad;

let gameColor = "#71929d";
let textColor = "#98A1AB";
let brickTextColor = "#39474e";

function pageLoad() {
  selectSetting();
  displayBallSetting();
  selectSetting(SetWhat.DEFAULT_SETTING);
  //환경 설정
  $("#dif-setting").css({ display: "none" }); // 난이도 설정 창
  $("#side-menu").css({ display: "none" }); //사용자 환경 설정시 사이드 메뉴 숨김
  $("#count").css({ display: "none" }); //사용자 환경 설정시 stage, lives 숨김
  $("#user-setting input.setting-select-input").change(() =>
    selectSetting(SetWhat.DEFAULT_SETTING)
  ); //환경 설정 버튼 선택시 css style 변화
  $("#to-next-btn").on("click", completeSetting); //환경 설정 마무리

  $("#dif-setting input.setting-select-input").change(() =>
    selectSetting(SetWhat.DIFFICULTY)
  ); //난이도 선택시 css style 변화
  $("#start-btn").on("click", startGame); //난이도 선택 마무리, 게임 시작
  $("#start-btn").on("click", playGame);

  $("input[name=theme-btn]").change(function () {
    const theme = $(this).val();
    if (theme == "Default") {
      gameColor = "#71929d";
      textColor = "#98A1AB";
      brickTextColor = "#39474e";
    } else if (theme == "Butterfly") {
      gameColor = "#434343";
      textColor = "#434343";
      brickTextColor = "#EAF0F8";
    } else if (theme == "Dracula") {
      gameColor = "#C7C5D6";
      textColor = "#C7C5D6";
      brickTextColor = "#3A3933";
    }
  });
}

let difficulty; // 난이도 별로 숫자로 관리. normal = 1, hard = 2, extreme = 3
const difficultySpeed = {
  1: 0.5,
  2: 1.3,
  3: 2,
};

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
          "#code-line-num, #user-setting, #dif-setting, footer": {
            "background-color": "#1D2A30",
            color: "#98A1AB",
          },
          ".side-txt, .side-title, #side-score, .player-name-title, .setting-title":
            { color: "#98A1AB" },
          "#side-setting": { color: "#56AFCE" },
        },
        src1: "./assets/folder1_default.png",
        src2: "./assets/folder2_default.png",
      },
      Butterfly: {
        backgroundColor: "#FFFFFF",
        elements: {
          "#code-line-num, #user-setting, #dif-setting, footer": {
            "background-color": "#EAF0F8",
            color: "#434343",
          },
          ".side-txt, .side-title, #side-score, .player-name-title, .setting-title":
            { color: "#434343" },
          "#side-setting": { color: "#56AFCE" },
        },
        src1: "./assets/folder1_butterfly.png",
        src2: "./assets/folder2_butterfly.png",
      },
      Dracula: {
        backgroundColor: "#282A36",
        elements: {
          "#code-line-num, #user-setting, #dif-setting, footer": {
            "background-color": "#3A3933",
            color: "#C7C5D6",
          },
          ".side-txt, .side-title, #side-score, .player-name-title, .setting-title":
            { color: "#C7C5D6" },
          "#side-setting": { color: "#56AFCE" },
        },
        src1: "./assets/folder1_dracula.png",
        src2: "./assets/folder2_dracula.png",
      },
    };

    $("input[name=theme-btn]").change(function () {
      const theme = $(this).val();
      const { backgroundColor, elements, src1, src2 } = themeStyles[theme];

      $("#content").css("background-color", backgroundColor);
      $(".folder1").attr("src", src1);
      $(".folder2").attr("src", src2);
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
    0.3 *
    difficultySpeed[difficulty] *
    1 *
    direct[Math.floor(Math.random() * 2)];
  let dy =
    0.3 *
    difficultySpeed[difficulty] *
    1 *
    direct[Math.floor(Math.random() * 2)];

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
let speed = [4, 6, 9]; // stage 별로 공 속도 증가 관리. stage1 = 2배, stage2 = 3배, stage3 = 4배
let score = 0;
let lives = 4;
let gameInterval;
let transitionTimeout;
const scoreStandard = {
  1: [300, 600, 1000],
  2: [1000, 2500, 7000],
  3: [1000, 2000, 3000],
};

function startGame() {
  $("#dif-setting").css({ display: "none" });
  $("#side-score-box").css({ display: "block" });
  $("#count").css({ display: "flex" });
  $("#game-canvas").css({ height: "calc(100% - 50px)" });
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
    10 * difficulty * speed[stage - 1] * direct[Math.floor(Math.random() * 2)];
  let dy = 10 * difficulty * speed[stage - 1] * direct[1];

  var brick = [];
  var brickColumn = 6;
  var brickRow = 8;
  var brickWidth = canvas.width / 12;
  var brickHeight = brickWidth / 2.5;
  var brickPadding = (brickWidth * 2) / 10;
  var ballColor = gameColor; /////// 공 기본 색
  var paddleColor = gameColor; /////// 패들 기본 색
  var brickOffsetLeft =
    (canvasWidth - brickWidth * brickRow - brickPadding * (brickRow - 1)) / 2;
  var brickOffsetTop = 50;

  function resetBrick(state) {
    console.log(
      "difficulty: ",
      difficulty,
      ", stage: ",
      stage,
      " brick reset state: ",
      state
    );
    for (var c = 0; c < brickColumn; c++) {
      brick[c] = [];
      for (var r = 0; r < brickRow; r++) {
        const code = Math.random() < 0.5 ? GetRandomCode() : null;

        brick[c][r] = {
          x: r * (brickWidth + brickPadding) + brickOffsetLeft,
          y: c * (brickHeight + brickPadding) + brickOffsetTop,
          status: state,
          code: code,
        };
      }
    }
  }

  resetBrick(difficulty);
  var paddleWidth = 100;
  var paddleHeight = 10;
  var paddleX = (canvasWidth - paddleWidth) / 2;
  var paddleY = canvasHeight - paddleHeight - 10;
  var rndcnt = 500;
  var brickXDirect = direct[Math.floor(Math.random() * 2)];
  var brickYDirect = direct[Math.floor(Math.random() * 2)];

  function GetRandomCode() {
    const codes = [
      //여기에 코드 추가하시면 됩니다. // 테스트용으로 여러개 넣어봤음.
      "randomBallColor();",
      "randomPaddleColor();",
      // "break5Blocks();",
      // "add5Blocks();",
      // "toNextStage();",
      // "crashThisLine();"
    ];
    return codes[Math.floor(Math.random() * codes.length)]; //여기서 length값 조절해서 모드에 따라 나올 함수 조절 가능.
  }

  const colors = [
    "red",
    "blue",
    "pink",
    "green",
    "purple",
    "lightgray",
    "aqua",
    "aquamarines",
    "salmon",
    "skyblue",
    "darkcyan",
    "orange",
    "yellow",
    "peachpuff",
    "slategray",
    "darkolivegreen",
  ];
  function randomBallColor() {
    newColor = colors[Math.floor(Math.random() * colors.length)];
    while (ballColor == newColor) {
      newColor = colors[Math.floor(Math.random() * colors.length)];
    }
    ballColor = newColor;
  }
  function randomPaddleColor() {
    newPaddleColor = colors[Math.floor(Math.random() * colors.length)];
    while (paddleColor == newPaddleColor) {
      newPaddleColor = colors[Math.floor(Math.random() * colors.length)];
    }
    paddleColor = newPaddleColor;
  }
  function crashThisLine() {}

  function gameDraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawBrick();
    collisionCheck();
    drawPaddle();
    updateLives();
    updateStage();
    rndcnt++;

    if (x < circleRadius || x > canvasWidth - circleRadius) {
      dx *= -1;
    }
    if (y < circleRadius) {
      dy *= -1;
    } else if (y > canvasHeight - 20 - circleRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        // 패들 중심으로부터의 거리 계산
        let paddleCenter = paddleX + paddleWidth / 2;
        let hitPosition = x - paddleCenter;

        // 너무 낮은 각도로 되면 안되니 45도 제한
        let maxAngle = Math.PI / 4;
        let angle = (hitPosition / (paddleWidth / 2)) * maxAngle;

        // 각도에 따른 공의 속도 설정
        let speed = Math.sqrt(dx * dx + dy * dy);
        dx = speed * Math.sin(angle);
        dy = -speed * Math.cos(angle);
      } else {
        lives--;
        if (!lives) {
          stageTransition("Game Over!!", true);
        } else {
          if (lives == 3) {
            if (difficulty == 2) resetBrick(2);
            if (difficulty == 3) resetBrick(0);
            stageTransition("Game Start!!", false);
          } else {
            stageTransition("Try Again!!", false);
          }
        }
        updateLives();
        updateStage();
      }
    }

    if (difficulty == 3) {
      if (rndcnt > 600 - 100 * stage) {
        //블록 생성 주기 변경
        rndcnt = 0;
        var newMoveBrick_c = Math.floor(Math.random() * brickColumn);
        var newMoveBrick_r = Math.floor(Math.random() * brickRow);
        while (brick[newMoveBrick_c][newMoveBrick_r].status == 3) {
          newMoveBrick_c = Math.floor(Math.random() * brickColumn);
          newMoveBrick_r = Math.floor(Math.random() * brickRow);
        }
        const code = Math.random() < 0.5 ? GetRandomCode() : null;
        brick[newMoveBrick_c][newMoveBrick_r] = {
          x: newMoveBrick_r * (brickWidth + brickPadding) + brickOffsetLeft,
          y: brickOffsetTop,
          status: 3,
          code: code,
        };
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
    context.fillStyle = ballColor; // 공 색깔 바꾸는 코드 이용해서 바꾸기
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
        // console.log(brick[c][r].status);
        if (brick[c][r].status == 1) {
          var brickX = brick[c][r].x;
          var brickY = brick[c][r].y;

          context.beginPath();
          context.rect(brickX, brickY, brickWidth, brickHeight);
          context.fillStyle = gameColor; // 블록 색깔 바꾸는 코드 이용해서 바꾸기
          context.fill();
          context.closePath();
        }

        if (difficulty == 2) {
          var mostLeftRow = getMostLeftRow();
          var mostRightRow = getMostRightRow();

          // 블록 좌우 이동 방향 설정
          if (brick[c][mostLeftRow].x <= 0) brickXDirect = 1;
          if (brick[c][mostRightRow].x + brickWidth >= canvas.width) {
            brickXDirect = -1;
          }
          // 모든 좌우 블록 이동
          brick[c][r].x += 0.2 * brickXDirect * stage;

          if (stage == 3) {
            //상하로도 이동
            var mostTopRow = getMostTopRow();
            var mostBottomRow = getMostBottomRow();
            // 블록 상하 이동 방향 설정
            if (brick[mostTopRow][r].y <= 0) brickYDirect = 1;
            if (
              brick[mostBottomRow][r].y + brickHeight >=
              canvas.height - 350
            ) {
              brickYDirect = -1;
            }
            brick[c][r].y += 0.2 * brickYDirect * stage;
          }

          if (brick[c][r].status == 2) {
            var brickX = brick[c][r].x;
            var brickY = brick[c][r].y;

            context.beginPath();
            context.rect(brickX, brickY, brickWidth, brickHeight);
            context.fillStyle = gameColor; // 블록 색깔 바꾸는 코드 이용해서 바꾸기
            context.fill();
            context.closePath();
          }
        }

        if (difficulty == 3 && brick[c][r].status == 3) {
          brick[c][r].y += 0.2 * stage; //공 떨어지는 속도 조절
          var brickX = brick[c][r].x;
          var brickY = brick[c][r].y;

          context.beginPath();
          context.rect(brickX, brickY, brickWidth, brickHeight);
          context.fillStyle = gameColor; // 블록 색깔 바꾸는 코드 이용해서 바꾸기
          context.fill();
          context.closePath();
        }

        if (brick[c][r].status != 0 && brick[c][r].code) {
          context.font = "12px 'Source Code Pro'";
          context.fillStyle = brickTextColor; // 색깔

          // 한 줄에 출력할 최대 글자 수 설정
          let maxChar = 10;
          let text = brick[c][r].code;
          let lines = [];

          // 텍스트가 너무 길어서 나누기
          for (let i = 0; i < text.length; i += maxChar) {
            lines.push(text.substring(i, i + maxChar));
          }

          // 텍스트의 Y 시작 위치 계산 (벽돌의 중앙에서 약간 위로)
          let textY = brickY + (brickHeight - lines.length * 12) / 2 + 10; // 12는 폰트 크기, 10은 좀 더 보기 좋게

          for (let i = 0; i < lines.length; i++) {
            let textWidth = context.measureText(lines[i]).width;
            let textX = brickX + (brickWidth - textWidth) / 2;
            context.fillText(lines[i], textX, textY);
            textY += 12; // 폰트 크기만큼 Y 위치 증가
          }
        }
      }
    }

    function getMostRightRow() {
      for (var mostRightRow = brickRow - 1; mostRightRow >= 0; mostRightRow--) {
        for (var c = 0; c < brickColumn; c++) {
          console.log(brick[c][mostRightRow].status);
          if (brick[c][mostRightRow].status != 0) {
            return mostRightRow;
          }
        }
      }
    }
    function getMostLeftRow() {
      for (var mostLeftRow = 0; mostLeftRow < brickRow; mostLeftRow++) {
        for (var c = 0; c < brickColumn; c++) {
          console.log(brick[c][mostLeftRow].status);
          if (brick[c][mostLeftRow].status != 0) {
            return mostLeftRow;
          }
        }
      }
    }
    function getMostTopRow() {
      for (var r = 0; r < brickRow; r++) {
        for (var mostTopRow = 0; mostTopRow < brickColumn; mostTopRow++) {
          if (brick[mostTopRow][r].status != 0) {
            return mostTopRow;
          }
        }
      }
    }
    function getMostBottomRow() {
      for (var r = 0; r < brickRow; r++) {
        for (
          var mostBottomRow = brickColumn - 1;
          mostBottomRow >= 0;
          mostBottomRow--
        ) {
          if (brick[mostBottomRow][r].status != 0) {
            return mostBottomRow;
          }
        }
      }
    }
  }

  function collisionCheck() {
    for (var c = 0; c < brickColumn; c++) {
      for (var r = 0; r < brickRow; r++) {
        var b = brick[c][r];
        if (b.status != 0) {
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
            if (b.code) {
              //코드 실행
              eval(b.code);
            }

            b.status = 0;
            score += b.code ? 200 : 100;
            document.getElementById("side-score").innerHTML = score;

            checkStage();
          }
          if (b.y > canvasHeight) {
            b.status = 0;
            lives--;
            if (!lives) {
              stageTransition("Game Over!!", true);
            } else {
              if (lives == 3) {
                if (difficulty == 2) resetBrick(2);
                if (difficulty == 3) resetBrick(0);
                stageTransition("Game Start!!", false);
              } else {
                stageTransition("Try Again!!", false);
              }
            }
            updateLives();
            updateStage();
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
        if (difficulty == 2) {
          resetBrick(2);
        } else if (difficulty == 3) {
          resetBrick(0);
        } else {
          resetBrick(1);
        }
      } else {
        if (difficulty < 3) {
          difficulty++;
          stage = 1;
          lives = 3;
          stageTransition("You Win!! Go To Next Level!!");
        } else {
          stageTransition("Congratulation!!! You Win This Game!!!", true);
        }
      }
    }
  }

  function stageTransition(message, resetGame = false) {
    clearInterval(gameInterval);

    const canvas = $("#game-canvas");
    canvas.hide();

    const div = $("<div></div>")
      .css({
        width: "calc(100% - 60.5px)",
        height: "calc(100% - 50px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        font: "24px 'Source Code Pro'",
        color: textColor,
        textAlign: "center",
      })
      .text(message);

    $("#game-area").append(div);

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
        div.remove();
        canvas.show();
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
    context.fillStyle = paddleColor; // 패드 색깔 바꾸는 코드 이용해서 바꾸기
    context.fill();
    context.closePath();
  }

  function updateLives() {
    $("#lives").css({ color: textColor });
    $("#lives-count").text(lives);
  }

  function updateStage() {
    $("#stage").css({ color: textColor });
    $("#stage-count").text(stage);
  }
}
