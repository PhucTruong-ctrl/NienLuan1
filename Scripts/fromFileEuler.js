document.getElementById("file-input").addEventListener("change", function () {
  let fr = new FileReader();
  const fileName = document.getElementById("fileSelected");

  fileName.innerHTML = "Bạn đã chọn file: " + this.files[0].name;

  $("#ketLuan").show();

  fr.onload = function () {
    let file = fr.result;
    let noiDung = file.split(/\r?\n/).map((line) => line.trim());
    let soDinhDoc = parseInt(noiDung[0]);

    if (noiDung.length < 2) {
      alert("File không đủ nội dung");
      return;
    }

    if (isNaN(soDinhDoc) || soDinhDoc <= 2 || soDinhDoc > 12) {
      alert("Số đỉnh không hợp lệ (2 - 12).");
      return;
    }

    khoiTao();
    soDinh = soDinhDoc;
    taoDinh();

    for (let i = 1; i <= soDinh; i++) {
      const hang = noiDung[i].split(/\s+/).map(Number);
      for (let j = 0; j < hang.length; j++) {
        if (hang[j] == 1) {
          themCanh(cacDinh[i - 1], cacDinh[j]);
        }
      }
    }

    veCanvas();
    checkEuler();
    hienThiMaTran();
    timChuTrinhEuler();
    // console.log(soDinh);
    // console.log(noiDung);
    // console.log(cacDinh);
    // console.log(cacCanh);
  };
  fr.readAsText(this.files[0]);
});
