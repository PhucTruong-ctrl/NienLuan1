let cacCanh = [];
let cacDinh = [];
let soDinh = 0;

function veDoThi() {
  khoiTaoDoThi();
  if (soDinh <= 6 && soDinh >= 2) {
    taoCacDinh();
    themCacCanh();
    veDoThiCanvas();
    kiemTraEuler();
    hienThiMaTran();
  } else {
    alert("Hãy nhập số đỉnh từ 2 đến 4");
    return;
  }
}

function xoaDoThi() {
  location.reload();
}

function khoiTaoDoThi() {
  cacCanh = [];
  cacDinh = [];
  soDinh = $("#soDinh").val();
}

function taoCacDinh() {
  for (let i = 0; i < soDinh; i++) {
    cacDinh.push(String.fromCharCode(65 + i));
  }
}
function themCanh(dinhA, dinhB) {
  if (!coCanh(dinhA, dinhB)) {
    cacCanh.push([dinhA, dinhB]);
  }
}

function themCacCanh() {
  for (let i = 0; i < soDinh; i++) {
    const a = Math.floor(Math.random() * cacDinh.length);
    let b;
    do {
      b = Math.floor(Math.random() * cacDinh.length);
    } while (a == b);
    themCanh(cacDinh[a], cacDinh[b]);
  }
  for (const dinh of cacDinh) {
    if (demBacDinh(dinh) == 0) {
      let dinhTemp = cacDinh[Math.floor(Math.random() * cacDinh.length)];
      while (dinhTemp == dinh) {
        dinhTemp = cacDinh[Math.floor(Math.random() * cacDinh.length)];
      }
      themCanh(dinh, dinhTemp);
    }
  }
}

function veDoThiCanvas() {
  $("#canvasContainer").empty();
  const baseSize = 100;
  const hang = Math.ceil(Math.sqrt(soDinh));
  const cot = Math.ceil(soDinh / hang);
  const canvasWidth = cot * baseSize;
  const canvasHeight = hang * baseSize;
  const canvas = $("<div></div>");
  canvas.attr("id", "canvas");
  canvas.css({
    width: `${canvasWidth}px`,
    height: `${canvasHeight}px`,
    border: "1px solid black",
  });
  $("#canvasContainer").append(canvas);
  new p5((p) => {
    p.setup = () => {
      p.createCanvas(canvasWidth, canvasHeight).parent("canvas");
      p.background(255);
      const viTri = tinhToaDoDinh(p);
      veCacCanh(p, viTri);
      veCacDinh(p, viTri);
    };
  });
}

function tinhToaDoDinh(p) {
  const viTri = {};
  const gridSize = 100;
  const hang = Math.ceil(Math.sqrt(soDinh));
  const cot = Math.ceil(soDinh / hang);
  for (let i = 0; i < soDinh; i++) {
    const Hang = Math.floor(i / cot);
    const Cot = i % cot;
    const x = 50 + Cot * gridSize;
    const y = 50 + Hang * gridSize;
    viTri[cacDinh[i]] = [x, y];
  }
  return viTri;
}

function veCacCanh(p, viTri) {
  p.stroke(0);
  p.strokeWeight(2);
  cacCanh.forEach((canh) => {
    const [batDau, ketThuc] = canh;
    const [x1, y1] = viTri[batDau];
    const [x2, y2] = viTri[ketThuc];
    p.line(x1, y1, x2, y2);
  });
}

function veCacDinh(p, viTri) {
  const bacDinh = demBacDinh();
  p.fill(0);
  p.noStroke();
  for (const dinh in viTri) {
    const [x, y] = viTri[dinh];
    const bac = bacDinh[dinh];
    if (bac % 2 !== 0) {
      p.fill(255, 0, 0);
    } else {
      p.fill(0);
    }
    p.ellipse(x, y, 20, 20);
    p.textAlign("CENTER");
    p.textSize(16);
    p.text(dinh, x - 7, y - 20);
  }
}

function coCanh(batDau, ketThuc) {
  return cacCanh.some(
    (canh) =>
      (canh[0] == batDau && canh[1] == ketThuc) ||
      (canh[0] == ketThuc && canh[1] == batDau)
  );
}

function demBacDinh(dinh = null) {
  const bacDinh = {};
  cacDinh.forEach((dinh) => {
    bacDinh[dinh] = 0;
  });
  cacCanh.forEach(([batDau, ketThuc]) => {
    bacDinh[batDau] += 1;
    bacDinh[ketThuc] += 1;
  });
  return dinh ? bacDinh[dinh] : bacDinh;
}

function kiemTraEuler() {
  const bacDinh = demBacDinh();
  const bacLe = Object.values(bacDinh).filter((bac) => bac % 2 != 0).length;
  let ketQua = "Không là chu trình Euler";
  if (bacLe == 0) {
    ketQua = "Là chu trình Euler vì tất cả các đỉnh có bậc chẵn";
  } else if (bacLe == 2) {
    ketQua = "Là nửa chu trình Euler vì có đúng 2 đỉnh bậc lẻ";
  }
  $("#ketQua").html(ketQua);
}

function taoMaTran() {
  const maTranKe = [];
  for (let i = 0; i < soDinh; i++) {
    maTranKe[i] = [];
    for (let j = 0; j < soDinh; j++) {
      if (coCanh(cacDinh[i], cacDinh[j])) {
        maTranKe[i][j] = 1;
      } else {
        maTranKe[i][j] = 0;
      }
    }
  }
  return maTranKe;
}

function hienThiMaTran() {
  const maTranKe = taoMaTran();
  const table = document.getElementById("maTranKe");
  table.innerHTML = "";
  const headerRow = document.createElement("tr");
  headerRow.innerHTML =
    "<th></th>" + cacDinh.map((dinh) => `<th>${dinh}</th>`).join("");
  table.appendChild(headerRow);
  maTranKe.forEach((row, index) => {
    const rowElement = document.createElement("tr");
    rowElement.innerHTML =
      `<th>${cacDinh[index]}</th>` +
      row.map((value) => `<td>${value}</td>`).join("");
    table.appendChild(rowElement);
  });
}
