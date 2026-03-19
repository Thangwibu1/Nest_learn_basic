---
to: <%= path %>/<%= name %>/interfaces/<%= name %>.repository.interface.ts
---
import { Create<%= h.changeCase.pascal(name) %>Dto } from '../dtos/create-<%= name %>.dto';
import { Update<%= h.changeCase.pascal(name) %>Dto } from '../dtos/update-<%= name %>.dto';
import { <%= h.changeCase.pascal(name) %>Type } from '../types/<%= name %>.type';

export interface I<%= h.changeCase.pascal(name) %>Repository {
  create(dto: Create<%= h.changeCase.pascal(name) %>Dto): Promise<<%= h.changeCase.pascal(name) %>Type>;
  findById(id: number): Promise<<%= h.changeCase.pascal(name) %>Type | null>;
  update(id: number, dto: Update<%= h.changeCase.pascal(name) %>Dto): Promise<<%= h.changeCase.pascal(name) %>Type>;
}
