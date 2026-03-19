import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentDto {
  // TODO: thay bằng các field thực tế của domain.
  @IsString()
  @IsNotEmpty()
  name: string;
}

