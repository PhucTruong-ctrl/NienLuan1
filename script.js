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

  for (let i = 0; i < soDinh; i++) {
    cacDinh.push(String.fromCharCode(65 + i));
  }
  console.log("Các đỉnh:", cacDinh);

  for (let i = 0; i < soDinh; i++) {
  // Kết nối đỉnh hiện tại với đỉnh tiếp theo, đảm bảo tất cả các đỉnh đều có ít nhất một cạnh
  const a = cacDinh[i];
  const b = cacDinh[(i + 1) % soDinh]; // Sử dụng % để kết nối đỉnh cuối với đỉnh đầu

  if (!coCanh(a, b)) {
    cacCanh.push([a, b]);
  }
}

// Thêm các cạnh ngẫu nhiên để đồ thị có thêm kết nối
for (let i = 0; i < soDinh; i++) {
  const a = Math.floor(Math.random() * cacDinh.length);
  let b;
  do {
    b = Math.floor(Math.random() * cacDinh.length);
  } while (a === b); // Đảm bảo b khác a

  if (!coCanh(cacDinh[a], cacDinh[b])) {
    cacCanh.push([cacDinh[a], cacDinh[b]]);
  }
}
  console.log("Các cạnh:", cacCanh);

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

      cacDinh.forEach((dinh) => {
        let x, y;
        let dangQuaGan;
        let attempts = 0;

        do {
          x = p.random(100, 700);
          y = p.random(100, 700);
          dangQuaGan = false;

          for (const diemKhac in viTri) {
            const [Xkhac, Ykhac] = viTri[diemKhac];
            const phamvi = p.dist(x, y, Xkhac, Ykhac);

            if (phamvi < phamvi_toithieu) {
              dangQuaGan = true;
              break;
            }
          }
          attempts++;
        } while (dangQuaGan && attempts < maxAttempts);

        if (attempts >= maxAttempts) {
          console.warn(
            `Không thể tìm vị trí hợp lệ cho đỉnh ${dinh} sau ${maxAttempts} lần thử.`
          );
        }

        viTri[dinh] = [x, y];
      });

      const bacDinh = demCanh();

      for (let i = 0; i < 100; i++) {
        for (const dinh in viTri) {
          let fx = 0;
          let fy = 0;
          for (const diemKhac in viTri) {
            if (dinh !== diemKhac) {
              const [x1, y1] = viTri[dinh];
              const [x2, y2] = viTri[diemKhac];
              const dist = p.dist(x1, y1, x2, y2);
              if (dist < phamvi_toithieu) {
                fx += (x1 - x2) / dist;
                fy += (y1 - y2) / dist;
              }
            }
          }
          viTri[dinh][0] += fx;
          viTri[dinh][1] += fy;
        }
      }

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
        const bac = bacDinh[dinh];

        if (bac % 2 !== 0) {
          p.fill(255, 0, 0); // Nếu bậc lẻ, tô màu đỏ
        } else if (bac === 0) {
          p.fill(0, 255, 0); // Nếu bậc 0 (cô đơn), tô màu xanh lá
        } else {
          p.fill(0); // Nếu bậc chẵn, tô màu đen
        }

        p.ellipse(x, y, 20, 20);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(16);
        p.text(dinh, x, y - 20);

        console.log("Đỉnh:", dinh, viTri[dinh]);
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

function demCanh() {
  const bacDinh = {};

  // Khởi tạo bậc cho tất cả các đỉnh là 0
  cacDinh.forEach((dinh) => {
    bacDinh[dinh] = 0;
  });

  cacCanh.forEach(([batDau, ketThuc]) => {
    bacDinh[batDau] += 1;
    bacDinh[ketThuc] += 1;
  });

  return bacDinh;
}

function KiemTraEuler() {
  const bacDinh = demCanh();
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
