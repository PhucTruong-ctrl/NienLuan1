let cacCanh = [];
let cacDinh = [];
let soDinh = 0;

// Hàm chính để vẽ đồ thị
function VeDoThi() {
  khoiTaoDoThi(); // Khởi tạo đồ thị, thiết lập số đỉnh và kiểm tra tính hợp lệ
  taoCacDinh(); // Tạo danh sách các đỉnh
  KetNoiCacDinh(); // Kết nối các đỉnh liền kề
  themCacCanhNgauNhien(); // Thêm các cạnh ngẫu nhiên để tạo kết nối
  VeDoThiCanvas(); // Vẽ đồ thị lên canvas
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
function KetNoiCacDinh() {
  for (let i = 0; i < soDinh - 1; i++) {
    // Chỉ duyệt đến soDinh - 1
    const a = cacDinh[i];
    const b = cacDinh[i + 1]; // Kết nối đỉnh hiện tại với đỉnh tiếp theo

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
function VeDoThiCanvas() {
  const canvasContainer = document.getElementById("canvasContainer");
  canvasContainer.innerHTML = ""; // Xóa nội dung hiện có trong container
  const canvas = document.createElement("div"); // Tạo div cho canvas
  canvas.id = "canvas"; // Găn id cho canvas
  canvasContainer.appendChild(canvas); // Thêm div canvas này thành con của container

  // Khởi tạo p5 để vẽ đồ thị
  new p5((p) => {
    p.setup = () => {
      p.createCanvas(600, 600).parent("canvas"); // Tạo canvas
      p.background(255); // Thiết lập nền trắng
      const viTri = tinhToaDoDinh(p); // Tính toán vị trí cho các đỉnh
      veCacCanh(p, viTri); // Vẽ các cạnh
      veCacDinh(p,  viTri); // Vẽ các đỉnh
    };
  });
}

// Hàm tính toán vị trí của các đỉnh
function tinhToaDoDinh(p) {
  const viTri = {};
  const gridSize = 150; // Kích thước ô lưới
  const hang = Math.ceil(Math.sqrt(soDinh)); // Tính số hàng
  const cot = Math.ceil(soDinh / hang); // Tính số cột

  for (let i = 0; i < soDinh; i++) {
    const Hang = Math.floor(i / cot);
    const Cot = i % cot;
    const x = 200 + Cot * gridSize; // Tính tọa độ x theo cột
    const y = 50 + Hang * gridSize; // Tính tọa độ y theo hàng
    viTri[cacDinh[i]] = [x, y]; // Ghi nhận vị trí của đỉnh
  }

  return viTri; // Trả về vị trí của các đỉnh
}

// Hàm điều chỉnh tọa độ của các đỉnh

// Hàm vẽ các cạnh của đồ thị
function veCacCanh(p, viTri) {
  p.stroke(0); // Màu viền đen
  p.strokeWeight(2); // Độ dày viền
  cacCanh.forEach((canh) => {
    const [batDau, ketThuc] = canh;
    const [x1, y1] = viTri[batDau]; // Lấy tọa độ của đỉnh bắt đầu
    const [x2, y2] = viTri[ketThuc]; // Lấy tọa độ của đỉnh kết thúc
    p.line(x1, y1, x2, y2); // Vẽ đường thẳng giữa hai đỉnh
    console.log("Vị trí: ", viTri);
    console.log("Cạnh: ", canh);
    console.log("Đỉnh: ", batDau, ketThuc);
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
