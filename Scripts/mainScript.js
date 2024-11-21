let cacCanh = []; // Mảng chứa cạnh
let cacDinh = []; // Mảng chứa đỉnh
let soDinh = 0; // Số đỉnh

// Ẩn các nút không cần thiết khi mới load trang
$(document).ready(function () {
  $("#button-them").hide();
  $("#button-themCanh").hide();
  $("#button-ve").hide();
  $("#ketLuan").hide();
});

// Khởi tạo đồ thị, Reset các mảng, lấy số đình từ input
function khoiTao() {
  cacCanh = [];
  cacDinh = [];
  soDinh = $("#soDinh").val();
  $("#canhContainer").empty();
  $("#ketLuan").empty();
}

// Xoá đồ thị bằng cách refresh lại trang
function xoaDoThi() {
  location.reload();
}

/* Hàm này sẽ tạo đỉnh bằng bảng chữ cái theo soDinh
VD: soDinh = 4.
i = 0, Thêm A vào mảng cacDinh['A']
i = 1, Thêm B vào mảng cacDinh['A','B']
i = 2, Thêm C vào mảng cacDinh['A','B','C']
i = 3, Thêm D vào mảng cacDinh['A','B','C','D']
*/
function taoDinh() {
  for (let i = 0; i < soDinh; i++) {
    cacDinh.push(String.fromCharCode(65 + i));
    // Hiển thị số thay vì chữ cái
    // cacDinh.push(i + 1);
  }
}

/* Hàm này thêm cạnh vào mảng cacCanh, giới hạn cạnh của mỗi đỉnh tối đa là 2,
 đảo ngược đỉnh lại nếu đỉnh hiện tại đã có cạnh với đỉnh tiếp theo.
 VD: soDinh = 4, cacDinh = ['A','B','C','D'].
 i = 0, cacCanh.length = 0, Đình hiện tại ko trùng, Thêm A và B vào mảng cacCanh[['A','B']]
 i = 1, cacCanh.length = 1, Đỉnh hiện tại trùng, Thêm B và A vào mảng cacCanh[['A','B'],['B','A']]
 i = 2, cacCanh.length = 2, Đỉnh hiện tại ko trùng, Thêm B và C vào mảng cacCanh[['A','B'],['B','A'],['B','C']]
 i = 3, cacCanh.length = 3, Đînh hiện tại ko trùng, Thêm C và D vào mảng cacCanh[['A','B'],['B','A'],['B','C'],['C','D']]
*/
function themCanh(dinhHienTai, dinhTiepTheo) {
  let demCanhTrung = 0;
  for (let i = 0; i < cacCanh.length; i++) {
    const canh = cacCanh[i];
    if (
      (canh[0] == dinhHienTai && canh[1] == dinhTiepTheo) ||
      (canh[0] == dinhTiepTheo && canh[1] == dinhHienTai)
    ) {
      demCanhTrung++;
    }
  }

  if (coCanhHienTai(dinhHienTai, dinhTiepTheo)) {
    [dinhHienTai, dinhTiepTheo] = [dinhTiepTheo, dinhHienTai];
    console.log("Có cạnh trùng giữa " + dinhHienTai + " và " + dinhTiepTheo);
  }
  if (demCanhTrung < 2) {
    console.log("Đang thêm: " + dinhHienTai + " và " + dinhTiepTheo);
    cacCanh.push([dinhHienTai, dinhTiepTheo]);
  }
}

/* Hàm này vẽ đồ thị lên canvas với kích thước tự động điều chỉnh.
   VD: Với 4 đỉnh:
   - Tính toán kích thước canvas dựa trên số đỉnh
   - Tạo canvas với kích thước phù hợp
   - Vẽ các đỉnh và cạnh lên canvas */
function veCanvas() {
  $("#canvasContainer").empty();

  const kichThuocGoc = 100;
  const hang = Math.ceil(Math.sqrt(soDinh)); // Math.ceil làm tròn lên số nguyên lớn nhất
  const cot = Math.ceil(soDinh / hang); // Math.ceil làm tròn lên số nguyên lớn nhất
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
      const viTri = tinhToaDo();
      veCanh(p, viTri);
      veDinh(p, viTri);
    };
  });
}

/* Hàm này tính toán vị trí của các đỉnh trên canvas.
   VD: Với 4 đỉnh:
   - Tính số hàng = 2, số cột = 2
   - Khoảng cách giữa các đỉnh = 100px
   - Trả về object chứa tọa độ:
     {A:[50,50], B:[150,50], C:[50,150], D:[150,150]} */
function tinhToaDo() {
  const viTri = {};
  const gridSize = 100;
  const hang = Math.ceil(Math.sqrt(soDinh)); // Math.ceil làm tròn lên số nguyên lớn nhất
  const cot = Math.ceil(soDinh / hang); // Math.ceil làm tròn lên số nguyên lớn nhất
  console.log(hang, cot);

  for (let i = 0; i < soDinh; i++) {
    const Hang = Math.floor(i / cot); // Math.floor làm tròn xuống số nguyên nhỏ nhất
    const Cot = i % cot;
    const x = 50 + Cot * gridSize;
    const y = 50 + Hang * gridSize;

    viTri[cacDinh[i]] = [x, y];
  }
  return viTri;
}

/* Hàm này vẽ các đỉnh của đồ thị trên canvas.
   VD: Với 4 đỉnh A, B, C, D:
   - Vẽ hình tròn tại vị trí mỗi đỉnh
   - Đỉnh bậc lẻ: màu đỏ
   - Đỉnh bậc chẵn: màu đen
   - Hiển thị tên đỉnh phía trên hình tròn */
function veDinh(p, viTri) {
  const bacDinh = demBac();
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

/* Hàm này vẽ các cạnh của đồ thị trên canvas.
   VD: Với cạnh nối A và B:
   - Lấy tọa độ của A: [50,50]
   - Lấy tọa độ của B: [150,50]
   - Vẽ đường thẳng từ A đến B với màu đen */
function veCanh(p, viTri) {
  p.stroke(0);
  p.strokeWeight(2);
  p.noFill();
  cacCanh.forEach(function (canh) {
    const [dinhHienTai, dinhTiepTheo] = canh;
    const [x1, y1] = viTri[dinhHienTai];
    const [x2, y2] = viTri[dinhTiepTheo];

    let demCanhTrung = 0;
    for (let i = 0; i < cacCanh.length; i++) {
      const canh = cacCanh[i];
      if (
        (canh[0] == dinhHienTai && canh[1] == dinhTiepTheo) ||
        (canh[0] == dinhTiepTheo && canh[1] == dinhHienTai)
      ) {
        demCanhTrung++;
      }
    }

    if (demCanhTrung > 1) {
      const xGiua = (x1 + x2) / 2;
      const yGiua = (y1 + y2) / 2;
      const offset = 20;
      const controlX = xGiua + offset * Math.sign(y2 - y1); // Trả về 1 nếu dương, -1 nếu âm, 0 nếu bằng 0
      const controlY = yGiua - offset * Math.sign(x2 - x1); // Trả về 1 nếu dương, -1 nếu âm, 0 nếu bằng 0
      console.log("Đỉnh là: " + dinhHienTai, x1, y1, dinhTiepTheo, x2, y2);
      console.log("xGiua, yGiua: ", xGiua, yGiua);
      console.log("controlX, controlY: ", controlX, controlY);

      p.beginShape();
      p.vertex(x1, y1);
      p.quadraticVertex(controlX, controlY, x2, y2);
      p.endShape();
    } else {
      p.line(x1, y1, x2, y2);
    }
  });
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

/* Hàm này đếm bậc của các đỉnh trong đồ thị.
     VD: Với đồ thị có các cạnh (A,B), (B,C):
     - Nếu không có tham số: trả về {A:1, B:2, C:1}  
     - Nếu có tham số (VD: B): trả về 2 */
function demBac(dinh = null) {
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
function checkLienThong() {
  const visited = new Set(); // Set để đảm bảo mỗi phần tử là duy nhất
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
function checkEuler() {
  const bacDinh = demBac();

  let bacLe = 0;

  for (const dinh in bacDinh) {
    if (bacDinh[dinh] % 2 !== 0) {
      bacLe++;
    }
  }

  let ketLuan;

  if (checkLienThong()) {
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
