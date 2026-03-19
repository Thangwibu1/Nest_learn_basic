---
to: <%= path %>/<%= name %>/dtos/update-<%= name %>.dto.ts
---
import { PartialType } from '@nestjs/mapped-types';
import { Create<%= h.changeCase.pascal(name) %>Dto } from './create-<%= name %>.dto';

export class Update<%= h.changeCase.pascal(name) %>Dto extends PartialType(Create<%= h.changeCase.pascal(name) %>Dto) {}
