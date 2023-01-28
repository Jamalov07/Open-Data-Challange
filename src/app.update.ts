import { Action, Ctx, Hears, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { DriverService } from './driver.service';
import { MessageService } from './message.service';
import { UserService } from './user.service';

@Update()
export class AppUpdate {
  constructor(
    private readonly userService: UserService,
    private readonly driverService: DriverService,
    private readonly messageService: MessageService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    await this.userService.onStart(ctx);
  }

  @Hears("🇺🇿 O'zbek tili")
  async saveUzLang(@Ctx() ctx: Context) {
    await this.userService.saveLang(ctx, 'UZB');
  }

  @Hears('🇷🇺 Русский язык')
  async saveRusLang(@Ctx() ctx: Context) {
    await this.userService.saveLang(ctx, 'RUS');
  }

  @On('contact')
  async phoneNumber(@Ctx() ctx: Context) {
    await this.userService.onContact(ctx);
  }

  @Action('savedefaultname')
  async saveDefaultName(@Ctx() ctx: Context) {
    await this.userService.saveDefaultName(ctx);
  }
}
