---
to: <%= path %>/<%= name %>/dtos/<%= name %>-response.dto.ts
---
export class <%= h.changeCase.pascal(name) %>ResponseDto {
  // DTO trả về cho client, giúp không lộ cấu trúc Entity nội bộ.
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

