export class CourseResponseDto {
  // DTO trả về cho client, giúp không lộ cấu trúc Entity nội bộ.
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

