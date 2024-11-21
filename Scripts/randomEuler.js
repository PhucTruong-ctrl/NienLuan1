/* Hàm này vẽ đồ thị bằng cách khởi tạo các đỉnh và thêm các cạnh ngẫu nhiên.
   VD: Khi người dùng nhấn nút Vẽ:
   - Khởi tạo đồ thị mới
   - Tạo các đỉnh dựa trên số lượng đã nhập
   - Thêm các cạnh ngẫu nhiên vào đồ thị
   - Vẽ đồ thị lên canvas
   - Hiển thị ma trận kề và kiểm tra chu trình Euler */
function veDoThi() {
  khoiTao();
  if (soDinh <= 12 && soDinh >= 2) {
    // Đảm bảo đỉnh vẽ ra chuẩn
    $("#ketLuan").show();
    taoDinh();
    randomCanh(); // Thêm các cạnh ngẫu nhiên vào đồ thị
    veCanvas(); // Vẽ đồ thị lên canvas
    checkEuler(); // Kiểm tra và hiển thị kết luận về chu trình Euler
    hienThiMaTran(); // Hiển thị ma trận kề
  } else {
    alert("Hãy nhập số đỉnh từ 2 đến 12");
    return;
  }
}

/* Hàm này thêm các cạnh ngẫu nhiên giữa các đỉnh trong đồ thị.
     VD: Với số đỉnh = 4, hàm sẽ thêm khoảng 8 cạnh ngẫu nhiên,
     đảm bảo rằng không có đỉnh nào bị cô đơn (không có cạnh nào kết nối).
     - Chọn ngẫu nhiên hai đỉnh khác nhau
     - Thêm cạnh giữa hai đỉnh đó vào mảng cacCanh */
function randomCanh() {
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
    // Kiểm tra xem đỉnh có cô đơn hay không
    if (demBac(dinh) == 0) {
      // Nếu đỉnh đó = 0 (Cô đơn) thì thêm cạnh của đỉnh đó với đỉnh ngẫu nhiên khác.
      let dinhTemp = cacDinh[Math.floor(Math.random() * cacDinh.length)]; // Chọn số ngẫu nhiên từ số lượng đỉnh.
      while (dinhTemp == dinh) {
        dinhTemp = cacDinh[Math.floor(Math.random() * cacDinh.length)]; // Chọn số ngẫu nhiên từ số lượng đỉnh.
      }
      themCanh(dinh, dinhTemp); // Thêm cạnh của 2 đỉnh đó vào mảng.
    }
  }
}
