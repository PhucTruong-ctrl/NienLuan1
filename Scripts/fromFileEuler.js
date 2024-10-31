// Các biến toàn cục
let noiDungFile = ""; // Lưu nội dung của file txt
let daChonFile = false; // Đánh dấu trạng thái đã chọn file hay chưa

/* Hàm này đọc nội dung file txt được chọn.
   VD: Đọc file "input.txt" có nội dung:
   4
   1 2
   2 3
   3 4
   4 1
   Hàm sẽ trả về chuỗi chứa toàn bộ nội dung trên */
function docFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

/* Hàm này lắng nghe sự kiện khi người dùng chọn file.
   VD: Khi người dùng chọn file "input.txt":
   - Đọc nội dung file và lưu vào biến noiDungFile
   - Đánh dấu daChonFile = true 
   - In thông báo đã đọc file thành công */
document
  .getElementById("file-input")
  .addEventListener("change", async function (event) {
    const file = event.target.files[0];
    if (file) {
      try {
        noiDungFile = await docFile(file);
        daChonFile = true;
        console.log("Đã đọc file thành công");
      } catch (error) {
        console.error("Lỗi khi đọc file:", error);
        daChonFile = false;
      }
    }
  });

/* Hàm này vẽ đồ thị từ nội dung file txt.
   VD: Khi nhấn nút Vẽ:
   - Nếu đã chọn file: in nội dung file đã lưu
   - Nếu chưa chọn: đọc file trong input
   - Nếu không có file: thông báo lỗi */
async function veDoThi() {
  if (daChonFile && noiDungFile) {
    console.log("Nội dung file:");
    console.log(noiDungFile);
    // Code xử lý và vẽ đồ thị sẽ được thêm vào đây
  } else {
    const fileInput = document.getElementById("file-input");
    const file = fileInput.files[0];

    if (file) {
      try {
        noiDungFile = await docFile(file);
        daChonFile = true;
        console.log("Nội dung file:");
        console.log(noiDungFile);
        // Code xử lý và vẽ đồ thị sẽ được thêm vào đây
      } catch (error) {
        console.error("Lỗi khi đọc file:", error);
      }
    } else {
      console.log("Vui lòng chọn file trước khi vẽ");
    }
  }
}
