import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from 'src/users/services/users.service';
import { MailService } from './mail.service';

@Injectable()
export class CronjobsService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}
  private readonly logger = new Logger(CronjobsService.name);

  // Schedule the task to run every day at 8 AM
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendMorningMessage() {
    const users = await this.userService.findAll();
    console.log({ users });

    for (const user of users) {
      this.logger.debug(`sending to ${user.email}`);
      const message = `Good Morning ${user.name}, welcome to the Restaurants App! We hope you have a great day ahead.`;
      await this.mailService.sendEmail(user.email, 'Good morning!', message);
    }
  }
}
