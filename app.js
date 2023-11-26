const canvas = document.getElementById("jsCanvas"); // 전채 캔버스
const ctx = canvas.getContext("2d"); // 캔버스
const colors = document.getElementsByClassName("jsColor"); // 색깔
const range = document.getElementById("jsRange"); // 팬 굵기 조절
const mode = document.getElementById("jsMode"); // 배경 채우기
const saveBtn = document.getElementById("jsSave"); // 저장
const remove = document.getElementById("jsRemove"); // 전체 지우기
const eraseBtn = document.getElementById("jsErase"); // 지우개
const INITIAL_COLOR = "#000000"; // 그림판 색깔
const CANVAS_SIZE = 700; // 그림판 크기
const fileInput = document.getElementById("jsFileInput");
const undoBtn = document.getElementById("jsUndo");
const undoStack = [];

ctx.strokeStyle = "#2c2c2c"; // 윤곽선 색깔

canvas.width = CANVAS_SIZE; // 그림판 크기를 CANVAS_SIZE로
canvas.height = CANVAS_SIZE;

ctx.fillStyle = "white"; // 그림판 배경색
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); // 크기만큼

ctx.strokeStyle = INITIAL_COLOR; // 선 색깔
ctx.fillStyle = INITIAL_COLOR; // fill 기능 색깔
ctx.lineWidth = 5; // 기본 선 굵기

let painting = false; // 그리기 기본값
let filling = false; // 채우기 기본값
let erasing = false; // 자우기 기본값

function saveCanvasState() {
  // undo 기능을 위한 stack 쌓기
  undoStack.push(canvas.toDataURL());
}

function restoreCanvasState() {
  if (undoStack.length > 0) {
    // 스택이 0 이상일때
    const previousState = undoStack.pop(); // 제일 최근 스택 지우기
    const img = new Image();
    img.src = previousState;

    img.onload = function () {
      // 이전상태로 다시 돌리기
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }
}

function handleUndoClick() {
  restoreCanvasState();
}

if (undoBtn) {
  undoBtn.addEventListener("click", handleUndoClick);
}
//여기부터 추가
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", function () {
  stopPainting();
  saveCanvasState();
});
canvas.addEventListener("mouseleave", stopPainting);
canvas.addEventListener("click", handleCanvasClick);

// 그림을 그릴 때마다 상태 저장
canvas.addEventListener("mouseup", saveCanvasState);
//여기까지 추가

function stopPainting() {
  // 마우스를 땔때
  painting = false;
}

function startPainting() {
  // 마우스 누를때
  painting = true;
}

function onMouseMove(event) {
  // 그리는 기능
  const x = event.offsetX;
  const y = event.offsetY;

  if (erasing && painting) {
    erase(x, y);
  } else {
    if (!painting) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }
}
function handleColorClick(event) {
  // 색깔을 눌렀을때
  const color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

Array.from(colors).forEach((color) =>
  color.addEventListener("click", handleColorClick)
);

function handleRangeChange(event) {
  // 펜 굵기 기능
  const size = event.target.value;
  ctx.lineWidth = size;
}
if (range) {
  range.addEventListener("input", handleRangeChange);
}

function handleModeClick() {
  if (filling === true) {
    filling = false;
    mode.innerText = "Fill";
  } else {
    filling = true;
    mode.innerText = "Paint";
  }
}
if (mode) {
  mode.addEventListener("click", handleModeClick);
}

function handleCanvasClick() {
  if (filling) {
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }
}

function handleEraseClick() {
  if (erasing === true) {
    erasing = false;
    eraseBtn.innerText = "Erase";
  } else {
    erasing = true;
    eraseBtn.innerText = "Paint";
  }
}

if (eraseBtn) {
  eraseBtn.addEventListener("click", handleEraseClick);
}

function erase(x, y) {
  const radius = 18; // 지우개 크기 조절 (필요에 따라 조절)
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "white"; // 원 내부를 흰색으로 채우기
  ctx.fill();
  ctx.closePath();
}

function handleSaveClick() {
  const customName = window.prompt("이름을 입력하세요.");

  if (!customName) {
    return;
  }

  const image = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = image;

  link.download = customName + ".png";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
}

if (saveBtn) {
  saveBtn.addEventListener("click", handleSaveClick);
}

function handleRemoveClick() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}
if (remove) {
  remove.addEventListener("click", handleRemoveClick);
}

function handleRightClick(event) {
  // 우클릭 팝업 오류 방지
  event.preventDefault();
}

function handleFileUpload(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();
      img.src = e.target.result;

      img.onload = function () {
        // 캔버스 크기를 이미지 크기에 맞게 조절
        img.width = canvas.width;
        img.height = canvas.height;

        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);

        // 캔버스에 이미지 그리기
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // 현재 이미지 업데이트
        currentImage = img;
      };
    };

    reader.readAsDataURL(file);
  }
}

canvas.addEventListener("contextmenu", handleRightClick); // 우클릭 팝업 방지

if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", function (event) {
    if (erasing && painting) {
      erase(event.offsetX, event.offsetY);
    } else {
      startPainting();
    }
  });
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleCanvasClick);
}

fileInput.addEventListener("change", handleFileUpload);
