import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/repositories/repository.module';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';

@Module({
    imports: [RepositoryModule],
    controllers: [DemoController],
    providers: [DemoService],
    exports: []
})
export class DemoModule { }
