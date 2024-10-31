function veDoThi() {
  // Hàm tổng
  khoiTaoDoThi();
  if (soDinh <= 12 && soDinh >= 2) {
    // Đảm bảo đỉnh vẽ ra chuẩn
    $("#button-xoa").show();
    taoCacDinh();
    themCacCanh();
    veDoThiCanvas();
    kiemTraEuler();
    hienThiMaTran();
  } else {
    alert("Hãy nhập số đỉnh từ 2 đến 12");
    return;
  }
}

function themCacCanh() {
  // Hàm thêm cạnh ngẫu nhiên
  for (let i = 0; i < soDinh * 2; i++) {
    // Vòng lặp từ 0 đến số đỉnh.
    const a = Math.floor(Math.random() * cacDinh.length); // Chọn số ngẫu nhiên từ số lượng đỉnh.
    let b;
    do {
      b = Math.floor(Math.random() * cacDinh.length); // Chọn số ngẫu nhiên từ số lượng đỉnh.
    } while (a == b); // Đảm bảo a luôn khác b
    themCanh(cacDinh[a], cacDinh[b]); // Thêm cạnh của 2 đỉnh đó vào mảng.
  }
  for (const dinh of cacDinh) {
    // for ... of ([A:1, B:2, C:3] thì sẽ trả về A,B,C) là dùng để lặp qua tên của đối tượng trong mảng, for ... in ([A:1, B:2, C:3] thì sẽ trả về 1,2,3) lặp qua giá trị của đối tượng đó.
    if (demBacDinh(dinh) == 0) {
      // Nếu đỉnh đó = 0 (Cô đơn) thì thêm cạnh của đỉnh đó với đỉnh ngẫu nhiên khác.
      let dinhTemp = cacDinh[Math.floor(Math.random() * cacDinh.length)]; // Chọn số ngẫu nhiên từ số lượng đỉnh.
      while (dinhTemp == dinh) {
        dinhTemp = cacDinh[Math.floor(Math.random() * cacDinh.length)]; // Chọn số ngẫu nhiên từ số lượng đỉnh.
      }
      themCanh(dinh, dinhTemp); // Thêm cạnh của 2 đỉnh đó vào mảng.
    }
  }
}
