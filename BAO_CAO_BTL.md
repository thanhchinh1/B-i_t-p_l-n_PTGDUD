# BÁO CÁO BÀI TẬP LỚN
**Môn học:** Phát triển giao diện ứng dụng
**Nhóm thực hiện:** Nhóm 11
**Tên đề tài:** Xây dựng nền tảng học trực tuyến (EduPlatform)

---

## 1. MỞ ĐẦU
### 1.1. Lý do chọn đề tài
Trong thời đại công nghệ số hiện nay, học trực tuyến (E-learning) đang trở thành xu hướng tất yếu. Nhu cầu về một nền tảng học tập không chỉ đáp ứng đủ tính năng mà còn phải có giao diện trực quan, hiện đại, và thân thiện với người dùng ngày càng cao. Vì vậy, Nhóm 11 quyết định chọn đề tài "Xây dựng nền tảng học trực tuyến - EduPlatform" nhằm áp dụng các kiến thức đã học trong môn *Phát triển giao diện ứng dụng* để tạo ra một sản phẩm thực tế, có tính ứng dụng cao.

### 1.2. Mục tiêu dự án
- Xây dựng một ứng dụng web (Single Page Application) hoàn chỉnh với hiệu năng cao.
- Thiết kế giao diện (UI/UX) hiện đại, bám sát các xu hướng thiết kế mới nhất (Dark Mode, Glassmorphism).
- Đảm bảo tính tương thích trên nhiều thiết bị (Responsive Design: Mobile, Tablet, Desktop).
- Phân quyền người dùng rõ ràng (Admin và Student).

---

## 2. CÔNG NGHỆ SỬ DỤNG
Dự án được xây dựng hoàn toàn dựa trên các công nghệ web hiện đại nhất hiện nay:
- **Frontend Framework:** React.js kết hợp với Vite (giúp tốc độ build và hot-reload cực kỳ nhanh).
- **Styling:** Tailwind CSS v4 (Utility-first CSS framework giúp xây dựng giao diện nhanh chóng và nhất quán).
- **Quản lý trạng thái (State Management):** Zustand (gọn nhẹ, dễ sử dụng hơn Redux).
- **Routing:** React Router v7 (Xử lý điều hướng trang không cần load lại).
- **Backend & Database:** Firebase Authentication (Xử lý đăng nhập/đăng ký) và Firebase Firestore (Cơ sở dữ liệu NoSQL thời gian thực).
- **Lưu trữ hình ảnh:** Cloudinary (Hỗ trợ upload và tối ưu hóa hình ảnh qua CDN).
- **Thư viện UI phụ trợ:** 
  - `lucide-react`: Hệ thống icon vector tinh tế.
  - `recharts`: Vẽ biểu đồ thống kê trực quan.
  - `sonner`: Hiển thị thông báo (Toast notifications) mượt mà.
  - `react-hook-form` & `zod`: Xử lý và xác thực dữ liệu biểu mẫu (Form validation).

---

## 3. TÍNH NĂNG & THIẾT KẾ GIAO DIỆN (UI/UX)
Dự án được chú trọng đặc biệt vào trải nghiệm người dùng, sử dụng tông màu tối (Dark Mode) làm chủ đạo để mang lại cảm giác "Premium", chuyên nghiệp và bảo vệ mắt người dùng.

### 3.1. Phân hệ Xác thực (Authentication)
- **Đăng nhập / Đăng ký:** Giao diện thẻ form ở chính giữa màn hình.
- Ứng dụng công nghệ kiểm tra dữ liệu bằng Zod (hiển thị lỗi màu đỏ ngay lập tức nếu nhập sai email hoặc mật khẩu quá ngắn).
- Xử lý trạng thái Loading khi gọi API Firebase.

### 3.2. Phân hệ Bảng điều khiển (Dashboard)
- Hiển thị các chỉ số tổng quan: Tổng số học viên, Khóa học đang hoạt động, Lượt ghi danh, và Tổng doanh thu. Các chỉ số này được tính toán **thực tế 100%** từ dữ liệu trong Firestore.
- **Biểu đồ tăng trưởng (Growth Statistics):** Sử dụng Recharts để vẽ biểu đồ dạng Area có đổ bóng gradient rất đẹp mắt.
- **Hoạt động gần đây (Recent Activity):** Liệt kê danh sách 5 học viên mới đăng ký khóa học gần nhất.

### 3.3. Phân hệ Quản lý Khóa học (Course Management)
- **Danh sách khóa học (Course List):** Hiển thị dạng Grid Card. Có thanh tìm kiếm (Search) hoạt động tức thì để lọc khóa học theo tên hoặc mô tả.
- **Thêm/Sửa khóa học (Create/Edit Course):**
  - Form điền thông tin chi tiết (Tiêu đề, mô tả, giá, thời lượng).
  - Tích hợp khu vực kéo thả ảnh (Drag & Drop). Hình ảnh được tải thẳng lên **Cloudinary** để đảm bảo tốc độ tải trang nhanh nhất.
- **Xóa khóa học:** Có cửa sổ xác nhận (Confirm) để tránh xóa nhầm.

### 3.4. Phân hệ Học viên (Student View)
- **Chi tiết khóa học (Course Detail):** Trang landing page thu nhỏ cho mỗi khóa học. Hiển thị ảnh bìa lớn, thông tin chi tiết và nút "Enroll Now".
- **Ghi danh (Enroll):** Chỉ bằng 1 nút bấm, học viên được ghi danh vào hệ thống.
- **My Learning:** Nơi học viên theo dõi danh sách các khóa học mình đã đăng ký.

### 3.5. Phân hệ Quản trị viên (Admin View)
- **Quản lý người dùng (User Management):** Một bảng danh sách toàn bộ người dùng trong hệ thống.
- Chức năng thay đổi quyền (Role): Admin có thể cấp quyền Admin cho người khác hoặc giáng cấp xuống thành User.
- Tính năng bảo vệ: Không cho phép Admin tự xóa chính tài khoản của mình.

---

## 4. KẾT LUẬN & HƯỚNG PHÁT TRIỂN
### 4.1. Kết luận
Nhóm 11 đã hoàn thành xuất sắc các mục tiêu đề ra cho môn học Phát triển giao diện ứng dụng. Ứng dụng **EduPlatform** không chỉ dừng lại ở mức độ giao diện HTML/CSS cơ bản mà đã trở thành một nền tảng Web App hoàn chỉnh có kết nối cơ sở dữ liệu thực, quản lý trạng thái, và có thể đem vào triển khai (Deploy) thực tế.

### 4.2. Hướng phát triển trong tương lai
Nếu có thêm thời gian, nhóm sẽ tiếp tục mở rộng các chức năng sau:
- Tích hợp Video Player để học viên có thể xem video bài giảng trực tiếp.
- Xây dựng hệ thống bài tập trắc nghiệm (Quiz) cuối mỗi chương.
- Thêm tính năng thanh toán (Payment Gateway) thực tế như Stripe hoặc VNPay thay vì ghi danh miễn phí.
- Cho phép người dùng chuyển đổi (Toggle) giữa chế độ Light Mode và Dark Mode.

---
*(Báo cáo được biên soạn để phục vụ việc bảo vệ Đồ án/Bài tập lớn môn Phát triển giao diện ứng dụng).*
