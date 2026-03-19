---
to: <%= path %>/<%= name %>/dtos/create-<%= name %>.dto.ts
---
import { IsNotEmpty, IsString } from 'class-validator';

export class Create<%= h.changeCase.pascal(name) %>Dto {
  // TODO: thay bằng các field thực tế của domain.
  @IsString()
  @IsNotEmpty()
  name: string;
}

