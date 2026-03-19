---
to: <%= path %>/<%= name %>/services/<%= name %>.service.ts
---
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Create<%= h.changeCase.pascal(name) %>Dto } from '../dtos/create-<%= name %>.dto';
import { Update<%= h.changeCase.pascal(name) %>Dto } from '../dtos/update-<%= name %>.dto';
import { I<%= h.changeCase.pascal(name) %>Repository } from '../interfaces/<%= name %>.repository.interface';
import { <%= h.changeCase.constant(name) %>_REPOSITORY } from '../<%= name %>.module';

@Injectable()
export class <%= h.changeCase.pascal(name) %>Service {
  constructor(
    // DIP: Service phụ thuộc vào interface qua token, không phụ thuộc trực tiếp implementation.
    @Inject(<%= h.changeCase.constant(name) %>_REPOSITORY)
    private readonly repository: I<%= h.changeCase.pascal(name) %>Repository,
  ) {}

  async create(dto: Create<%= h.changeCase.pascal(name) %>Dto) {
    return this.repository.create(dto);
  }

  async findOne(id: number) {
    const found = await this.repository.findById(id);
    if (!found) throw new NotFoundException('<%= h.changeCase.pascal(name) %> not found');
    return found;
  }

  async update(id: number, dto: Update<%= h.changeCase.pascal(name) %>Dto) {
    await this.findOne(id);
    return this.repository.update(id, dto);
  }
}
