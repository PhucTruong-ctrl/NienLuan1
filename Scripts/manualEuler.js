let inputCount = 0;
function taoDoThi() {
  khoiTaoDoThi();
  if (soDinh <= 12 && soDinh >= 2) {
    taoCacDinh();
    hienThiDinh();
    $("#button-xoa").show(); // Hiển thị nút Thêm sau khi nhấn Tạo
    $("#button-them").show(); // Hiển thị nút Thêm sau khi nhấn Tạo
    $("#button-themCanh").show();
    $("#button-ve").show();
  }
}

function veDoThi() {
  if (soDinh <= 12 && soDinh >= 2) {
    veDoThiCanvas();
    hienThiMaTran();
    kiemTraEuler();
  }
}

function hienThiDinh() {
  cacDinh.forEach((dinh) => {
    soCanh++;
    console.log(soCanh);
    const label = $("<label></label>").text(`${dinh}: `);
    const input = $("<input>")
      .attr("id", `input-${dinh}-${inputCount}`)
      .attr("placeholder", "Nhập đỉnh kết nối");
    $("#canhContainer").append(label).append(input).append("<br />");
  });
  inputCount++;
}

// Hàm xử lý khi nhấn nút Thêm
function layVaThemCanh() {
  for (let i = 0; i < soCanh; i++) {
    for (let j = 0; j < cacDinh.length; j++) {
      const dinh = cacDinh[j];
      const ketNoi = $(`#input-${dinh}-${i}`).val(); // Lấy giá trị từ input
      if (ketNoi && cacDinh.includes(ketNoi)) {
        // Kiểm tra đỉnh có tồn tại không
        themCanh(dinh, ketNoi);
      }
    }
  }
  console.log("Các cạnh hiện tại:", cacCanh); // Kiểm tra các cạnh đã thêm
}
