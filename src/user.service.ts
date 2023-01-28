import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Context, Markup } from 'telegraf';
import { Address } from './models/address.model';
import { Driver } from './models/drivers.model';
import { Search } from './models/searches.model';
import { Taxi } from './models/taxi.model';
import { User } from './models/users.model';
import { UserAddress } from './models/user_address.model';
import { uzReplyMessages } from './constants/reply-messages-in-uzb';
import { ruReplyMessages } from './constants/reply-messages-in-ru';
import { uzKeyboards } from './constants/keyboards-in-uzb';
import { ruKeyboards } from './constants/keyboards-in-rus';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepo: typeof User,
    @InjectModel(Taxi) private readonly taxiRepo: typeof Taxi,
    @InjectModel(Search) private readonly searchRepo: typeof Search,
    @InjectModel(Address) private readonly addressRepo: typeof Address,
    @InjectModel(UserAddress) private readonly usAddrRepo: typeof UserAddress,
    @InjectModel(Driver) private readonly driverRepo: typeof Driver,
  ) {}

  async onStart(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if (user.last_state === 'finish') {
        await ctx.reply(
          `Assalomu alaykum!\n«Lady Taxi» botiga xush kelibsiz!`,
          {
            parse_mode: 'HTML',
            ...Markup.keyboard([
              ['🚖 Taksi chaqirish 🙋‍♀️', '🚚 Yetkazib berish 🙋🏻‍♀️'],
              ['👩‍🔧 Profil', '🏠 Doimiy manzillar'],
            ])
              .oneTime()
              .resize(),
          },
        );
      } else if (user.last_state === 'user_lang') {
        // await this.selectLanguage(ctx);
      } else if (user.last_state === 'phone_number') {
        // await this.hearsRoyhatdanOtish(ctx);
      } else if (user.last_state === 'real_name') {
        // await this.realNameAlternative(ctx);
      } else if (user.last_state === 'ads_phone_number') {
        // await this.adsPhoneNumberAlternative(ctx, user.phone_number);
      } else if (user.last_state === 'driver') {
        await user.update({
          last_state: 'finish',
        });
      }
    } else {
      await this.userRepo.create({
        user_id: `${ctx.from.id}`,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name,
        username: ctx.from.username,
        last_state: 'user_lang',
      });
      await ctx.reply(
        `Assalomu alaykum! | Здравствуйте!\nTilni tanlang | Выберите язык:`,
        {
          parse_mode: 'HTML',
          ...Markup.keyboard([["🇺🇿 O'zbek tili", '🇷🇺 Русский язык']])
            .oneTime()
            .resize(),
        },
      );
    }
  }

  async saveLang(ctx: Context, lang: string) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });

    if (user) {
      if (user.last_state === 'user_lang') {
        await user.update({ user_lang: lang, last_state: 'phone_number' });
        if (user.user_lang === 'UZB') {
          await ctx.reply(
            `Siz <b>«Lady Taxi»</b> botidan ilk marta foydalanayotganingiz uchun,
        bir martalik ro'yxatdan o'tishingiz lozim!`,
            {
              parse_mode: 'HTML',
              ...Markup.keyboard(["✅ Ro'yxatdan o'tish"]).oneTime().resize(),
            },
          );
        } else if (user.user_lang === 'RUS') {
          await ctx.reply(
            `Так как вы впервые пользуетесь ботом <b>«Lady Taxi»</b>, 
        вам необходимо зарегистрироваться один раз!`,
            {
              parse_mode: 'HTML',
              ...Markup.keyboard(['✅ Зарегистрироваться']).oneTime().resize(),
            },
          );
        }
      } else if (user.last_state === 'replace_lang') {
        await user.update({ user_lang: lang, last_state: 'finish' });
        //asosiy menu
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async registration(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if (user.last_state === 'phone_number') {
        if (user.user_lang == 'UZB') {
          await ctx.reply(
            `Iltimos o'zingizni raqamingizni yuboring, <b>"Telefon raqamni yuborish"</b> tugmasini bosing! `,
            {
              parse_mode: 'HTML',
              ...Markup.keyboard([
                [Markup.button.contactRequest('📞 Telefon raqamni yuborish')],
              ])
                .oneTime()
                .resize(),
            },
          );
        } else if (user.user_lang === 'RUS') {
          await ctx.reply(
            ` Пожалуйста, пришлите свой номер, нажмите <b>"Отправить номер телефона"</b>! `,
            {
              parse_mode: 'HTML',
              ...Markup.keyboard([
                [Markup.button.contactRequest('📞 Отправить номер телефона')],
              ])
                .oneTime()
                .resize(),
            },
          );
        }
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async onContact(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if ('contact' in ctx.message) {
        if (user.last_state === 'phone_number') {
          if (ctx.from.id == ctx.message.contact.user_id) {
            await user.update({
              phone_number: ctx.message.contact.phone_number,
              last_state: 'real_name',
            });

            if (user.user_lang === 'UZB') {
              await ctx.telegram.sendChatAction(ctx.from.id, 'typing');
              await ctx.reply(
                `<b>Sizga murojaat qilish uchun quyidagi ismingizni tanlang:</b>`,
                {
                  parse_mode: 'HTML',
                  ...Markup.inlineKeyboard([
                    Markup.button.callback(
                      `Men ${ctx.from.first_name} ismini tanlayman`,
                      'savedefaultname',
                    ),
                  ]),
                },
              );
              await ctx.replyWithHTML('Yoki haqiqiy ismingizni kiriting:');
            } else if (user.user_lang === 'RUS') {
              await ctx.telegram.sendChatAction(ctx.from.id, 'typing');
              await ctx.reply(
                `<b>Пожалуйста, выберите свое имя ниже, чтобы связаться с вами:</b>`,
                {
                  parse_mode: 'HTML',
                  ...Markup.inlineKeyboard([
                    Markup.button.callback(
                      `Я "${ctx.from.first_name}" выбираю имя`,
                      'savedefaultname',
                    ),
                  ]),
                },
              );
              await ctx.replyWithHTML('Или введите свое настоящее имя:');
            }
          } else {
            if (user.user_lang === 'UZB') {
              await ctx.reply(
                `Iltimos o'zingizni raqamingizni yuboring, <b>"Telefon raqamni yuborish"</b> tugmasini bosing! `,
                {
                  parse_mode: 'HTML',
                  ...Markup.keyboard([
                    [
                      Markup.button.contactRequest(
                        '📞 Telefon raqamni yuborish',
                      ),
                    ],
                  ])
                    .oneTime()
                    .resize(),
                },
              );
            } else if (user.user_lang === 'RUS') {
              await ctx.telegram.sendChatAction(ctx.from.id, 'typing');
              await ctx.reply(
                `Пожалуйста, пришлите свой номер, <b>"Отправить номер телефона"</b> нажать на кнопку! `,
                {
                  parse_mode: 'HTML',
                  ...Markup.keyboard([
                    [
                      Markup.button.contactRequest(
                        '📞 Отправить номер телефона',
                      ),
                    ],
                  ])
                    .oneTime()
                    .resize(),
                },
              );
            }
          }
        }
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async onMessage(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if ('text' in ctx.message) {
        if (user.last_state === 'real_name') {
          await user.update({
            real_name: ctx.message.text,
            last_state: 'ads_phone_number',
          });
          if (user.user_lang === 'UZB') {
            await ctx.reply(
              `<b>Siz bilan bog'lanish uchun quyidagi telefon raqamingizni tanlang:</b>`,
              {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                  Markup.button.callback(
                    `Men ${user.phone_number} raqamini tanlayman`,
                    'savedefaultphone',
                  ),
                ]),
              },
            );
            await ctx.reply(
              'Yoki boshqa ishlab turgan telefon raqam kiriting (namuna: 931234567):',
            );
          } else if (user.user_lang === 'RUS') {
            await ctx.reply(
              `<b>Выберите свой номер телефона ниже, чтобы связаться с вами:</b>`,
              {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                  Markup.button.callback(
                    `я выбираю ${user.phone_number} номер`,
                    'savedefaultphone',
                  ),
                ]),
              },
            );
            await ctx.reply(
              'Или введите другой рабочий номер телефона (пример: 931234567):',
            );
          }
        } else if (user.last_state === 'ads_phone_number') {
          await user.update({
            ads_phone_number: ctx.message.text,
            last_state: 'finish',
          });

          if (user.user_lang === 'UZB') {
            await ctx.reply(
              `Siz muvaffaqqiyatli ro'yxatdan o'tdingiz!\n«Lady Taxi» xizmatlaridan foydalanishingiz mumkin!`,
            );
            await ctx.reply(uzReplyMessages.to_main_menu[1], {
              parse_mode: 'HTML',
              ...Markup.keyboard([
                ['🚖 Taksi chaqirish 🙋‍♀️', '🚚 Yetkazib berish 🙋‍♀️'],
                ['🙎🏼‍♀️ Profil', '🏠 Doimiy manzillar'],
              ])
                .oneTime()
                .resize(),
            });
          } else if (user.user_lang === 'RUS') {
            await ctx.reply(
              `Вы успешно зарегистрировались!\nВы можете воспользоваться услугами Lady Taxi!`,
            );
            await ctx.reply(ruReplyMessages.to_main_menu[1], {
              parse_mode: 'HTML',
              ...Markup.keyboard([
                ['🚖 Taksi chaqirish 🙋‍♀️', '🚚 Yetkazib berish 🙋‍♀️'],
                ['🙎🏼‍♀️ Profil', '🏠 Doimiy manzillar'],
              ])
                .oneTime()
                .resize(),
            });
          }
        } else if (user.last_state === 'change_name') {
          await user.update({
            real_name: ctx.message.text,
            last_state: 'finish',
          });
          
        }
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async saveDefaultName(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if (user.last_state === 'real_name') {
        await user.update({
          real_name: ctx.from.first_name || ctx.from.last_name,
          last_state: 'ads_phone_number',
        });
        if (user.user_lang === 'UZB') {
          await ctx.reply(
            `<b>Siz bilan bog'lanish uchun quyidagi telefon raqamingizni tanlang:</b>`,
            {
              parse_mode: 'HTML',
              ...Markup.inlineKeyboard([
                Markup.button.callback(
                  `Men ${user.phone_number} raqamini tanlayman`,
                  'savedefaultphone',
                ),
              ]),
            },
          );
          await ctx.reply(
            'Yoki boshqa ishlab turgan telefon raqam kiriting (namuna: 931234567):',
          );
        } else if (user.user_lang === 'RUS') {
          await ctx.reply(
            `<b>Выберите свой номер телефона ниже, чтобы связаться с вами:</b>`,
            {
              parse_mode: 'HTML',
              ...Markup.inlineKeyboard([
                Markup.button.callback(
                  `я выбираю ${user.phone_number} номер`,
                  'savedefaultphone',
                ),
              ]),
            },
          );
          await ctx.reply(
            'Или введите другой рабочий номер телефона (пример: 931234567):',
          );
        }
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async saveDefaultNumber(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if (user.last_state === 'ads_phone_number') {
        await user.update({
          ads_phone_number: user.phone_number,
          last_state: 'finish',
        });
        if (user.user_lang === 'UZB') {
          await ctx.reply(
            `Siz muvaffaqqiyatli ro'yxatdan o'tdingiz!\n«Lady Taxi» xizmatlaridan foydalanishingiz mumkin!`,
          );
          await ctx.reply(uzReplyMessages.to_main_menu[1], {
            parse_mode: 'HTML',
            ...Markup.keyboard([
              ['🚖 Taksi chaqirish 🙋‍♀️', '🚚 Yetkazib berish 🙋‍♀️'],
              ['🙎🏼‍♀️ Profil', '🏠 Doimiy manzillar'],
            ])
              .oneTime()
              .resize(),
          });
        } else if (user.user_lang === 'RUS') {
          await ctx.reply(
            `Вы успешно зарегистрировались!\nВы можете воспользоваться услугами Lady Taxi!`,
          );
          await ctx.reply(ruReplyMessages.to_main_menu[1], {
            parse_mode: 'HTML',
            ...Markup.keyboard([
              ['🚖 Taksi chaqirish 🙋‍♀️', '🚚 Yetkazib berish 🙋‍♀️'],
              ['🙎🏼‍♀️ Profil', '🏠 Doimiy manzillar'],
            ])
              .oneTime()
              .resize(),
          });
        }
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async hearsProfil(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if (user.user_lang === 'UZB') {
        await ctx.reply(uzReplyMessages.select_section, {
          parse_mode: 'HTML',
          ...uzKeyboards.profile,
        });
      } else if (user.user_lang === 'RUS') {
        await ctx.reply(ruReplyMessages.select_section, {
          parse_mode: 'HTML',
          ...ruKeyboards.profile,
        });
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async replaceName(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if (user.last_state === 'finish') {
        await user.update({ last_state: 'change_name' });
        await ctx.reply(uzReplyMessages.input_name, {
          parse_mode: 'HTML',
          ...uzKeyboards.cancel_replace_name,
        });
      }
    } else {
      await ctx.reply('/start');
    }
  }
}
