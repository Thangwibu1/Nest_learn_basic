import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ItemsService {
  // Dùng đường dẫn tuyệt đối dựa trên vị trí file build để ổn định hơn process.cwd()
  private readonly filePath = path.resolve(__dirname, '..', '..', 'data', 'items.json');
  private readData() {
    const raw = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(raw);
  }

  private writeData(data: any[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  findAll() {
    return this.readData();
  }

  findOne(id: number) {
    const items = this.readData();
    const item = items.find((i) => i.id === id);
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  create(body: any) {
    const items = this.readData();
    const newItem = { id: Date.now(), ...body };
    items.push(newItem);
    this.writeData(items);
    return newItem;
  }

  update(id: number, body: any) {
    const items = this.readData();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new NotFoundException('Item not found');
    items[index] = { ...items[index], ...body };
    this.writeData(items);
    return items[index];
  }

  remove(id: number) {
    const items = this.readData();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new NotFoundException('Item not found');
    const removed = items.splice(index, 1);
    this.writeData(items);
    return removed[0];
  }
}
