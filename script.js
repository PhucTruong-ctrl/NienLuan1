let cacCanh = [];
let cacDinh = [];
let soDinh = 0;

// Hàm chính để vẽ đồ thị
function veDoThi() {
  khoiTaoDoThi(); // Khởi tạo đồ thị, thiết lập số đỉnh và kiểm tra tính hợp lệ
  if (soDinh <= 4 && soDinh >= 2) {
    taoCacDinh(); // Tạo danh sách các đỉnh
    themCacCanh(); // Thêm các cạnh ngẫu nhiên để tạo kết nối
    veDoThiCanvas(); // Vẽ đồ thị lên canvas
    kiemTraEuler(); // Kiểm tra xem đồ thị có chu trình Euler hay không
    hienThiMaTranKe();
  } else {
    alert("Hãy nhập số đỉnh từ 2 đến 4");
    return;
  }
}

function xoaDoThi() {
  location.reload(); // Làm mới trang
}

// Hàm khởi tạo đồ thị
function khoiTaoDoThi() {
  cacCanh = []; // Khởi tạo danh sách các cạnh
  cacDinh = []; // Khởi tạo danh sách các đỉnh
  soDinh = $("#soDinh").val(); // Lấy số đỉnh từ input bằng jQuery
}

// Hàm tạo các đỉnh
function taoCacDinh() {
  for (let i = 0; i < soDinh; i++) {
    cacDinh.push(String.fromCharCode(65 + i)); // Tạo các đỉnh từ A đến J
  }
}
function themCanh(dinhA, dinhB) {
  // Luôn thêm cạnh nếu chưa có
  if (!coCanh(dinhA, dinhB)) {
    cacCanh.push([dinhA, dinhB]);
  }
}

// Hàm thêm các cạnh ngẫu nhiên
function themCacCanh() {
  for (let i = 0; i < soDinh; i++) {
    const a = Math.floor(Math.random() * cacDinh.length);
    let b;
    do {
      b = Math.floor(Math.random() * cacDinh.length);
    } while (a == b); // Đảm bảo b khác a
    themCanh(cacDinh[a], cacDinh[b]);
  }
  // Kiểm tra tất cả các đỉnh và thêm cạnh vào những đỉnh có bậc là 0
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
  $("#canvasContainer").empty(); // Xóa nội dung hiện có trong container bằng jQuery

  // Tính toán kích thước canvas dựa trên số đỉnh
  const baseSize = 100; // Kích thước cơ bản cho mỗi đỉnh
  const canvasWidth = baseSize * Math.ceil(Math.sqrt(soDinh)); // Kích thước chiều rộng
  const canvasHeight =
    baseSize * Math.ceil(soDinh / Math.ceil(Math.sqrt(soDinh))); // Kích thước chiều cao

  const canvas = $("<div></div>"); // Tạo div cho canvas
  canvas.attr("id", "canvas"); // Gán id cho canvas
  canvas.css({
    width: `${canvasWidth}px`, // Kích thước canvas
    height: `${canvasHeight}px`, // Chiều cao canvas
    border: "1px solid black", // Biên cho canvas
  });
  $("#canvasContainer").append(canvas); // Thêm div canvas này thành con của container

  // Khởi tạo p5 để vẽ đồ thị
  new p5((p) => {
    p.setup = () => {
      p.createCanvas(canvasWidth, canvasHeight).parent("canvas"); // Tạo canvas
      p.background(255); // Thiết lập nền trắng
      const viTri = tinhToaDoDinh(p); // Tính toán vị trí cho các đỉnh
      veCacCanh(p, viTri); // Vẽ các cạnh
      veCacDinh(p, viTri); // Vẽ các đỉnh
    };
  });
}

// Hàm tính toán vị trí của các đỉnh
function tinhToaDoDinh(p) {
  const viTri = {};
  const gridSize = 100; // Kích thước ô lưới
  const hang = Math.ceil(Math.sqrt(soDinh)); // Tính số hàng
  const cot = Math.ceil(soDinh / hang); // Tính số cột

  for (let i = 0; i < soDinh; i++) {
    const Hang = Math.floor(i / cot);
    const Cot = i % cot;
    const x = 50 + Cot * gridSize; // Tính tọa độ x theo cột
    const y = 50 + Hang * gridSize; // Tính tọa độ y theo hàng
    viTri[cacDinh[i]] = [x, y]; // Ghi nhận vị trí của đỉnh
  }

  return viTri; // Trả về vị trí của các đỉnh
}// Hàm điều chỉnh tọa độ của các đỉnh

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
  const bacDinh = demBacDinh(); // Tính bậc của các đỉnh
  p.fill(0); // Màu đen cho đỉnh
  p.noStroke(); // Không vẽ viền cho đỉnh
  for (const dinh in viTri) {
    const [x, y] = viTri[dinh];
    const bac = bacDinh[dinh];

    // Tô màu tùy theo bậc của đỉnh
    if (bac % 2 !== 0) {
      p.fill(255, 0, 0); // Màu đỏ cho bậc lẻ
    } else {
      p.fill(0); // Màu đen cho bậc chẵn
    }
    p.ellipse(x, y, 20, 20); // Vẽ hình tròn cho đỉnh
    p.textAlign("CENTER"); // Canh giữa văn bản
    p.textSize(16); // Kích thước văn bản
    p.text(dinh, x - 7, y - 20); // Vẽ tên đỉnh
  }
}

// Hàm kiểm tra xem có cạnh giữa hai đỉnh không
function coCanh(batDau, ketThuc) {
  return cacCanh.some(
    (canh) =>
      (canh[0] == batDau && canh[1] == ketThuc) ||
      (canh[0] == ketThuc && canh[1] == batDau)
  ); // Kiểm tra trong danh sách cạnh
}

// Hàm đếm bậc của các đỉnh
function demBacDinh(dinh = null) {
  const bacDinh = {};

  // Khởi tạo bậc cho từng đỉnh
  cacDinh.forEach((dinh) => {
    bacDinh[dinh] = 0;
  });

  // Duyệt qua tất cả các cạnh và tăng bậc cho các đỉnh tương ứng
  cacCanh.forEach(([batDau, ketThuc]) => {
    bacDinh[batDau] += 1;
    bacDinh[ketThuc] += 1;
  });
  // Nếu có đỉnh được truyền vào thì trả về bậc của đỉnh đó, nếu không trả về tất cả
  return dinh ? bacDinh[dinh] : bacDinh;
}

// Hàm kiểm tra tính Euler của đồ thị
function kiemTraEuler() {
  const bacDinh = demBacDinh(); // Lấy bậc của tất cả các đỉnh
  const bacLe = Object.values(bacDinh).filter((bac) => bac % 2 != 0).length;
  let ketQua = "Không là chu trình Euler";

  if (bacLe == 0) {
    ketQua = "Là chu trình Euler vì tất cả các đỉnh có bậc chẵn";
  } else if (bacLe == 2) {
    ketQua = "Là nửa chu trình Euler vì có đúng 2 đỉnh bậc lẻ";
  }

  $("#ketQua").html(ketQua); // Hiển thị kết quả
}

function taoMaTranKe() {
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

function hienThiMaTranKe() {
  const maTranKe = taoMaTranKe();
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
