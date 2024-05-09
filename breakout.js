// 웹프로그래밍 10팀

window.onload = pageLoad;

function pageLoad() {
  selectSetting();
  displayBallSetting();

  //환경 설정
  $("#side-menu").css({ display: "none" }); //사용자 환경 설정시 사이드 메뉴 숨김
  $("#user-setting input.setting-select-input").change(selectSetting); //환경 설정 버튼 선택시 css style 변화
  $("#to-next-btn").on("click", completeSetting); //환경 설정 마무리
}

function selectSetting() {
  $("#user-setting input.setting-select-input").each(function () {
    const checked = $(this).prop("checked");
    const inputId = $(this).attr("id");
    const $label = $(`label[for=${inputId}]`);

    if (checked) {
      $label.css({
        "background-color": "#71929d",
        color: "white",
      });
    } else {
      $label.css({
        "background-color": "#fff",
        color: "#000",
      });
    }
  });
}

function completeSetting() {
  $("#user-setting").css({ display: "none" });
  $("#side-menu").css({ display: "block" });
  $("#code-container").css({ width: "calc(100vw - 300.5px)" });
  $("#code-area").css({ width: "calc(100vw - 300px)" });

  /*TODO
    환경 설정 이후,
    난이도 선택창 띄우기 및 사이드 메뉴에 사용자가 선택한 환경 설정 정보 표시하ㄱ기
    - 사용자 이름
    - 테마
    - 공 모양
  */
}

function displayBallSetting() {
  const canvas = document.getElementById("game-canvas");

  // // 메모리에 실제 크기 설정 (픽셀 밀도를 고려하여 크기 조정)
  const canvasWidth = canvas.offsetWidth;
  const canvasHeight = canvas.offsetHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const context = canvas.getContext("2d");

  const ballRadius = 3;
  let x = Math.floor(
    Math.random() * (canvasWidth - ballRadius * 2) + ballRadius
  );
  let y = Math.floor(
    Math.random() * (canvasHeight - ballRadius * 2) + ballRadius
  );
  const direct = [1, -1];
  let dx = 0.3 * direct[Math.floor(Math.random() * 2)];
  let dy = 0.3 * direct[Math.floor(Math.random() * 2)];
  const ball = setInterval(draw, 1);

  function draw() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    drawBall();

    if (x < 0 + ballRadius || x > canvasWidth - ballRadius) {
      dx *= -1;
    }
    if (y < 0 + ballRadius || y > canvasHeight - ballRadius) {
      dy *= -1;
    }

    x += dx;
    y += dy;
  }

  function drawBall() {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, 2.0 * Math.PI, true);
    context.fillStyle = "#71929d";
    context.fill();
  }
}
