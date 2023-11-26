function login() {
  // 로그인 폼에서 사용자 입력을 가져옴
  var id = document.getElementById("id");
  var pw = document.getElementById("pw");

  console.log("ID:", id.value);
  console.log("PW:", pw.value);
  // 입력된 자격 증명이 저장된 자격 증명과 일치하는지 확인*무리
  if (id.value === "" || pw.value === "") {
    alert("로그인 할수없습니다.");
  } else {
    location.href = "main.html";
  }
}

function create_id() {
  var id = document.querySelector("#id");
  var pw = document.querySelector("#pw");

  if (id.value == "" || pw.value == "") {
    alert("회원가입을 할 수 없습니다.");
  } else {
    location.href = "index.html";
  }
}
