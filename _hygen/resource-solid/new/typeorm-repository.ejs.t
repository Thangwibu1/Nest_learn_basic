---
to: <%= path %>/<%= name %>/repositories/<%= name %>.typeorm.repository.ts
---
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { I<%= h.changeCase.pascal(name) %>Repository } from '../interfaces/<%= name %>.repository.interface';
import { Create<%= h.changeCase.pascal(name) %>Dto } from '../dtos/create-<%= name %>.dto';
import { Update<%= h.changeCase.pascal(name) %>Dto } from '../dtos/update-<%= name %>.dto';
import { <%= h.changeCase.pascal(name) %>Type } from '../types/<%= name %>.type';

// TODO: thay bằng Entity thực tế của bạn
// import { <%= h.changeCase.pascal(name) %>Entity } from '../../../infrastructure/database/entities/<%= name %>.entity';

type RawEntity = any;

@Injectable()
export class <%= h.changeCase.pascal(name) %>TypeOrmRepository implements I<%= h.changeCase.pascal(name) %>Repository {
  constructor(
    // TODO: đổi Object thành Entity tương ứng.
    @InjectRepository(Object)
    private readonly ormRepo: Repository<RawEntity>,
  ) {}

  async create(dto: Create<%= h.changeCase.pascal(name) %>Dto): Promise<<%= h.changeCase.pascal(name) %>Type> {
    const entity = this.ormRepo.create(dto as unknown as RawEntity);
    const saved = await this.ormRepo.save(entity);
    return saved as <%= h.changeCase.pascal(name) %>Type;
  }

  async findById(id: number): Promise<<%= h.changeCase.pascal(name) %>Type | null> {
    const found = await this.ormRepo.findOne({ where: { id } as any });
    return (found as <%= h.changeCase.pascal(name) %>Type) ?? null;
  }

  async update(id: number, dto: Update<%= h.changeCase.pascal(name) %>Dto): Promise<<%= h.changeCase.pascal(name) %>Type> {
    await this.ormRepo.update(id, dto as unknown as RawEntity);
    const updated = await this.ormRepo.findOne({ where: { id } as any });
    return updated as <%= h.changeCase.pascal(name) %>Type;
  }
}
