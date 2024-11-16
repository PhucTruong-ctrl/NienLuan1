/* Các biến toàn cục */
let noiDungFile = ""; // Lưu nội dung của file txt
let daChonFile = false; // Đánh dấu trạng thái đã chọn file hay chưa

/* Khởi tạo các sự kiện khi document ready */
$(document).ready(function () {
  $("#file-input").on("change", xulyChonFile);
  $("#button-tao").hide();
});

/* Hàm này xử lý sự kiện khi người dùng chọn file. */
function xulyChonFile(event) {
  const file = event.target.files[0];
  const fileInput = document.getElementById("file-input");
  const fileName = document.getElementById("fileSelected");
  console.log("Đã chọn file:", file.name);
  if (file) {
    daChonFile = true;
    $("#button-tao").show();
    fileName.innerHTML = "Bạn đã chọn file: " + file.name;
  }
}

/* Hàm này đọc và xử lý nội dung file. */
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

/* Hàm này tạo đồ thị từ dữ liệu đã xử lý. */
/* Hàm này tạo đồ thị từ dữ liệu đã xử lý. */
function taoDoThiTuDuLieu(cacDong) {
  console.log("Đang tạo đồ thị từ dữ liệu:", cacDong);
  if (cacDong.length < 2) {
    console.error("File không đủ dữ liệu");
    return;
  }

  const soDinhDoc = parseInt(cacDong[0]);
  console.log("Số đỉnh đọc được:", soDinhDoc);
  if (isNaN(soDinhDoc) || soDinhDoc < 2 || soDinhDoc > 12) {
    console.error("Số đỉnh không hợp lệ (phải từ 2-12)");
    return;
  }

  khoiTaoDoThi();
  soDinh = soDinhDoc;
  taoCacDinh();

  // Xử lý ma trận kề
  for (let i = 1; i <= soDinh; i++) {
    // Kiểm tra xem cacDong[i] có tồn tại không
    if (i < cacDong.length) {
      const hang = cacDong[i].split(/\s+/).map(Number);
      for (let j = 0; j < hang.length; j++) {
        if (hang[j] === 1) {
          const dinhA = cacDinh[i - 1];
          const dinhB = cacDinh[j];
          themCanh(dinhA, dinhB);
        }
      }
    } else {
      console.error(`Dòng ${i} không tồn tại trong dữ liệu`);
    }
  }

  console.log("Các cạnh gồm: ", cacCanh);
}

/* Hàm chung để vẽ đồ thị, chỉ bao gồm các hàm con. */
async function veDoThi() {
  console.log("Bắt đầu vẽ đồ thị");
  try {
    await hienThiKetQua();
  } catch (error) {
    console.error("Lỗi khi vẽ đồ thị:", error);
    alert(error.message || "Có lỗi xảy ra khi vẽ đồ thị");
  }
}

/* Hàm xử lý chính để hiển thị kết quả từ file. */
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
  veDoThiCanvas();
  kiemTraEuler();
  hienThiMaTran();
}
