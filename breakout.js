// 웹프로그래밍 10팀

window.onload = pageLoad;

function pageLoad() {
  selectSetting();

  $("#side-menu").css({ display: "none" });
  $("#user-setting input.setting-select-input").change(selectSetting);
}

/*
$("#side-menu").css({display: "block"}); 하면서
$("#code-area").css({width: "calc(100vw - 250px"}); 설정
*/

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
