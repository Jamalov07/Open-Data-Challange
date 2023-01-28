import {
  Action,
  Command,
  Ctx,
  Hears,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
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

  @Hears("✅ Ro'yxatdan o'tish")
  async registrationUZ(@Ctx() ctx: Context) {
    await this.userService.registration(ctx);
  }

  @Hears('✅ Зарегистрироваться')
  async registrationRU(@Ctx() ctx: Context) {
    await this.userService.registration(ctx);
  }

  @On('contact')
  async phoneNumber(@Ctx() ctx: Context) {
    await this.userService.onContact(ctx);
  }

  @Action('savedefaultname')
  async saveDefaultName(@Ctx() ctx: Context) {
    await this.userService.saveDefaultName(ctx);
  }

  @Action('savedefaultphone')
  async saveDefaultPhone(@Ctx() ctx: Context) {
    await this.userService.saveDefaultNumber(ctx);
  }

  @Hears('👩‍🔧 Profil')
  async hearsProfilUz(@Ctx() ctx: Context) {
    await this.userService.hearsProfil(ctx);
  }

  @Hears('👩‍🔧 Профиль')
  async hearsProfilRu(@Ctx() ctx: Context) {
    await this.userService.hearsProfil(ctx);
  }

  @Hears(['🏠 Doimiy manzillar', '🏠 Постоянные адреса'])
  async hearsPermanentAddresses(@Ctx() ctx: Context) {
    await this.userService.hearsPermanentAddresses(ctx);
  }

  @Action('replacename')
  async replaceName(@Ctx() ctx: Context) {
    await this.userService.replaceName(ctx);
  }

  @Action('replacenumber')
  async replacePhoneNumber(@Ctx() ctx: Context) {
    await this.userService.replacePhoneNumber(ctx);
  }

  @Action('repaddress')
  async editMyAddresses(@Ctx() ctx: Context) {
    await this.userService.hearsMyAddresses(ctx);
  }

  @Action('mynewconstaddress')
  async myNewAddress(@Ctx() ctx: Context) {
    await this.userService.actioMyNewAddress(ctx);
  }

  @Action(/^(deletemy=\d+)/)
  async deleteMyAddress(@Ctx() ctx: Context) {
    await this.userService.deleteMyAddress(ctx);
  }

  @Action(/^(to=\d+=from=\d+)/)
  async inThisDirection(@Ctx() ctx: Context) {
    await this.userService.confirmInMyAddresses(ctx);
  }

  @Action(/^(iwilltake=\d+)/)
  async saveMytoThis(@Ctx() ctx: Context) {
    await this.userService.confirmInDriverAndSendHisToUser(ctx);
  }

  @Action('forcallingtaxi')
  async forCallingTaxi(@Ctx() ctx: Context) {
    await this.userService.actionForCallingTaxi(ctx);
  }

  @Action('contract')
  async userContract(@Ctx() ctx: Context) {
    await this.userService.actionForUserContract(ctx);
  }

  @Action('contactus')
  async contactWith(@Ctx() ctx: Context) {
    await this.userService.contactWithUs(ctx);
  }

  @Action('mainmenu')
  async toMainMenu(@Ctx() ctx: Context) {
    await this.userService.toMainMenu(ctx);
  }

  @Action('replacelang')
  async actionForChangeLang(@Ctx() ctx: Context) {
    await this.userService.actionForChangeLang(ctx);
  }

  @Action('noconfirmlocation')
  async noConfirmLocation(@Ctx() ctx: Context) {
    await this.userService.noConfirmtaxi(ctx);
  }

  @Action('okconfirmlocation')
  async confirmLocation(@Ctx() ctx: Context) {
    await this.userService.ConfirmTaxi(ctx);
  }

  @Action('okconfirmprice')
  async confirmPrice(@Ctx() ctx: Context) {
    await this.userService.ConfirmPrice(ctx);
  }

  @Hears(['🚖 Taksi chaqirish 🙋‍♀️', '🚖 Вызов такси 🙋‍♀️'])
  async callTaxi(@Ctx() ctx: Context) {
    await this.userService.hearsCallTaxi(ctx);
  }

  @Hears('🚚 Yetkazib berish 🙋🏻‍♀️')
  async deliveryUZB(@Ctx() ctx: Context) {
    return await this.userService.delivery(ctx, 'UZB');
  }
  @Hears('🚚 Служба доставки 🙋🏻‍♀️')
  async deliveryRUS(@Ctx() ctx: Context) {
    return await this.userService.delivery(ctx, 'RUS');
  }

  @Hears('🙅‍♀️ Bekor qilish')
  async cancelledUZB(@Ctx() ctx: Context) {
    return await this.userService.canselled(ctx);
  }
  @Hears('🙅‍♀️ Отмена')
  async cancelledRUS(@Ctx() ctx: Context) {
    return await this.userService.canselled(ctx);
  }
  @Hears(['Машина сломалась 😔', 'Mashina buzilib qoldi 😔'])
  async broken_car(@Ctx() ctx: Context) {
    return await this.userService.brokenCar(ctx);
  }

  @Action('cancelled')
  async cancelled(@Ctx() ctx: Context) {
    return await this.userService.canselled(ctx);
  }
  @Action(/(from-delivery-\d+)/)
  async onFromDelivery(@Ctx() ctx: Context) {
    return await this.userService.onFromDelivery(ctx);
  }
  @Action(/(to-delivery-\d+)/)
  async onToDelivery(@Ctx() ctx: Context) {
    return await this.userService.onToDelivery(ctx);
  }
  @Action('accepted')
  async onAccepted(@Ctx() ctx: Context) {
    return await this.userService.onAccepted(ctx);
  }
  @Action('confirmed')
  async onConfirmed(@Ctx() ctx: Context) {
    return await this.userService.onConfirmed(ctx);
  }
  @Action('cancelled_taxi')
  async cancelled_taxi(@Ctx() ctx: Context) {
    return await this.userService.cancelled_taxi(ctx);
  }
  @Action('broken_car')
  async brokenCar(@Ctx() ctx: Context) {
    return await this.userService.brokenCar(ctx);
  }
  @Action(/(confirm_driver-[^c])/)
  async onConfirmDriver(@Ctx() ctx: Context) {
    return await this.userService.onConfirmDriver(ctx);
  }
  @Action(/(show_location[^c])/)
  async onShowLocation(@Ctx() ctx: Context) {
    return await this.userService.onShowLocation(ctx);
  }

  @Action('on_from_location')
  async on_from_location(@Ctx() ctx: Context) {
    return await this.userService.onFromLocation(ctx);
  }
  @Action('start_location')
  async start_location(@Ctx() ctx: Context) {
    return await this.userService.start_taxi_action(ctx);
  }
  @Action('finish_location')
  async finish_location(@Ctx() ctx: Context) {
    return await this.userService.finish_location(ctx);
  }
  @Action(/(marking-\d+)/)
  async marking(@Ctx() ctx: Context) {
    return await this.userService.marking(ctx);
  }

  @Command('driver')
  async onDriver(@Ctx() ctx: Context) {
    return this.userService.onDriver(ctx);
  }

  @On('location')
  async onLocation(@Ctx() ctx: Context) {
    await this.userService.onLocation(ctx);
  }
  //==============

  @Hears("👩🏼‍💻 Ro'yxatdan o'tish")
  async registrationDriver(@Ctx() ctx: Context) {
    return this.userService.registrationDriver(ctx, 'UZB');
  }

  @Hears('👩🏼‍💻 Зарегистрироваться')
  async registrationDriverRu(@Ctx() ctx: Context) {
    return this.userService.registrationDriver(ctx, 'RUS');
  }

  @Hears('🚕 Hozirdan ishlayman !')
  async workStatusTrue(@Ctx() ctx: Context) {
    return this.userService.workStatusTrue(ctx, 'UZB');
  }
  @Hears('🛋 Hozircha dam olaman')
  async workStatusFalse(@Ctx() ctx: Context) {
    return this.userService.workStatusFalse(ctx, 'UZB');
  }

  @Hears('🚕 Я сейчас работаю !')
  async workStatusTrueRU(@Ctx() ctx: Context) {
    return this.userService.workStatusTrue(ctx, 'RUS');
  }

  @Hears('🛋 Я пока отдохну')
  async workStatusFalseRU(@Ctx() ctx: Context) {
    return this.userService.workStatusFalse(ctx, 'RUS');
  }

  @Hears("⛔️ Ishni to'xtatish")
  async stopWorking(@Ctx() ctx: Context) {
    return this.userService.workStatusFalse(ctx, 'UZB');
  }

  @Hears('⛔️ Остановить работу')
  async stopWorkingRU(@Ctx() ctx: Context) {
    return this.userService.workStatusFalse(ctx, 'RUS');
  }

  @Action(/^(verify=\d+)/)
  async verifyDriver(@Ctx() ctx: Context) {
    return this.userService.verifyDriver(ctx);
  }

  @Action(/^(otmen=\d+)/)
  async notAccessDriver(@Ctx() ctx: Context) {
    return this.userService.notAccesDriver(ctx);
  }

  @Action('checkDriverStatus')
  async checkDriverStatus(@Ctx() ctx: Context) {
    return this.userService.checkDriverStatus(ctx);
  }

  @On('message')
  async onMessage(@Ctx() ctx: Context) {
    await this.userService.onMessage(ctx);
  }
}
