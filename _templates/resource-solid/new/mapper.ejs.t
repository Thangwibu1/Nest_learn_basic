---
to: <%= path %>/<%= name %>/mappers/<%= name %>.mapper.ts
---
import { <%= h.changeCase.pascal(name) %>Type } from '../types/<%= name %>.type';
import { <%= h.changeCase.pascal(name) %>ResponseDto } from '../dtos/<%= name %>-response.dto';

export class <%= h.changeCase.pascal(name) %>Mapper {
  static toResponse(type: <%= h.changeCase.pascal(name) %>Type): <%= h.changeCase.pascal(name) %>ResponseDto {
    return {
      id: type.id,
      name: type.name,
      createdAt: type.createdAt,
      updatedAt: type.updatedAt,
    };
  }
}
