function taoDoThi() {
  khoiTaoDoThi();
  if (soDinh <= 12 && soDinh >= 2) {
    taoCacDinh();
    hienThiDinh();
    $("#button-them").show(); // Hiển thị nút Thêm sau khi nhấn Tạo
  }
}

function veDoThi() {
  if (soDinh <= 12 && soDinh >= 2) {
    layVaThemCanh();
    veDoThiCanvas();
    hienThiMaTran();
    kiemTraEuler();
  }
}

function hienThiDinh() {
  cacDinh.forEach((dinh) => {
    const label = $("<label></label>").text(`${dinh}: `);
    const input = $("<input>")
      .attr("id", `input-${dinh}`)
      .attr("placeholder", "Nhập đỉnh kết nối");
    $("#canhContainer").append(label).append(input).append("<br />");
  });
}

// Hàm xử lý khi nhấn nút Thêm
function layVaThemCanh() {
  cacDinh.forEach((dinh) => {
    const ketNoi = $(`#input-${dinh}`).val(); // Lấy giá trị từ input
    if (ketNoi && cacDinh.includes(ketNoi)) {
      // Kiểm tra đỉnh có tồn tại không
      themCanh(dinh, ketNoi);
    }
  });
  console.log("Các cạnh hiện tại:", cacCanh); // Kiểm tra các cạnh đã thêm
}

$(document).ready(function () {
  $("#button-them").hide(); // Ẩn nút Thêm khi mới tải trang
});
