---
to: <%= path %>/<%= name %>/controllers/<%= name %>.controller.ts
---
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { <%= h.changeCase.pascal(name) %>Service } from '../services/<%= name %>.service';
import { Create<%= h.changeCase.pascal(name) %>Dto } from '../dtos/create-<%= name %>.dto';
import { Update<%= h.changeCase.pascal(name) %>Dto } from '../dtos/update-<%= name %>.dto';

@Controller('<%= name %>')
export class <%= h.changeCase.pascal(name) %>Controller {
  constructor(private readonly service: <%= h.changeCase.pascal(name) %>Service) {}

  @Post()
  create(@Body() dto: Create<%= h.changeCase.pascal(name) %>Dto) {
    // Controller chỉ nhận request và gọi service.
    return this.service.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Update<%= h.changeCase.pascal(name) %>Dto) {
    return this.service.update(Number(id), dto);
  }
}
