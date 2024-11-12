/* Các biến toàn cục */
let noiDungFile = ""; // Lưu nội dung của file txt
let daChonFile = false; // Đánh dấu trạng thái đã chọn file hay chưa

/* Khởi tạo các sự kiện khi document ready */
$(document).ready(function () {
  $("#file-input").on("change", xulyChonFile);
});

/* Hàm này xử lý sự kiện khi người dùng chọn file.
   VD: Khi người dùng chọn file "input.txt":
   - Đánh dấu daChonFile = true
   - In thông báo đã chọn file thành công */
function xulyChonFile(event) {
  const file = event.target.files[0];
  const fileInput = document.getElementById("file-input");
  const fileName = document.getElementById("fileSelected");
  console.log("Đã chọn file:", file.name);
  if (file) {
    daChonFile = true;
    fileName.innerHTML = "Bạn đã chọn file: " + file.name;
  }
}

/* Hàm này đọc và xử lý nội dung file.
   VD: Với file "input.txt" có nội dung:
   4
   A B
   B C
   C D
   D A
   Hàm sẽ trả về mảng: ["4", "A B", "B C", "C D", "D A"] */
async function docVaXuLyFile(file) {
  console.log("Đang đọc và xử lý file:", file.name);
  const noiDung = await file.text();
  console.log("Nội dung file:", noiDung);

  const cacDong = noiDung
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  console.log("Các dòng sau khi xử lý:", cacDong);
  return cacDong;
}

/* Hàm này tạo đồ thị từ dữ liệu đã xử lý.
   VD: Với mảng ["4", "A B", "B C", "C D", "D A"]:
   - Tạo 4 đỉnh A, B, C, D
   - Thêm các cạnh AB, BC, CD, DA */
function taoDoThiTuDuLieu(cacDong) {
  console.log("Đang tạo đồ thị từ dữ liệu:", cacDong);
  if (cacDong.length < 2) {
    console.error("File không đủ dữ liệu");
  }

  const soDinhDoc = parseInt(cacDong[0]);
  console.log("Số đỉnh đọc được:", soDinhDoc);
  if (isNaN(soDinhDoc) || soDinhDoc < 2 || soDinhDoc > 12) {
    console.error("Số đỉnh không hợp lệ (phải từ 2-12)");
  }

  khoiTaoDoThi();
  soDinh = soDinhDoc;
  taoCacDinh();

  for (let i = 1; i < cacDong.length; i++) {
    const canh = cacDong[i].split(/\s+/);
    console.log("Đang thêm cạnh:", canh);
    if (canh.length === 2) {
      const [dinhA, dinhB] = canh;
      if (cacDinh.includes(dinhA) && cacDinh.includes(dinhB)) {
        themCanh(dinhA, dinhB);
      }
    }
  }
  console.log("Các cạnh gồm: ", cacCanh);
}

/* Hàm chung để vẽ đồ thị, chỉ bao gồm các hàm con.
   VD: Khi người dùng nhấn nút Vẽ:
   - Gọi hàm hiển thị kết quả */
async function veDoThi() {
  console.log("Bắt đầu vẽ đồ thị");
  try {
    await hienThiKetQua();
  } catch (error) {
    console.error("Lỗi khi vẽ đồ thị:", error);
    alert(error.message || "Có lỗi xảy ra khi vẽ đồ thị");
  }
}

/* Hàm xử lý chính để hiển thị kết quả từ file.
     VD: Khi được gọi từ veDoThi:
     - Đọc và xử lý file
     - Tạo đồ thị
     - Vẽ đồ thị lên canvas
     - Hiển thị ma trận kề
     - Kiểm tra và hiển thị kết luận về chu trình Euler */
async function hienThiKetQua() {
  console.log("Đang xử lý và hiển thị kết quả");
  const fileInput = document.getElementById("file-input");
  const file = fileInput.files[0];

  if (!file) {
    throw new Error("Vui lòng chọn file trước khi vẽ");
  }

  const cacDong = await docVaXuLyFile(file);
  if (cacDong.length === 0) {
    throw new Error("File không có dữ liệu hợp lệ");
  }

  taoDoThiTuDuLieu(cacDong);

  $("#button-xoa").show();
  veDoThiCanvas();
  kiemTraEuler();
  hienThiMaTran();
}
