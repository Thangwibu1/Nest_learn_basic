import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ItemsModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
