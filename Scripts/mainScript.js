let cacCanh = []; // Mảng chứa cạnh
let cacDinh = []; // Mảng chứa đỉnh
let soDinh = 0; // Số đỉnh

// Khởi tạo ban đầu: Ẩn các nút không cần thiết khi mới load trang
$(document).ready(function () {
  $("#button-them").hide();
  $("#button-themCanh").hide();
  $("#button-ve").hide();
  $("#ketLuan").hide();
});

/* Hàm này khởi tạo một đồ thị mới bằng cách reset các mảng và lấy số đỉnh từ input.
   VD: Người dùng nhập số đỉnh = 4
   - Reset mảng cacCanh = []
   - Reset mảng cacDinh = []
   - Lấy số đỉnh từ input: soDinh = 4
   - Xóa các input cũ
   - Xóa kết luận cũ */
function khoiTaoDoThi() {
  cacCanh = [];
  cacDinh = [];
  soDinh = $("#soDinh").val();
  $("#canhContainer").empty();
  $("#ketLuan").empty();
}

/* Hàm này xóa đồ thị hiện tại và reload lại trang.

   VD: Người dùng nhấn nút Xóa
   - Trang web sẽ được tải lại từ đầu
   - Tất cả dữ liệu đồ thị hiện tại sẽ bị xóa */
function xoaDoThi() {
  location.reload();
}

/* Hàm này tạo các đỉnh cho đồ thị dựa trên số đỉnh đã nhập.
   VD: Với số đỉnh = 4:
   - Tạo mảng cacDinh = ["A", "B", "C", "D"] */
function taoCacDinh() {
  for (let i = 0; i < soDinh; i++) {
    cacDinh.push(String.fromCharCode(65 + i));
  }
}

/* Hàm này thêm một cạnh mới vào đồ thị nếu cạnh đó chưa tồn tại.
   VD: Thêm cạnh giữa A và B:
   - Kiểm tra xem cạnh (A,B) đã tồn tại chưa
   - Nếu chưa, thêm ["A","B"] vào mảng cacCanh */
function themCanh(dinhHienTai, dinhTiepTheo) {
  let demCanh = 0;
  // Đếm số cạnh hiện có giữa hai đỉnh
  for (let i = 0; i < cacCanh.length; i++) {
    const canh = cacCanh[i];
    if (
      (canh[0] == dinhHienTai && canh[1] == dinhTiepTheo) ||
      (canh[0] == dinhTiepTheo && canh[1] == dinhHienTai)
    ) {
      demCanh++;
    }
  }

  if (coCanhHienTai(dinhHienTai, dinhTiepTheo)) {
    [dinhHienTai, dinhTiepTheo] = [dinhTiepTheo, dinhHienTai];
    console.log("Có cạnh trùng giữa " + dinhHienTai + " và " + dinhTiepTheo);
  } else if (coCanhTiepTheo(dinhTiepTheo, dinhHienTai)) {
    [dinhHienTai, dinhTiepTheo] = [dinhTiepTheo, dinhHienTai];
    console.log("Có cạnh trùng giữa " + dinhTiepTheo + " và " + dinhHienTai);
  }
  if (demCanh < 2) {
    cacCanh.push([dinhHienTai, dinhTiepTheo]);
  }
}

/* Hàm này vẽ đồ thị lên canvas với kích thước tự động điều chỉnh.
   VD: Với 4 đỉnh:
   - Tính toán kích thước canvas dựa trên số đỉnh
   - Tạo canvas với kích thước phù hợp
   - Vẽ các đỉnh và cạnh lên canvas */
function veDoThiCanvas() {
  $("#canvasContainer").empty();

  const kichThuocGoc = 100;
  const hang = Math.ceil(Math.sqrt(soDinh));
  const cot = Math.ceil(soDinh / hang);
  const chieuNgang = hang * kichThuocGoc;
  const chieuDai = cot * kichThuocGoc;
  const canvas = $("<div></div>");

  canvas.attr("id", "canvas");
  canvas.css({
    width: `${chieuDai}px`,
    height: `${chieuNgang}px`,
  });
  $("#canvasContainer").append(canvas);
  new p5(function (p) {
    p.setup = function () {
      p.createCanvas(chieuDai, chieuNgang).parent("canvas");
      p.background(229, 229, 229);
      const viTri = tinhToaDoDinh();
      veCacCanh(p, viTri);
      veCacDinh(p, viTri);
    };
  });
}

/* Hàm này tính toán vị trí của các đỉnh trên canvas.
   VD: Với 4 đỉnh:
   - Tính số hàng = 2, số cột = 2
   - Khoảng cách giữa các đỉnh = 100px
   - Trả về object chứa tọa độ:
     {A:[50,50], B:[150,50], C:[50,150], D:[150,150]} */
function tinhToaDoDinh() {
  const viTri = {};
  const gridSize = 100;
  const hang = Math.ceil(Math.sqrt(soDinh));
  const cot = Math.ceil(soDinh / hang);

  for (let i = 0; i < soDinh; i++) {
    const Hang = Math.floor(i / cot);
    const Cot = i % cot;
    const x = 50 + Cot * gridSize;
    const y = 50 + Hang * gridSize;

    viTri[cacDinh[i]] = [x, y];
  }
  return viTri;
}

/* Hàm này vẽ các cạnh của đồ thị trên canvas.
   VD: Với cạnh nối A và B:
   - Lấy tọa độ của A: [50,50]
   - Lấy tọa độ của B: [150,50]
   - Vẽ đường thẳng từ A đến B với màu đen */
function veCacCanh(p, viTri) {
  p.stroke(0);
  p.strokeWeight(2);
  p.noFill();
  console.log(cacCanh);
  cacCanh.forEach(function (canh) {
    const [dinhHienTai, dinhTiepTheo] = canh;
    const [x1, y1] = viTri[dinhHienTai];
    const [x2, y2] = viTri[dinhTiepTheo];

    // Đếm số cạnh giữa hai đỉnh
    let demCanh = 0;
    for (let i = 0; i < cacCanh.length; i++) {
      const canhKiemTra = cacCanh[i];
      if (
        (canhKiemTra[0] == dinhHienTai && canhKiemTra[1] == dinhTiepTheo) ||
        (canhKiemTra[0] == dinhTiepTheo && canhKiemTra[1] == dinhHienTai)
      ) {
        demCanh++;
      }
    }

    // Nếu có nhiều hơn 1 cạnh, vẽ đường cong
    if (demCanh > 1) {
      const xGiua = (x1 + x2) / 2;
      const yGiua = (y1 + y2) / 2;
      const offset = 20;
      const controlX = xGiua + offset * Math.sign(y2 - y1);
      const controlY = yGiua - offset * Math.sign(x2 - x1);

      p.beginShape();
      p.vertex(x1, y1);
      p.quadraticVertex(controlX, controlY, x2, y2);
      p.endShape();
    } else {
      // Nếu chỉ có 1 cạnh, vẽ đường thẳng
      p.line(x1, y1, x2, y2);
    }
  });
}

/* Hàm này vẽ các đỉnh của đồ thị trên canvas.
   VD: Với 4 đỉnh A, B, C, D:
   - Vẽ hình tròn tại vị trí mỗi đỉnh
   - Đỉnh bậc lẻ: màu đỏ
   - Đỉnh bậc chẵn: màu đen
   - Hiển thị tên đỉnh phía trên hình tròn */
function veCacDinh(p, viTri) {
  const bacDinh = demBacDinh();
  p.noStroke();
  for (const dinh in viTri) {
    const [x, y] = viTri[dinh];
    const bac = bacDinh[dinh];

    if (bac % 2 !== 0) {
      p.fill("red");
    } else {
      p.fill(0);
    }
    p.ellipse(x, y, 20, 20);

    p.textFont("Fira Sans");
    p.textAlign("CENTER");
    p.textSize(16);
    p.text(dinh, x - 13, y - 16);
  }
}
/* Hàm này kiểm tra xem hai đỉnh có cạnh nối với nhau không.
   VD: Kiểm tra cạnh giữa A và B:
   - Duyệt qua mảng cacCanh
   - Kiểm tra cả (A,B) và (B,A)
   - Trả về true nếu tồn tại cạnh, false nếu không */
function coCanh(dinhHienTai, dinhTiepTheo) {
  for (let i = 0; i < cacCanh.length; i++) {
    const canh = cacCanh[i];

    if (
      (canh[0] == dinhHienTai && canh[1] == dinhTiepTheo) ||
      (canh[0] == dinhTiepTheo && canh[1] == dinhHienTai)
    ) {
      return true;
    }
  }
  return false;
}

function coCanhHienTai(dinhHienTai, dinhTiepTheo) {
  for (let i = 0; i < cacCanh.length; i++) {
    const canh = cacCanh[i];

    if (canh[0] == dinhHienTai && canh[1] == dinhTiepTheo) {
      return true;
    }
  }
  return false;
}

function coCanhTiepTheo(dinhHienTai, dinhTiepTheo) {
  for (let i = 0; i < cacCanh.length; i++) {
    const canh = cacCanh[i];

    if (canh[0] == dinhTiepTheo && canh[1] == dinhHienTai) {
      return true;
    }
  }
  return false;
}

/* Hàm này đếm bậc của các đỉnh trong đồ thị.
     VD: Với đồ thị có các cạnh (A,B), (B,C):
     - Nếu không có tham số: trả về {A:1, B:2, C:1}  
     - Nếu có tham số (VD: B): trả về 2 */
function demBacDinh(dinh = null) {
  const bacDinh = {};

  cacDinh.forEach((dinh) => {
    bacDinh[dinh] = 0;
  });

  cacCanh.forEach(([dinhHienTai, dinhTiepTheo]) => {
    bacDinh[dinhHienTai] += 1;

    bacDinh[dinhTiepTheo] += 1;
  });

  return dinh ? bacDinh[dinh] : bacDinh;
}

/* Hàm này kiểm tra tính liên thông của đồ thị bằng DFS.  
     VD: Với đồ thị có các cạnh (A,B), (B,C), (C,D): 
     - Bắt đầu từ đỉnh A 
     - Duyệt DFS qua các đỉnh kề 
     - Trả về true nếu có thể đi đến tất cả các đỉnh 
     - Trả về false nếu không thể đi đến một số đỉnh */
function kiemTraLienThong() {
  const visited = new Set();
  const stack = [];

  // Bắt đầu từ đỉnh đầu tiên
  stack.push(cacDinh[0]);

  while (stack.length > 0) {
    const dinhHienTai = stack.pop();

    if (!visited.has(dinhHienTai)) {
      // console.log(`Đang xét đỉnh: ${dinhHienTai}`);
      visited.add(dinhHienTai);

      // Tìm các đỉnh kề chưa được thăm và thêm vào stack
      for (const [dinhA, dinhB] of cacCanh) {
        if (dinhA == dinhHienTai && !visited.has(dinhB)) {
          // console.log(`Thêm ${dinhB} vào stack để xét sau`);
          stack.push(dinhB);
        } else if (dinhB == dinhHienTai && !visited.has(dinhA)) {
          // console.log(`Thêm ${dinhA} vào stack để xét sau`);
          stack.push(dinhA);
        }
      }
      // } else {
      //   console.log(`Đỉnh ${dinhHienTai} đã được thăm, quay lui`);
    }

    // console.log(`Stack hiện tại: ${stack.join(", ")}`);
    // console.log(`Các đỉnh đã thăm: ${[...visited].join(", ")}`);
    // console.log("---");
  }

  return visited.size == cacDinh.length;
}

/* Hàm này kiểm tra và kết luận về chu trình Euler của đồ thị.
     VD: Với đồ thị có 4 đỉnh:
     - Đếm số đỉnh bậc lẻ
     - Kiểm tra tính liên thông
     - Kết luận:
       + Chu trình Euler: nếu liên thông và tất cả đỉnh bậc chẵn
       + Nửa chu trình Euler: nếu liên thông và có đúng 2 đỉnh bậc lẻ
       + Không là chu trình Euler: trong các trường hợp còn lại */
function kiemTraEuler() {
  const bacDinh = demBacDinh();

  let bacLe = 0;

  for (const dinh in bacDinh) {
    if (bacDinh[dinh] % 2 !== 0) {
      bacLe++;
    }
  }

  let ketLuan;

  if (kiemTraLienThong()) {
    if (bacLe == 0) {
      ketLuan =
        "Là chu trình Euler vì tất cả các đỉnh có bậc chẵn và đồ thị liên thông";
    } else if (bacLe == 2) {
      ketLuan =
        "Là nửa chu trình Euler vì có đúng 2 đỉnh bậc lẻ và đồ thị liên thông";
    } else {
      ketLuan = "Không là chu trình Euler";
    }
  } else {
    ketLuan = "Không là chu trình Euler vì đồ thị không liên thông";
  }

  $("#ketLuan").html(ketLuan);
}

/* Hàm này tạo ma trận kề của đồ thị.
   VD: Với đồ thị 4 đỉnh A, B, C, D có các cạnh (A,B), (B,C), (C,D), (D,A):
   - Tạo ma trận 4x4
   - Đánh dấu 1 cho các cạnh tồn tại
   - Đánh dấu 0 cho các cạnh không tồn tại
   - Kết quả:
     [0,1,0,1]
     [1,0,1,0]
     [0,1,0,1]
     [1,0,1,0] */
function taoMaTran() {
  const maTran = [];
  for (let i = 0; i < soDinh; i++) {
    maTran[i] = [];
    for (let j = 0; j < soDinh; j++) {
      if (coCanh(cacDinh[i], cacDinh[j])) {
        maTran[i][j] = 1;
      } else {
        maTran[i][j] = 0;
      }
    }
  }
  return maTran;
}

/* Hàm này hiển thị ma trận kề lên HTML dưới dạng bảng.
       VD: Với ma trận kề 4x4:
       - Tạo hàng tiêu đề với tên các đỉnh
       - Tạo các hàng của bảng với giá trị 0,1
       - Hiển thị:
         |   | A | B | C | D |
         | A | 0 | 1 | 0 | 1 |
         | B | 1 | 0 | 1 | 0 |
         | C | 0 | 1 | 0 | 1 |
         | D | 1 | 0 | 1 | 0 | */
function hienThiMaTran() {
  const maTran = taoMaTran();
  const table = document.getElementById("maTran");
  table.innerHTML = "";
  // Tạo hàng tiêu đề
  const tenDinh = document.createElement("tr");
  tenDinh.innerHTML =
    "<th>Đỉnh</th>" +
    cacDinh
      .map(function (dinh) {
        return `<th>${dinh}</th>`;
      })
      .join("");
  table.appendChild(tenDinh);

  // Tạo các hàng của ma trận
  maTran.forEach(function (hangNgang, index) {
    const hangTable = document.createElement("tr");
    hangTable.innerHTML =
      `<th>${cacDinh[index]}</th>` +
      hangNgang
        .map(function (value) {
          return `<td>${value}</td>`;
        })
        .join("");
    table.appendChild(hangTable);
  });
}
