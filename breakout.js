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
  let dx = 0.3 * difficulty * direct[Math.floor(Math.random() * 2)];
  let dy = 0.3 * difficulty * direct[Math.floor(Math.random() * 2)];

  let ball = setInterval(function () {
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

      ballShape == BallShape.CIRCLE
        ? context.arc(x, y, circleRadius, 0, 2.0 * Math.PI, true)
        : context.rect(x, y, rectWidth, rectWidth);
      context.fillStyle = "#71929d";
      context.fill();
    }
  }
}

function changeBallShape(shape) {
  ballShape = shape == "circle" ? BallShape.CIRCLE : BallShape.SQUARE;
}

function startGame() {
  $("#dif-setting").css({ display: "none" });
  $("#side-score-box").css({display: "block" });
}
