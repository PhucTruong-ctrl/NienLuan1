let cacCanh = [];
let cacDinh = [];
let soCanh = 0;

function VeDoThi() {
  cacCanh = [];
  cacDinh = [];
  soCanh = document.getElementById("soCanh").value;

  for (let i = 0; i < soCanh; i++) {
    cacDinh.push(String.fromCharCode(65 + i));
  }
  console.log(cacDinh);
  for (let i = 0; i < soCanh; i++) {
    const a = Math.floor(Math.random() * cacDinh.length);
    const b = Math.floor(Math.random() * cacDinh.length);
    if (a !== b) {
      // Kiểm tra nếu cạnh đã tồn tại
      if (!coCanh(cacDinh[a], cacDinh[b])) {
        cacCanh.push([cacDinh[a], cacDinh[b]]);
      }
    }
  }
  console.log(cacCanh);

  const canvasContainer = document.getElementById("canvasContainer");
  canvasContainer.innerHTML = "";
  const canvas = document.createElement("div");
  canvas.id = "canvas";
  canvasContainer.appendChild(canvas);

  new p5((p) => {
    p.setup = () => {
      p.createCanvas(600, 600).parent("canvas");
      p.background(255);

      const viTri = {};
      const phamvi_toithieu = 100;

      cacDinh.forEach((diem) => {
        let x, y;
        let dangQuaGan;

        do {
          x = p.random(100, 500);
          y = p.random(100, 300);
          dangQuaGan = false;

          for (const diemKhac in viTri) {
            const [Xkhac, Ykhac] = viTri[diemKhac];
            const phamvi = p.dist(x, y, Xkhac, Ykhac);

            if (phamvi < phamvi_toithieu) {
              dangQuaGan = true;
              break;
            }
          }
        } while (dangQuaGan);

        viTri[diem] = [x, y];
      });

      p.stroke(0);
      p.strokeWeight(2);

      cacCanh.forEach((canh) => {
        const [batDau, ketThuc] = canh;
        const [x1, y1] = viTri[batDau];
        const [x2, y2] = viTri[ketThuc];
        p.line(x1, y1, x2, y2);
      });

      p.fill(0);
      p.noStroke();
      for (const dinh in viTri) {
        const [x, y] = viTri[dinh];
        p.ellipse(x, y, 20, 20);

        p.fill(0);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(16);
        p.text(dinh, x, y - 20);
      }
    };
  });
  KiemTraEuler();
}

// Hàm kiểm tra xem cạnh đã tồn tại chưa
function coCanh(batDau, ketThuc) {
  return cacCanh.some(
    (canh) =>
      (canh[0] === batDau && canh[1] === ketThuc) ||
      (canh[0] === ketThuc && canh[1] === batDau)
  );
}

function KiemTraEuler() {
  const bacDinh = {};
  cacCanh.forEach(([batDau, ketThuc]) => {
    bacDinh[batDau] = (bacDinh[batDau] || 0) + 1;
    bacDinh[ketThuc] = (bacDinh[ketThuc] || 0) + 1;
  });
  console.log(bacDinh);
  const bacLe = Object.values(bacDinh).filter((bac) => bac % 2 != 0).length;
  let ketQua = "Không là chu trình Euler";
  if (bacLe === 0) {
    ketQua = "Là chu trình Euler vì tất cả đỉnh bậc chẵn";
  } else if (bacLe === 2) {
    ketQua = "Là nữa chu trình Euler vì có 2 đỉnh bậc lẻ";
  }
  document.getElementById("ketQua").innerHTML = ketQua;
}
