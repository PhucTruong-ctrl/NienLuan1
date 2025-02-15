let inputCount = 0; // Biến đếm số lần nhập input

/* Hàm này tạo đồ thị bằng cách khởi tạo các đỉnh và hiển thị giao diện nhập liệu.
   VD: Người dùng nhập số đỉnh = 4.
   Khi nhấn nút Tạo:
   - Khởi tạo đồ thị mới
   - Tạo các đỉnh A, B, C, D
   - Hiển thị form nhập liệu cho mỗi đỉnh
   - Hiển thị các nút Xóa, Thêm, Thêm cạnh, Vẽ */
function taoDoThi() {
  khoiTao();
  if (soDinh <= 6 && soDinh >= 2) {
    taoDinh();
    hienThiDinh();
    $("#button-them").show();
    $("#button-themCanh").show();
    $("#button-ve").show();
  }
  else {
    alert("Hãy nhập số đỉnh từ 2 đến 6");
    return;
  }
}

/* Hàm này vẽ đồ thị lên canvas, hiển thị ma trận kề và kiểm tra chu trình Euler.
   VD: Sau khi nhập các cạnh và nhấn nút Vẽ:
   - Vẽ đồ thị với các đỉnh và cạnh đã nhập
   - Hiển thị ma trận kề tương ứng
   - Hiển thị kết luận về chu trình Euler */
function veDoThi() {
  if (soDinh <= 6 && soDinh >= 2) {
    cacCanh = [];
    layVaThemCanh();
    veCanvas();
    hienThiMaTran();
    checkEuler();
    timChuTrinhEuler();
    $("#button-xoa").show();
    $("#ketLuan").show();
  }
  else {
    alert("Hãy nhập số đỉnh từ 2 đến 6");
    return;
  }
}

/* Hàm này tạo giao diện nhập liệu cho mỗi đỉnh để nhập các đỉnh kết nối.
   VD: Với 4 đỉnh A, B, C, D:
   - Tạo 4 ô input: "A:", "B:", "C:", "D:"
   - Mỗi ô input cho phép nhập đỉnh kết nối
   - ID của mỗi input là dạng input-A-0, input-B-0, ... */
function hienThiDinh() {
  if (inputCount <= 2) {
    cacDinh.forEach((dinh) => {
      const label = $("<label></label>").text(`${dinh}: `);
      const input = $("<input>")
        .attr("id", `input-${dinh}-${inputCount}`)
        .attr("class", "form-control")
        .attr("placeholder", "Nhập đỉnh kết nối.");
      $("#canhContainer").append(label).append(input);
    });
  } else {
    alert("Không thể tạo thêm cạnh!");
  }
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
      let dinhInput = $(`#input-${dinh}-${i}`).val();
      dinhInput = dinhInput ? dinhInput.toUpperCase() : null;
      if (dinhInput && cacDinh.includes(dinhInput)) {
        themCanh(dinh, dinhInput);
      }
    }
  }
  console.log("Các cạnh hiện tại:", cacCanh);
}
