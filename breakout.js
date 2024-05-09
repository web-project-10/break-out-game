// 웹프로그래밍 10팀

window.onload = pageLoad;

function pageLoad() {
  selectSetting();

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
      console.log(inputId);
      $label.css({
        "background-color": "#71929d",
        color: "white",
      });
    } else {
      console.log(inputId);
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
  $("#code-area").css({ width: "calc(100vw - 300px" });

  /*TODO
    환경 설정 이후,
    난이도 선택창 띄우기 및 사이드 메뉴에 사용자가 선택한 환경 설정 정보 표시하ㄱ기
    - 사용자 이름
    - 테마
    - 공 모양
  */
}
