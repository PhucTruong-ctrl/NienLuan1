let cacCanh = [];
let cacDinh = [];
let soDinh = 0;

function VeDoThi() {
  cacCanh = [];
  cacDinh = [];
  soDinh = document.getElementById("soDinh").value;

  if (soDinh < 1 || soDinh > 10) {
    alert("Hãy nhập số đỉnh từ 1 đến 10");
    return;
  }

  // Tạo danh sách các đỉnh
  cacDinh = Array.from({ length: soDinh }, (_, i) => String.fromCharCode(65 + i));
  console.log("Các đỉnh:", cacDinh);

  // Kết nối các đỉnh liên tiếp tạo chu trình đơn giản
  for (let i = 0; i < soDinh; i++) {
    const a = cacDinh[i];
    const b = cacDinh[(i + 1) % soDinh];
    if (!coCanh(a, b)) cacCanh.push([a, b]);
  }

  // Thêm các cạnh ngẫu nhiên
  for (let i = 0; i < soDinh; i++) {
    const a = Math.floor(Math.random() * cacDinh.length);
    let b;
    do {
      b = Math.floor(Math.random() * cacDinh.length);
    } while (a === b);

    if (!coCanh(cacDinh[a], cacDinh[b])) {
      cacCanh.push([cacDinh[a], cacDinh[b]]);
    }
  }

  console.log("Các cạnh:", cacCanh);

  // Thiết lập canvas cho p5.js
  const canvasContainer = document.getElementById("canvasContainer");
  canvasContainer.innerHTML = "";
  const canvas = document.createElement("div");
  canvas.id = "canvas";
  canvasContainer.appendChild(canvas);

  new p5((p) => {
    p.setup = () => {
      p.createCanvas(800, 800).parent("canvas");
      p.background(255);

      const viTri = {};
      const phamvi_toithieu = 150;
      const maxAttempts = 100;

      // Xác định vị trí các đỉnh
      cacDinh.forEach((dinh) => {
        let x, y;
        let attempts = 0;
        do {
          x = p.random(100, 700);
          y = p.random(100, 700);
          attempts++;
        } while (
          Object.values(viTri).some(([Xkhac, Ykhac]) => p.dist(x, y, Xkhac, Ykhac) < phamvi_toithieu) &&
          attempts < maxAttempts
        );

        if (attempts >= maxAttempts) {
          console.warn(`Không thể tìm vị trí hợp lệ cho đỉnh ${dinh}`);
        }

        viTri[dinh] = [x, y];
      });

      const bacDinh = demCanh();

      // Vẽ các cạnh
      p.stroke(0);
      p.strokeWeight(2);
      cacCanh.forEach(([batDau, ketThuc]) => {
        const [x1, y1] = viTri[batDau];
        const [x2, y2] = viTri[ketThuc];
        p.line(x1, y1, x2, y2);
      });

      // Vẽ các đỉnh
      p.noStroke();
      for (const [dinh, [x, y]] of Object.entries(viTri)) {
        const bac = bacDinh[dinh];
        p.fill(bac % 2 !== 0 ? [255, 0, 0] : bac === 0 ? [0, 255, 0] : 0);
        p.ellipse(x, y, 20, 20);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(16);
        p.text(dinh, x, y - 20);
      }
    };
  });

  KiemTraEuler();
}

function coCanh(batDau, ketThuc) {
  return cacCanh.some(([u, v]) => (u === batDau && v === ketThuc) || (u === ketThuc && v === batDau));
}

function demCanh() {
  const bacDinh = Object.fromEntries(cacDinh.map((dinh) => [dinh, 0]));
  cacCanh.forEach(([batDau, ketThuc]) => {
    bacDinh[batDau]++;
    bacDinh[ketThuc]++;
  });
  return bacDinh;
}

function KiemTraEuler() {
  const bacDinh = demCanh();
  const bacLe = Object.values(bacDinh).filter((bac) => bac % 2 !== 0).length;
  const ketQua = bacLe === 0
    ? "Là chu trình Euler vì tất cả đỉnh bậc chẵn"
    : bacLe === 2
    ? "Là nửa chu trình Euler vì có 2 đỉnh bậc lẻ"
    : "Không là chu trình Euler";

  document.getElementById("ketQua").innerHTML = ketQua;
}
