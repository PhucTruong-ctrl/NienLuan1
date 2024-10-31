let inputCount = 0;
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

function veDoThi() {
  if (soDinh <= 12 && soDinh >= 2) {
    veDoThiCanvas();
    hienThiMaTran();
    kiemTraEuler();
  }
}

function hienThiDinh() {
  // Reset lại số cạnh mỗi lần hiển thị đỉnh mới
  cacDinh.forEach((dinh) => {
    const label = $("<label></label>").text(`${dinh}: `);
    const input = $("<input>")
      .attr("id", `input-${dinh}-${inputCount}`)
      .attr("placeholder", "Nhập đỉnh kết nối");
    $("#canhContainer").append(label).append(input).append("<br />");
  });
  inputCount++;
}

function layVaThemCanh() {
  // Lấy tất cả các input trong canhContainer
  $("#canhContainer input").each(function () {
    const inputId = $(this).attr("id");
    const [, dinh] = inputId.split("-");
    const ketNoi = $(this).val().trim();

    // Chỉ thêm cạnh nếu input có giá trị và đỉnh kết nối hợp lệ
    if (ketNoi && cacDinh.includes(ketNoi) && dinh !== ketNoi) {
      themCanh(dinh, ketNoi);
    }
  });

  console.log("Các cạnh hiện tại:", cacCanh);
}
