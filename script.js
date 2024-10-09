let cacCanh = [];
let cacDinh = [];
let soDinh = 0;

// Hàm chính để vẽ đồ thị
function VeDoThi() {
  khoiTaoDoThi(); // Khởi tạo đồ thị, thiết lập số đỉnh và kiểm tra tính hợp lệ
  taoCacDinh(); // Tạo danh sách các đỉnh
  ketNoiCacDinhLienTiep(); // Kết nối các đỉnh liền kề
  themCacCanhNgauNhien(); // Thêm các cạnh ngẫu nhiên để tạo kết nối
  veDoThi(); // Vẽ đồ thị lên canvas
  KiemTraEuler(); // Kiểm tra xem đồ thị có chu trình Euler hay không
}

// Hàm khởi tạo đồ thị
function khoiTaoDoThi() {
  cacCanh = []; // Khởi tạo danh sách các cạnh
  cacDinh = []; // Khởi tạo danh sách các đỉnh
  soDinh = document.getElementById("soDinh").value; // Lấy số đỉnh từ input

  // Kiểm tra xem số đỉnh có hợp lệ không
  if (soDinh < 1 || soDinh > 10) {
    alert("Hãy nhập số đỉnh từ 1 đến 10");
    return;
  }
}

// Hàm tạo các đỉnh
function taoCacDinh() {
  for (let i = 0; i < soDinh; i++) {
    cacDinh.push(String.fromCharCode(65 + i)); // Tạo các đỉnh từ A đến J
  }
  console.log("Các đỉnh:", cacDinh); // In ra danh sách các đỉnh
}

// Hàm kết nối các đỉnh liền kề
function ketNoiCacDinhLienTiep() {
  for (let i = 0; i < soDinh; i++) {
    const a = cacDinh[i];
    const b = cacDinh[(i + 1) % soDinh]; // Kết nối đỉnh cuối với đỉnh đầu

    // Kiểm tra nếu cạnh không tồn tại thì thêm vào danh sách
    if (!coCanh(a, b)) {
      cacCanh.push([a, b]);
    }
  }
}

// Hàm thêm các cạnh ngẫu nhiên
function themCacCanhNgauNhien() {
  for (let i = 0; i < soDinh; i++) {
    const a = Math.floor(Math.random() * cacDinh.length);
    let b;
    do {
      b = Math.floor(Math.random() * cacDinh.length);
    } while (a === b); // Đảm bảo b khác a

    // Kiểm tra nếu cạnh không tồn tại thì thêm vào danh sách
    if (!coCanh(cacDinh[a], cacDinh[b])) {
      cacCanh.push([cacDinh[a], cacDinh[b]]);
    }
  }
  console.log("Các cạnh:", cacCanh); // In ra danh sách các cạnh
}

// Hàm vẽ đồ thị lên canvas
function veDoThi() {
  const canvasContainer = document.getElementById("canvasContainer");
  canvasContainer.innerHTML = ""; // Xóa nội dung hiện có trong container
  const canvas = document.createElement("div");
  canvas.id = "canvas"; // Tạo div cho canvas
  canvasContainer.appendChild(canvas);

  // Khởi tạo p5 để vẽ đồ thị
  new p5((p) => {
    p.setup = () => {
      p.createCanvas(800, 800).parent("canvas"); // Tạo canvas
      p.background(255); // Thiết lập nền trắng
      const viTri = tinhToaDoDinh(p); // Tính toán vị trí cho các đỉnh
      chinhToaDoDinh(p, viTri); // Điều chỉnh vị trí của các đỉnh
      veCacCanh(p, viTri); // Vẽ các cạnh
      veCacDinh(p, viTri); // Vẽ các đỉnh
    };
  });
}

// Hàm tính toán vị trí của các đỉnh
function tinhToaDoDinh(p) {
  const viTri = {};
  const phamvi_toithieu = 150; // Khoảng cách tối thiểu giữa các đỉnh
  const maxAttempts = 100; // Số lần thử tối đa để tìm vị trí hợp lệ

  cacDinh.forEach((dinh) => {
    let x, y;
    let dangQuaGan;
    let attempts = 0;

    do {
      x = p.random(100, 700); // Tạo tọa độ ngẫu nhiên trong khoảng 100 đến 700
      y = p.random(100, 700);
      dangQuaGan = false;

      // Kiểm tra khoảng cách với các đỉnh khác
      for (const diemKhac in viTri) {
        const [Xkhac, Ykhac] = viTri[diemKhac];
        const phamvi = p.dist(x, y, Xkhac, Ykhac);

        if (phamvi < phamvi_toithieu) {
          dangQuaGan = true; // Nếu gần nhau thì đánh dấu là gần
          break;
        }
      }
      attempts++;
    } while (dangQuaGan && attempts < maxAttempts); // Lặp cho đến khi tìm thấy vị trí hợp lệ hoặc hết số lần thử

    if (attempts >= maxAttempts) {
      console.warn(
        `Không thể tìm vị trí hợp lệ cho đỉnh ${dinh} sau ${maxAttempts} lần thử.`
      );
    }

    viTri[dinh] = [x, y]; // Ghi nhận vị trí của đỉnh
  });

  return viTri; // Trả về vị trí của các đỉnh
}

// Hàm điều chỉnh tọa độ của các đỉnh
function chinhToaDoDinh(p, viTri) {
  const phamvi_toithieu = 150; // Khoảng cách tối thiểu giữa các đỉnh
  for (let i = 0; i < 100; i++) {
    // Lặp để điều chỉnh
    for (const dinh in viTri) {
      let fx = 0;
      let fy = 0;
      for (const diemKhac in viTri) {
        if (dinh !== diemKhac) {
          const [x1, y1] = viTri[dinh];
          const [x2, y2] = viTri[diemKhac];
          const dist = p.dist(x1, y1, x2, y2);
          if (dist < phamvi_toithieu) {
            // Nếu gần nhau
            fx += (x1 - x2) / dist; // Điều chỉnh theo phương x
            fy += (y1 - y2) / dist; // Điều chỉnh theo phương y
          }
        }
      }
      viTri[dinh][0] += fx; // Cập nhật vị trí
      viTri[dinh][1] += fy; // Cập nhật vị trí
    }
  }
}

// Hàm vẽ các cạnh của đồ thị
function veCacCanh(p, viTri) {
  p.stroke(0); // Màu viền đen
  p.strokeWeight(2); // Độ dày viền
  cacCanh.forEach((canh) => {
    const [batDau, ketThuc] = canh;
    const [x1, y1] = viTri[batDau]; // Lấy tọa độ của đỉnh bắt đầu
    const [x2, y2] = viTri[ketThuc]; // Lấy tọa độ của đỉnh kết thúc
    p.line(x1, y1, x2, y2); // Vẽ đường thẳng giữa hai đỉnh
  });
}

// Hàm vẽ các đỉnh của đồ thị
function veCacDinh(p, viTri) {
  const bacDinh = demCanh(); // Tính bậc của các đỉnh
  p.fill(0); // Màu đen cho đỉnh
  p.noStroke(); // Không vẽ viền cho đỉnh
  for (const dinh in viTri) {
    const [x, y] = viTri[dinh];
    const bac = bacDinh[dinh];

    // Tô màu tùy theo bậc của đỉnh
    if (bac % 2 !== 0) {
      p.fill(255, 0, 0); // Màu đỏ cho bậc lẻ
    } else if (bac === 0) {
      p.fill(0, 255, 0); // Màu xanh lá cho bậc 0
    } else {
      p.fill(0); // Màu đen cho bậc chẵn
    }

    p.ellipse(x, y, 20, 20); // Vẽ hình tròn cho đỉnh
    p.textAlign(p.CENTER, p.CENTER); // Canh giữa văn bản
    p.textSize(16); // Kích thước văn bản
    p.text(dinh, x, y - 20); // Vẽ tên đỉnh
  }
}

// Hàm kiểm tra xem có cạnh giữa hai đỉnh không
function coCanh(batDau, ketThuc) {
  return cacCanh.some(
    (canh) =>
      (canh[0] === batDau && canh[1] === ketThuc) ||
      (canh[0] === ketThuc && canh[1] === batDau)
  ); // Kiểm tra trong danh sách cạnh
}

// Hàm đếm bậc của các đỉnh
function demCanh() {
  const bacDinh = {};
  cacDinh.forEach((dinh) => {
    bacDinh[dinh] = 0; // Khởi tạo bậc cho mỗi đỉnh
  });
  cacCanh.forEach(([batDau, ketThuc]) => {
    bacDinh[batDau] += 1; // Tăng bậc cho đỉnh bắt đầu
    bacDinh[ketThuc] += 1; // Tăng bậc cho đỉnh kết thúc
  });
  return bacDinh; // Trả về đối tượng chứa bậc của các đỉnh
}

// Hàm kiểm tra tính Euler của đồ thị
function KiemTraEuler() {
  const bacDinh = demCanh(); // Tính bậc của các đỉnh
  console.log(bacDinh); // In ra bậc của các đỉnh
  const bacLe = Object.values(bacDinh).filter((bac) => bac % 2 != 0).length; // Đếm số đỉnh bậc lẻ
  let ketQua = "Không là chu trình Euler"; // Kết quả mặc định
  if (bacLe === 0) {
    ketQua = "Là chu trình Euler vì tất cả đỉnh bậc chẵn"; // Nếu tất cả đỉnh bậc chẵn
  } else if (bacLe === 2) {
    ketQua = "Là nữa chu trình Euler vì có 2 đỉnh bậc lẻ"; // Nếu có 2 đỉnh bậc lẻ
  }
  document.getElementById("ketQua").innerHTML = ketQua; // Hiển thị kết quả trên giao diện
}
