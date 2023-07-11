import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { UserModule } from 'src/users/users.module';
import { MailService } from './mail.service';

@Module({
  imports: [UserModule],
  providers: [CronjobsService, MailService],
})
export class CronjobsModule {}
