---
to: <%= path %>/<%= name %>/<%= name %>.module.ts
---
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { <%= h.changeCase.pascal(name) %>Controller } from './controllers/<%= name %>.controller';
import { <%= h.changeCase.pascal(name) %>Service } from './services/<%= name %>.service';
import { <%= h.changeCase.pascal(name) %>TypeOrmRepository } from './repositories/<%= name %>.typeorm.repository';

// TODO: Đổi sang token constant chung trong common/constants nếu bạn đã có sẵn.
export const <%= h.changeCase.constant(name) %>_REPOSITORY = '<%= h.changeCase.constant(name) %>_REPOSITORY';

@Module({
  imports: [
    // TODO: thay bằng Entity thực tế của bạn.
    TypeOrmModule.forFeature([]),
  ],
  controllers: [<%= h.changeCase.pascal(name) %>Controller],
  providers: [
    <%= h.changeCase.pascal(name) %>Service,
    {
      provide: <%= h.changeCase.constant(name) %>_REPOSITORY,
      useClass: <%= h.changeCase.pascal(name) %>TypeOrmRepository,
    },
  ],
  exports: [<%= h.changeCase.pascal(name) %>Service],
})
export class <%= h.changeCase.pascal(name) %>Module {}
