let cacCanh = []; // Mảng chứa cạnh
let cacDinh = []; // Mảng chứa đỉnh
let soDinh = 0; // Số đỉnh

$(document).ready(function () {
  $("#button-them").hide();
  $("#button-themCanh").hide();
  $("#button-ve").hide();  
  $("#button-xoa").hide(); 
});

function khoiTaoDoThi() {
  cacCanh = []; // Đặt lại để đảm bảo không bị cộng dồn
  cacDinh = [];
  soDinh = $("#soDinh").val(); // Lấy dữ liệu từ người dùng
  $("#canhContainer").empty(); // Xóa các input cũ
  $("#ketLuan").empty(); // Xóa kết luận cũ nếu có
}

function xoaDoThi() {
  // Hàm xoá đồ thị
  location.reload(); // Reload lại trang
}

function taoCacDinh() {
  for (let i = 0; i < soDinh; i++) {
    cacDinh.push(String.fromCharCode(65 + i)); // Thêm kí tự A+i vào mảng các đỉnh
  }
}

function themCanh(dinhA, dinhB) {
  if (!coCanh(dinhA, dinhB)) {
    // Kiểm tra hai đỉnh đó đã có cạnh với nhau chưa
    cacCanh.push([dinhA, dinhB]); // Thêm hai đỉnh đó vào một phần tử của mảng các cạnh
  }
}

function veDoThiCanvas() {
  // Hàm vẽ đồ thị lên Canvas
  $("#canvasContainer").empty(); // Xoá đồ thị có sẵn trên Canvas
  const kichThuocGoc = 100; // Kích thước nhỏ nhất của Canvas
  const hang = Math.ceil(Math.sqrt(soDinh)); // Tính số hàng. Sử dụng ceil để làm tròn lớn nhất của căn bậc hai số đỉnh.
  const cot = Math.ceil(soDinh / hang); // Tính số cột. Sử dụng ceil để làm tròn lớn nhất của: số đỉnh / hàng.
  const chieuNgang = hang * kichThuocGoc; // Chiều ngang của Canvas.
  const chieuDai = cot * kichThuocGoc; // Chiều dài của Canvas.
  // Mục đích là để kích thước có thể thay đổi lớn, nhỏ dựa trên số đỉnh.
  const canvas = $("<div></div>"); // Tạo ra một div là Canvas
  canvas.attr("id", "canvas"); // Gắn id cho Canvas là canvas
  canvas.css({
    // CSS cho Canvas.
    width: `${chieuDai}px`,
    height: `${chieuNgang}px`,
    border: "1px solid black",
  });
  $("#canvasContainer").append(canvas); // Thêm con canvas vào cha canvasContainer
  new p5(function (p) {
    // Tạo thư viện p5.js
    p.setup = function () {
      // Bắt đầu khởi tạo bản vẽ https://p5js.org/reference/p5/setup/
      p.createCanvas(chieuDai, chieuNgang).parent("canvas"); // Tạo bản vẽ
      p.background(255); // Cho nền bản vẽ là trắng
      const viTri = tinhToaDoDinh(); // Lấy vị trí được trả về từ hàm con này.
      veCacCanh(p, viTri); // Bắt đầu vẽ đỉnh từ vị trí đã có
      veCacDinh(p, viTri); // Bắt đầu vẽ cạnh từ vị trí đã có
    };
  });
}

function tinhToaDoDinh() {
  // Hàm tính vị trí của đỉnh
  const viTri = {}; // Mảng vị trí chứa vị trí của từng đỉnh. VD: {A:[50,50],B:[100,100]}
  const gridSize = 100; // Khoảng cách giữa các đỉnh với nhau
  const hang = Math.ceil(Math.sqrt(soDinh)); // Tính số hàng. Sử dụng ceil để làm tròn lớn nhất của căn bậc hai số đỉnh.
  const cot = Math.ceil(soDinh / hang); // Tính số cột. Sử dụng ceil để làm tròn lớn nhất của: số đỉnh / hàng.
  for (let i = 0; i < soDinh; i++) {
    // Vòng lặp chạy từ 0 đến số đỉnh.
    const Hang = Math.floor(i / cot);
    const Cot = i % cot;
    const x = 50 + Cot * gridSize;
    const y = 50 + Hang * gridSize;
    /* Mỗi lần lặp sẽ tính Hang và Cot, sau đó nhân cho khoảng cách giữa các đỉnh (gridSize)
      VD: hang = 3, cot = 2. 
      Hang 0 / 2 = 0; 1/2 = 0.5 = 0; 2/2 = 1; 3/2 = 1.5 = 1;
      Cot  0 % 2 = 0; 1 % 2 = 1; 2 % 2 = 0; 3 % 2 = 1. 
      x = 50 + 0 * 100 = 50; y = 50 + 0 * 100 = 50; A = [50,50]
      x = 50 + 1 x 100 = 150; y = 50 + 0 * 100 = 50; B = [150,50]
      x = 50 + 0 * 100 = 50; y = 50 + 1 * 100 = 150; C = [50,150]
      x = 50 + 1 * 100 = 150; y = 50 + 1 * 100 = 150; D = [150,150] */
    viTri[cacDinh[i]] = [x, y]; // Gán vị trí cho các đỉnh đó vào mảng chứa vị trí. VD: {A:[50,50],B:[150,50],C:[50,150],D:[150,150]}
  }
  return viTri;
}

function veCacCanh(p, viTri) {
  // Hàm này sẽ vẽ các cạnh giữa các đỉnh với nhau
  p.stroke(0); // Đặt màu đen cho cạnh được vẽ
  p.strokeWeight(2); // Độ dày của cạnh
  cacCanh.forEach(function (canh) {
    // Duyệt qua các phần tử trong mảng cacCanh VD: [{0:["A","B"]}]
    const [dinhHienTai, dinhTiepTheo] = canh;
    /* canh là mảng có hai phần tử VD: ["A","B"]
      sau đó gán cho dinhHienTai = A, dinhTiepTheo = B. */

    const [x1, y1] = viTri[dinhHienTai];
    const [x2, y2] = viTri[dinhTiepTheo];
    /* Sau đó gán cho x1 = Vị trí của X A, y1 = Vị trí của Y A
      x2 = Vị trí của X B, y2 = Vị trí của Y B
      VD: dinhHienTai = 'A' nên vị trí trong mảng 
      viTri = {A:[50,50],B:[150,50]} vậy là x1 = 50, y1 = 50; 
      dinhTiepTheo = 'B' nên vị trí là x2 = 150, y2 = 50;
      */
    p.line(x1, y1, x2, y2); // Vẽ đường từ X Y đến X Y. VD từ toạ độ 50,50 vẽ đến 150,50
  });
}

function veCacDinh(p, viTri) {
  // Hàm vẽ ra các đỉnh
  const bacDinh = demBacDinh(); // Lấy bậc của tất cả đỉnh hiện có
  p.noStroke(); // Thực thể vẽ ra sẽ không có viền
  for (const dinh in viTri) {
    // Duyệt qua mảng vị trí
    const [x, y] = viTri[dinh];
    /* Gắn giá trị vị trí của đỉnh hiện tại cho x,y. 
      VD: Ta có mảng {A:[50,50],B:[150,50],C:[50,150],D:[150,150]}
       biến dinh là 0 thì x,y là 50,50; Tức x = 50, y = 50.
       */
    const bac = bacDinh[dinh];
    /* Lấy giá trị của bậc đỉnh hiện tại
      VD: Ta có {A:0,B:1,C:0,D:1}
      biến dinh là 0 thì bac = 0;
       */
    if (bac % 2 !== 0) {
      // Kiểm tra đỉnh bậc lẽ hay chẵn
      p.fill(255, 0, 0); // Nếu lẽ thì là màu đỏ
    } else {
      p.fill(0); // Nếu chẵn là màu đen
    }
    p.ellipse(x, y, 20, 20); // ellipse(x,y,w(Chiều rộng),h(Chiều cao)). Vẽ hình tròn
    p.textAlign("CENTER"); // Căn lề chữ trong hình tròn giữa
    p.textSize(16);
    p.text(dinh, x - 7, y - 20); // Đặt ký tự của đỉnh hiện tại trên hình tròn đó
  }
}

function coCanh(dinhHienTai, dinhTiepTheo) {
  // Hàm này kiểm tra giữa 2 đỉnh có cạnh với nhau không.
  for (let i = 0; i < cacCanh.length; i++) {
    // Duyệt qua các phần tử trong mảng cacCanh
    const canh = cacCanh[i]; // Lấy cạnh hiện tại gán cho biến canh. Vd: [{0:["A","B"]}], i = 0 thì canh = ["A","B"]
    if (
      (canh[0] == dinhHienTai && canh[1] == dinhTiepTheo) || // Kiểm tra phần tử đầu tiên của mảng canh với phần tử tiếp theo
      (canh[0] == dinhTiepTheo && canh[1] == dinhHienTai) // Kiểm tra ngược lại
    ) {
      return true; // Trả về true nếu đúng
    }
  }
  return false; // Mặc định trả về false
}
function demBacDinh(dinh = null) {
  /* Hàm này trả về vị trí của một đỉnh nếu có đầu vào, còn không thì trả về tất cả bậc của tất cả đỉnh. 
    VD: Nếu có đầu vào là A: trả về bacDinh[A:0].
    Còn không thì trả về: bacDinh = {A:0,B:2,C:0,D:2}.
    */
  const bacDinh = {};
  cacDinh.forEach((dinh) => {
    // Duyệt qua tất cả các đỉnh trong mảng cacDinh
    bacDinh[dinh] = 0; // Đặt giá trị bậc của tất cả đỉnh = 0
  });
  cacCanh.forEach(([dinhHienTai, dinhTiepTheo]) => {
    // Duyệt qua tất cả các cạnh trong mảng cacCanh
    bacDinh[dinhHienTai] += 1; // Cộng bậc cho đỉnh hiện tại
    bacDinh[dinhTiepTheo] += 1; // Cộng bậc cho đỉnh tiếp theo
    // Tức là nếu có tồn tại cạnh trong mảng cacCanh thì sẽ cộng bậc lên.
    // VD: cacCanh = [{0:["A","B"]}] Thì bậc A cộng lên 1, bậc B cộng lên 1.
  });
  return dinh ? bacDinh[dinh] : bacDinh; // Điều kiện ? True : False
  // Nếu có đỉnh đầu vào thì trả về bacDinh[dinh]. Không thì trả về bacDinh
}

function kiemTraLienThong() {
  const visited = new Set();

  function dfs(dinh) {
    visited.add(dinh);
    cacCanh.forEach(([dinhA, dinhB]) => {
      if (dinhA === dinh && !visited.has(dinhB)) {
        dfs(dinhB);
      }
      if (dinhB === dinh && !visited.has(dinhA)) {
        dfs(dinhA);
      }
    });
  }

  dfs(cacDinh[0]);

  return visited.size === cacDinh.length;
}

// Hàm kiểm tra Euler
function kiemTraEuler() {
  const bacDinh = demBacDinh(); // Lấy tất cả bậc của tất cả đỉnh
  let bacLe = 0;

  // Đếm số đỉnh bậc lẻ
  for (const dinh in bacDinh) {
    if (bacDinh[dinh] % 2 !== 0) {
      bacLe++;
    }
  }

  let ketLuan;

  if (kiemTraLienThong()) {
    if (bacLe === 0) {
      ketLuan =
        "Là chu trình Euler vì tất cả các đỉnh có bậc chẵn và đồ thị liên thông";
    } else if (bacLe === 2) {
      ketLuan =
        "Là nửa chu trình Euler vì có đúng 2 đỉnh bậc lẻ và đồ thị liên thông";
    } else {
      ketLuan = "Không là chu trình Euler";
    }
  } else {
    ketLuan = "Không là chu trình Euler vì đồ thị không liên thông";
  }

  $("#ketLuan").html(ketLuan); // Hiển thị kết luận ra HTML
}
function taoMaTran() {
  // Hàm này sẽ tạo ra một mảng 2 chiều tượng trưng cho ma trận kề của đồ thị.
  const maTran = []; // Tạo mảng maTran một chiều
  for (let i = 0; i < soDinh; i++) {
    // Vòng lặp i chạy từ 0 đến số đỉnh

    maTran[i] = [];
    /* Với mỗi i tạo thêm mảng một chiều.
      VD: soDinh = 4, thì 
       maTran = [ 
                  [], 
                  [], 
                  [], 
                  [] 
                ] */

    for (let j = 0; j < soDinh; j++) {
      // Vòng lặp j chạy từ 0 đến số đỉnh
      if (coCanh(cacDinh[i], cacDinh[j])) {
        // Kiểm tra cạnh i và j có không.
        maTran[i][j] = 1;
      } else {
        maTran[i][j] = 0;
      }
      /* VD: soDinh = 4, cacDinh = [A,B,C,D], 
        cacCanh = [0:["A", "B"], 1:["B", "C"], 2:["C", "D"], 3:["D", "A"]] 
        i = 0, j = 0, coCanh(A, A) = false thì maTran[0][0] = 0.
        i = 0, j = 1, coCanh(A, B) = true thì maTran[0][1] = 1. 
        i = 0, j = 2, coCanh(A, C) = false thì maTran[0][2] = 0.
        i = 0, j = 3, coCanh(A, D) = true thì maTran[0][3] = 1.
  
        i = 1, j = 0, coCanh(B, A) = true thì maTran[1][0] = 1.
        i = 1, j = 1, coCanh(B, B) = false thì maTran[1][1] = 0.
        i = 1, j = 2, coCanh(B, C) = true thì maTran[1][2] = 1.
        i = 1, j = 3, coCanh(B, D) = false thì maTran[1][3] = 0.
  
        i = 2, j = 0, coCanh(C, A) = false thì maTran[2][0] = 0.
        i = 2, j = 1, coCanh(C, B) = true thì maTran[2][1] = 1.
        i = 2, j = 2, coCanh(C, C) = false thì maTran[2][2] = 0.
        i = 2, j = 3, coCanh(C, D) = true thì maTran[2][3] = 1.
  
        i = 3, j = 0, coCanh(D, A) = true thì maTran[3][0] = 1.
        i = 3, j = 1, coCanh(D, B) = false thì maTran[3][1] = 0.
        i = 3, j = 2, coCanh(D, C) = true thì maTran[3][2] = 1.
        i = 3, j = 3, coCanh(D, D) = false thì maTran[3][3] = 0.
        Vậy ta có: 
        maTran = [
        [0,1,0,1],
        [1,0,1,0],
        [0,1,0,1],
        [1,0,1,0],
        ];
        */
    }
  }
  return maTran; // Trả về mảng 2 chiều maTran
}

function hienThiMaTran() {
  // Hàm này hiển thị mảng ma trận ra HTML
  const maTran = taoMaTran(); // Khai báo mảng ma trận
  const table = document.getElementById("maTran"); // Lấy phần tử maTran bên HTML
  table.innerHTML = ""; // Đảm bảo phần tử đó rỗng

  // Tạo hàng tiêu đề cho bảng ma trận
  const tenDinh = document.createElement("tr");
  tenDinh.innerHTML =
    "<th></th>" +
    cacDinh
      .map(function (dinh) {
        // .map là phương thức thực hiện một hàm cho mỗi phần tử trong mảng và trả về một mảng mới.
        return `<th>${dinh}</th>`;
      })
      .join("");
  // .join biến đổi một mảng nhiều string thành một string. VD: cacDinh = ["A","B","C","D"] thì sau khi join sẽ thành "A B C D"
  /* 
      VD: cacDinh = [A, B, C, D]
      tenDinh.innerHTML = "<th></th><th>A</th><th>B</th><th>C</th><th>D</th>"
    */
  table.appendChild(tenDinh); // Thêm tenDinh vào table

  // Tạo hàng cho mỗi phần tử trong mảng ma trận
  maTran.forEach(function (hangNgang, index) {
    const hangTable = document.createElement("tr");
    hangTable.innerHTML =
      `<th>${cacDinh[index]}</th>` +
      hangNgang
        .map(function (value) {
          // .map là phương thức thực hiện một hàm cho mỗi phần tử trong mảng và trả về một mảng mới.
          return `<td>${value}</td>`;
        })
        .join("");
    // .join biến đổi một mảng nhiều string thành một string. VD: cacDinh = ["A","B","C","D"] thì sau khi join sẽ thành "A B C D"

    /* 
        VD: maTran = [
          [0, 1, 0, 1],
          [1, 0, 1, 0],
          [0, 1, 0, 1],
          [1, 0, 1, 0]
        ]
        hangTable.innerHTML = "<th>A</th><td>0</td><td>1</td><td>0</td><td>1</td>"
      */
    table.appendChild(hangTable); // Thêm hangTable vào table
  });
}
