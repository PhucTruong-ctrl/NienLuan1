let inputCount = 0; // Biến đếm số lần nhập input

/* Hàm này tạo đồ thị bằng cách khởi tạo các đỉnh và hiển thị giao diện nhập liệu.
   VD: Người dùng nhập số đỉnh = 4.
   Khi nhấn nút Tạo:
   - Khởi tạo đồ thị mới
   - Tạo các đỉnh A, B, C, D
   - Hiển thị form nhập liệu cho mỗi đỉnh
   - Hiển thị các nút Xóa, Thêm, Thêm cạnh, Vẽ */
function taoDoThi() {
  khoiTaoDoThi();
  if (soDinh <= 12 && soDinh >= 2) {
    taoCacDinh();
    hienThiDinh();
    $("#button-xoa").show();
    $("#button-them").show();
    $("#button-themCanh").show();
    $("#button-ve").show();
  }
}

/* Hàm này vẽ đồ thị lên canvas, hiển thị ma trận kề và kiểm tra chu trình Euler.
   VD: Sau khi nhập các cạnh và nhấn nút Vẽ:
   - Vẽ đồ thị với các đỉnh và cạnh đã nhập
   - Hiển thị ma trận kề tương ứng
   - Hiển thị kết luận về chu trình Euler */
function veDoThi() {
  if (soDinh <= 12 && soDinh >= 2) {
    veDoThiCanvas();
    hienThiMaTran();
    kiemTraEuler();
  }
}

/* Hàm này tạo giao diện nhập liệu cho mỗi đỉnh để nhập các đỉnh kết nối.
   VD: Với 4 đỉnh A, B, C, D:
   - Tạo 4 ô input: "A:", "B:", "C:", "D:"
   - Mỗi ô input cho phép nhập đỉnh kết nối
   - ID của mỗi input là dạng input-A-0, input-B-0, ... */
function hienThiDinh() {
  soCanh = cacDinh.length;
  cacDinh.forEach((dinh) => {
    const label = $("<label></label>").text(`${dinh}: `);
    const input = $("<input>")
      .attr("id", `input-${dinh}-${inputCount}`)
      .attr("placeholder", "Nhập đỉnh kết nối");
    $("#canhContainer").append(label).append(input).append("<br />");
  });
  inputCount++;
}

/* Hàm này lấy dữ liệu từ các ô input và thêm cạnh vào đồ thị.
   VD: Người dùng nhập:
   A: B
   B: C
   C: D
   D: A
   Khi nhấn nút Thêm:
   - Lấy giá trị từ mỗi input
   - Kiểm tra tính hợp lệ của đỉnh kết nối
   - Thêm các cạnh (A,B), (B,C), (C,D), (D,A) vào đồ thị */
function layVaThemCanh() {
  for (let i = 0; i < inputCount; i++) {
    for (let j = 0; j < cacDinh.length; j++) {
      const dinh = cacDinh[j];
      const ketNoi = $(`#input-${dinh}-${i}`).val();
      if (ketNoi && cacDinh.includes(ketNoi)) {
        themCanh(dinh, ketNoi);
      }
    }
  }
  console.log("Các cạnh hiện tại:", cacCanh);
}
