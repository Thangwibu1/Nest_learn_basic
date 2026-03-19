# NESTJS PROJECT GUIDELINE (NEW)

## Dự án Student - Course - RegisCourse theo SOLID

> Phiên bản guideline: **NEW - viết mới hoàn toàn**  
> Công nghệ: **NestJS + PostgreSQL + Redis + TypeORM**  
> Mục tiêu: dễ hiểu, dễ maintain, dễ scale, đúng SOLID.

---

## MỤC LỤC

1. [Mục tiêu và phạm vi](#1-mục-tiêu-và-phạm-vi)
2. [Mô hình nghiệp vụ & quan hệ dữ liệu](#2-mô-hình-nghiệp-vụ--quan-hệ-dữ-liệu)
3. [Kiến trúc tổng thể theo SOLID](#3-kiến-trúc-tổng-thể-theo-solid)
4. [Folder structure chuẩn production](#4-folder-structure-chuẩn-production)
5. [Giải thích chi tiết công dụng từng folder](#5-giải-thích-chi-tiết-công-dụng-từng-folder)
6. [Các file chính trong từng module](#6-các-file-chính-trong-từng-module)
7. [Thiết kế Entity + Migration + Index](#7-thiết-kế-entity--migration--index)
8. [Áp dụng Redis cache đúng cách](#8-áp-dụng-redis-cache-đúng-cách)
9. [Lifecycle đầy đủ của một request controller](#9-lifecycle-đầy-đủ-của-một-request-controller)
10. [Checklist triển khai feature mới](#10-checklist-triển-khai-feature-mới)
11. [Convention code + naming + error handling](#11-convention-code--naming--error-handling)
12. [Kết luận](#12-kết-luận)

---

## 1) Mục tiêu và phạm vi

Guideline này phục vụ cho dự án quản lý đăng ký khóa học với 3 domain:

- `student`
- `course`
- `regis_course` (bảng đăng ký)

Yêu cầu bắt buộc:

- `student` quan hệ **1 - N** với `regis_course`
- `course` quan hệ **1 - N** với `regis_course`
- Tổ chức folder theo nguyên tắc SOLID
- Tách bạch business layer và infrastructure layer
- Hỗ trợ cache qua Redis
- Dễ unit test / e2e test

---

## 2) Mô hình nghiệp vụ & quan hệ dữ liệu

### 2.1 Vì sao dùng bảng `regis_course` riêng?

Về bản chất `student` và `course` là N-N, nhưng vì cần lưu thêm dữ liệu nghiệp vụ đăng ký (status, điểm, ngày đăng ký...), ta tách thành entity trung gian `regis_course`.

### 2.2 Quan hệ chính xác

- `student (1) ---- (N) regis_course`
- `course  (1) ---- (N) regis_course`

### 2.3 Các cột thường gặp

- `students`: id, code, full_name, email, dob, created_at, updated_at
- `courses`: id, code, title, credit, is_active, created_at, updated_at
- `regis_courses`: id, student_id, course_id, status, registered_at, score, created_at, updated_at

### 2.4 Ràng buộc quan trọng

- Unique: `(student_id, course_id)` để tránh đăng ký trùng
- FK: `student_id -> students.id`, `course_id -> courses.id`
- Index: `student_id`, `course_id`, `status`, `(student_id, status)`

---

## 3) Kiến trúc tổng thể theo SOLID

## 3.1 S — Single Responsibility Principle

- Controller chỉ xử lý giao tiếp HTTP.
- Service chỉ xử lý nghiệp vụ.
- Repository chỉ truy cập dữ liệu.
- Mapper chỉ map object.
- DTO chỉ validate/shape dữ liệu input-output.

## 3.2 O — Open/Closed Principle

Mở rộng bằng cách thêm class mới thay vì sửa class cũ:

- Thêm `RedisRegisCourseCache` mà không cần sửa lớn trong service.

## 3.3 L — Liskov Substitution Principle

Service chỉ phụ thuộc interface, nên implementation thay thế được:

- `RegisCourseTypeOrmRepository` ↔ `RegisCoursePrismaRepository`.

## 3.4 I — Interface Segregation Principle

Interface nhỏ, đúng mục đích:

- Interface query khác command nếu cần.

## 3.5 D — Dependency Inversion Principle (cốt lõi)

- Service inject **token/interface**, không inject trực tiếp ORM repository.
- Module wiring `provide/useClass` để map abstraction -> implementation.

---

## 4) Folder structure chuẩn production

```text
project-root/
├── package.json
├── tsconfig.json
├── .env
├── .env.example
└── src/
    ├── main.ts
    ├── app.module.ts
    │
    ├── config/
    │   ├── configuration.ts
    │   ├── env.validation.ts
    │   └── index.ts
    │
    ├── common/
    │   ├── constants/
    │   │   ├── di-token.constant.ts
    │   │   ├── cache-key.constant.ts
    │   │   └── app.constant.ts
    │   ├── decorators/
    │   │   └── request-id.decorator.ts
    │   ├── exceptions/
    │   │   ├── domain.exception.ts
    │   │   └── error-code.enum.ts
    │   ├── filters/
    │   │   └── all-exception.filter.ts
    │   ├── guards/
    │   │   ├── jwt-auth.guard.ts
    │   │   └── roles.guard.ts
    │   ├── interceptors/
    │   │   ├── logging.interceptor.ts
    │   │   ├── timeout.interceptor.ts
    │   │   └── response.interceptor.ts
    │   ├── middleware/
    │   │   └── request-id.middleware.ts
    │   ├── pipes/
    │   │   ├── validation.pipe.ts
    │   │   └── parse-int-id.pipe.ts
    │   ├── types/
    │   │   └── api-response.type.ts
    │   └── utils/
    │       ├── date.util.ts
    │       └── string.util.ts
    │
    ├── infrastructure/
    │   ├── database/
    │   │   ├── database.module.ts
    │   │   ├── typeorm.config.ts
    │   │   ├── entities/
    │   │   │   ├── student.entity.ts
    │   │   │   ├── course.entity.ts
    │   │   │   └── regis-course.entity.ts
    │   │   ├── migrations/
    │   │   │   ├── 1710000000000-create-students.ts
    │   │   │   ├── 1710000000001-create-courses.ts
    │   │   │   └── 1710000000002-create-regis-courses.ts
    │   │   └── seeders/
    │   │       └── seed.dev.ts
    │   ├── redis/
    │   │   ├── redis.module.ts
    │   │   ├── redis.service.ts
    │   │   └── redis-key.factory.ts
    │   └── logger/
    │       ├── logger.module.ts
    │       └── logger.service.ts
    │
    ├── modules/
    │   ├── student/
    │   │   ├── controllers/
    │   │   │   └── student.controller.ts
    │   │   ├── services/
    │   │   │   └── student.service.ts
    │   │   ├── dtos/
    │   │   │   ├── create-student.dto.ts
    │   │   │   ├── update-student.dto.ts
    │   │   │   ├── query-student.dto.ts
    │   │   │   └── student-response.dto.ts
    │   │   ├── interfaces/
    │   │   │   └── student.repository.interface.ts
    │   │   ├── repositories/
    │   │   │   └── student.typeorm.repository.ts
    │   │   ├── mappers/
    │   │   │   └── student.mapper.ts
    │   │   ├── types/
    │   │   │   └── student.type.ts
    │   │   └── student.module.ts
    │   │
    │   ├── course/
    │   │   ├── controllers/
    │   │   │   └── course.controller.ts
    │   │   ├── services/
    │   │   │   └── course.service.ts
    │   │   ├── dtos/
    │   │   │   ├── create-course.dto.ts
    │   │   │   ├── update-course.dto.ts
    │   │   │   ├── query-course.dto.ts
    │   │   │   └── course-response.dto.ts
    │   │   ├── interfaces/
    │   │   │   └── course.repository.interface.ts
    │   │   ├── repositories/
    │   │   │   └── course.typeorm.repository.ts
    │   │   ├── mappers/
    │   │   │   └── course.mapper.ts
    │   │   ├── types/
    │   │   │   └── course.type.ts
    │   │   └── course.module.ts
    │   │
    │   └── regis-course/
    │       ├── controllers/
    │       │   └── regis-course.controller.ts
    │       ├── services/
    │       │   └── regis-course.service.ts
    │       ├── dtos/
    │       │   ├── register-course.dto.ts
    │       │   ├── update-regis-course.dto.ts
    │       │   ├── query-regis-course.dto.ts
    │       │   └── regis-course-response.dto.ts
    │       ├── interfaces/
    │       │   └── regis-course.repository.interface.ts
    │       ├── repositories/
    │       │   └── regis-course.typeorm.repository.ts
    │       ├── mappers/
    │       │   └── regis-course.mapper.ts
    │       ├── types/
    │       │   ├── regis-course.type.ts
    │       │   └── regis-course-status.enum.ts
    │       └── regis-course.module.ts
    │
    └── tests/
        ├── unit/
        │   ├── student.service.spec.ts
        │   ├── course.service.spec.ts
        │   └── regis-course.service.spec.ts
        └── e2e/
            └── regis-course.e2e-spec.ts
```

---

## 5) Giải thích chi tiết công dụng từng folder

## 5.1 `src/main.ts`

- Điểm khởi động ứng dụng Nest.
- Setup global prefix (`/api/v1`), global pipes, global filters, CORS, swagger.

## 5.2 `src/app.module.ts`

- Module root, import config/database/redis và các feature module.

## 5.3 `src/config`

- `configuration.ts`: đọc env và trả object typed.
- `env.validation.ts`: validate env bằng Joi/Zod.
- `index.ts`: export helper gọn gàng.

**Ý nghĩa:** tránh lỗi runtime do sai biến môi trường.

## 5.4 `src/common`

Nơi tái sử dụng toàn hệ thống.

- `constants`: token DI, hằng số cache, app settings.
- `decorators`: custom decorators.
- `exceptions`: exception theo domain và error code chuẩn.
- `filters`: chuẩn hóa lỗi đầu ra.
- `guards`: auth/role.
- `interceptors`: logging/timeout/response formatting.
- `middleware`: request id, tracing.
- `pipes`: parse/validate dữ liệu đầu vào.
- `types`: kiểu dữ liệu dùng chung.
- `utils`: hàm tiện ích thuần.

## 5.5 `src/infrastructure`

Nơi chứa adapter công nghệ cụ thể.

### `database`

- Chứa TypeORM config, entities, migration, seed.
- Không đặt business logic ở đây.

### `redis`

- Cung cấp redis client và helper read/write cache.
- Chuẩn hóa key + TTL.

### `logger`

- Cấu hình logger để theo dõi request, lỗi, performance.

## 5.6 `src/modules`

Mỗi folder module là một bounded context theo nghiệp vụ.

### `student`

- API + business + repository liên quan học viên.

### `course`

- API + business + repository liên quan khóa học.

### `regis-course`

- Trái tim nghiệp vụ đăng ký, liên kết student-course.

## 5.7 `src/tests`

- `unit`: test logic từng service/class.
- `e2e`: test luồng thực tế từ endpoint -> DB.

---

## 6) Các file chính trong từng module

Để bạn dễ hình dung, dưới đây là vai trò từng file (áp dụng cho cả `student`, `course`, `regis-course`):

### 6.1 `controllers/*.controller.ts`

- Nhận request, parse param/query/body.
- Gọi service.
- Trả response theo HTTP contract.
- Không chứa business rule.

### 6.2 `services/*.service.ts`

- Chứa luật nghiệp vụ.
- Chứa transaction boundary (khi cần).
- Gọi repository interfaces.
- Có thể gọi redis service để cache/invalidate.

### 6.3 `dtos/*.dto.ts`

- Validate payload với `class-validator`.
- Tạo contract rõ ràng giữa client và server.

### 6.4 `interfaces/*.repository.interface.ts`

- Khai báo các method abstraction:
  - findById
  - create
  - update
  - paginate
  - existsBy...

### 6.5 `repositories/*.typeorm.repository.ts`

- Implement interface bằng TypeORM.
- Query DB bằng repository/query builder.
- Mapping entity <-> domain model (qua mapper nếu cần).

### 6.6 `mappers/*.mapper.ts`

- Convert giữa:
  - Entity -> Domain Type
  - Domain Type -> Response DTO

### 6.7 `types/*.type.ts`

- Định nghĩa model business độc lập ORM.
- Giữ service không phụ thuộc chi tiết entity.

### 6.8 `<feature>.module.ts`

- Nơi wiring providers theo DIP:
  - provide token
  - bind useClass
  - export service nếu module khác cần dùng

---

## 7) Thiết kế Entity + Migration + Index

## 7.1 Gợi ý entity comment đầy đủ

### StudentEntity

- Có trường cơ bản và relation `OneToMany` tới `regisCourses`.
- Không nhét logic nghiệp vụ vào entity.

### CourseEntity

- Có relation `OneToMany` tới `regisCourses`.

### RegisCourseEntity

- Có `ManyToOne` tới student.
- Có `ManyToOne` tới course.
- Có status (PENDING/APPROVED/CANCELLED chẳng hạn).

## 7.2 Migrations nên tách nhỏ

- Migration 1: tạo `students`
- Migration 2: tạo `courses`
- Migration 3: tạo `regis_courses` + FK + unique + index

## 7.3 Chiến lược production

- Không dùng `synchronize: true` ở production.
- Mọi thay đổi schema phải qua migration.
- Dùng rollback script khi deploy.

---

## 8) Áp dụng Redis cache đúng cách

## 8.1 Cache ở đâu?

- Danh sách course thường truy cập.
- Chi tiết student theo id.
- Danh sách đăng ký theo student.

## 8.2 Khi nào invalidate cache?

- Tạo đăng ký mới: xóa cache danh sách đăng ký của student.
- Hủy đăng ký: xóa cache list liên quan.
- Update course/student: xóa cache detail tương ứng.

## 8.3 Quy tắc key naming

- `student:detail:{studentId}`
- `course:detail:{courseId}`
- `regis-course:student:{studentId}:page:{page}:size:{size}`

## 8.4 TTL gợi ý

- Detail: 5-15 phút
- List: 1-5 phút
- Counter/stat: 30-60 giây

---

## 9) Lifecycle đầy đủ của một request controller

Đây là flow đầy đủ nhất trong NestJS (rất quan trọng).

## 9.1 Flow tổng quan theo thứ tự thực thi

1. **Incoming request** từ client.
2. **Middleware** chạy trước (gắn request-id, log thô...).
3. **Guards** kiểm tra auth/role.
4. **Interceptors (before)** chạy trước handler.
5. **Pipes** validate/transform params/body/query.
6. **Controller handler** nhận args đã chuẩn hóa.
7. **Service layer** xử lý nghiệp vụ.
8. **Repository layer** truy xuất PostgreSQL qua TypeORM.
9. **Redis layer** get/set/invalidate cache (nếu có).
10. **Interceptors (after)** transform/format output.
11. **Exception filters** bắt lỗi và chuẩn hóa response lỗi.
12. **Outgoing response** trả client.

## 9.2 Minh họa thực tế endpoint `POST /regis-courses`

### Bước A - Middleware

- Tạo `requestId`.
- Log method/url/body size.

### Bước B - Guard

- Kiểm tra JWT hợp lệ.
- Kiểm tra role được phép đăng ký.

### Bước C - Pipe

- Validate `RegisterCourseDto`.
- Nếu thiếu `studentId` hoặc `courseId` => 400 ngay.

### Bước D - Controller

- Gọi `regisCourseService.register(dto)`.

### Bước E - Service

- Kiểm tra student tồn tại chưa.
- Kiểm tra course tồn tại chưa.
- Kiểm tra unique (đã đăng ký chưa).
- Tạo bản ghi `regis_course`.
- Invalidate cache liên quan.

### Bước F - Repository

- Execute query insert/select.
- Trả dữ liệu đã map.

### Bước G - Interceptor after

- Bọc response thành format thống nhất:
  - `{ success: true, data, meta }`

### Bước H - Exception Filter (nếu lỗi)

- Chuẩn hóa lỗi:
  - `{ success: false, errorCode, message, path, timestamp }`

## 9.3 Thứ tự khi có nhiều guard/interceptor/pipe

- Guard: Global -> Controller -> Method.
- Interceptor:
  - Before: Global -> Controller -> Method.
  - After: Method -> Controller -> Global.
- Pipe:
  - Chạy khi resolve từng param của method.

## 9.4 Nơi phù hợp để đặt logic

- Validation input format: Pipe/DTO.
- Authorization: Guard.
- Business rule: Service.
- Data access: Repository.
- Format output/logging/metrics: Interceptor.
- Chuẩn hóa lỗi: Exception Filter.

---

## 10) Checklist triển khai feature mới

- [ ] Tạo folder module và các subfolder chuẩn.
- [ ] Viết DTO cho create/update/query/response.
- [ ] Viết interface repository.
- [ ] Viết TypeORM repository implementation.
- [ ] Viết service chứa business rule.
- [ ] Viết controller mỏng.
- [ ] Viết mapper entity-domain-response.
- [ ] Tạo DI token và wiring trong module.
- [ ] Đăng ký entity vào `TypeOrmModule.forFeature`.
- [ ] Tạo migration cho schema mới.
- [ ] Thêm cache strategy (nếu cần).
- [ ] Viết unit + e2e test.

---

## 11) Convention code + naming + error handling

## 11.1 Naming

- Folder module: danh từ số ít (`student`, `course`) hoặc chuẩn team thống nhất.
- DTO: `create-xxx.dto.ts`, `update-xxx.dto.ts`, `query-xxx.dto.ts`, `xxx-response.dto.ts`
- Interface: `xxx.repository.interface.ts`
- Repo impl: `xxx.typeorm.repository.ts`

## 11.2 Error Handling

- Dùng error code enum cố định.
- Domain error tách riêng (`domain.exception.ts`).
- Không throw string thô.

## 11.3 Logging

- Log có `requestId`.
- Log duration theo endpoint.
- Không log thông tin nhạy cảm.

## 11.4 API Response chuẩn hóa

Gợi ý format:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "...",
    "timestamp": "..."
  }
}
```

Lỗi:

```json
{
  "success": false,
  "errorCode": "REGIS_COURSE_ALREADY_EXISTS",
  "message": "Student already registered this course",
  "meta": {
    "requestId": "...",
    "timestamp": "..."
  }
}
```

---

## 12) Kết luận

Bạn có thể dùng guideline này như chuẩn team để dựng dự án thật:

- Đúng quan hệ `student/course` với `regis_course` (1-N ở cả hai phía).
- Đúng SOLID, đặc biệt SRP + DIP.
- Dễ nâng cấp, dễ bảo trì, dễ onboarding.
- Có đầy đủ lifecycle request để debug/monitor hệ thống.

Nếu bạn muốn, bước tiếp theo mình có thể tạo luôn **skeleton code thực thi** theo đúng doc này (đủ module + entity + migration + redis + endpoint CRUD cơ bản).
