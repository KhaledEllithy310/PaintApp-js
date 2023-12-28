const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvas = document.querySelector(".clear-canvas"),
  saveImg = document.querySelector(".save-img"),
  ctx = canvas.getContext("2d");

// global variables with default value
let prevMouseX,
  prevMouseY,
  snapshot,
  isDrawing = false,
  selectedTool = "freeHand",
  brushWidth = 5,
  selectedColor = "#000";

// const setCanvasBackground = () => {
//   // setting whole canvas background to white, so the downloaded img background will be white
//   ctx.fillStyle = "#fff";
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
//   ctx.fillStyle = selectedColor; // setting fillstyle back to the selectedColor, it'll be the brush color
// };

window.addEventListener("load", () => {
  // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  //   setCanvasBackground();
});

const drawRect = (e) => {
  ctx.strokeRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};

const drawCircle = (e) => {
  ctx.beginPath(); // creating new path to draw circle
  // getting radius for circle according to the mouse pointer
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer
  ctx.stroke(); // if fillColor is checked fill circle else draw border circle
};

const drawLine = (e) => {
  ctx.beginPath(); // creating new path to draw circle
  ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
  ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
  ctx.closePath(); // closing path of a triangle so the third line draw automatically
  ctx.stroke(); // if fillColor is checked fill triangle else draw border
};

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
  prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value
  ctx.beginPath(); // creating new path to draw
  ctx.lineWidth = brushWidth; // passing brushSize as line width
  ctx.strokeStyle = selectedColor; // passing selectedColor as stroke style
  ctx.fillStyle = selectedColor; // passing selectedColor as fill style
  // copying canvas data & passing as snapshot value.. this avoids dragging the image
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return; // if isDrawing is false return from here
  ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas

  if (selectedTool === "freeHand" || selectedTool === "eraser") {
    // if selected tool is eraser then set strokeStyle to white
    // to paint white color on to the existing canvas content else set the stroke color to selected color
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
    ctx.stroke(); // drawing/filling line with color
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else {
    drawLine(e);
  }
};

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // adding click event to all tool option
    // removing active class from the previous option and adding on current clicked option
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

// sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value)); // passing slider value as brushSize

colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // adding click event to all color button
    // removing selected class from the previous option and adding on current clicked option
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    // passing selected btn background color as selectedColor value
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));
