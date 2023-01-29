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
import { getFullName } from './helpers/getFullAddressName';
import axios from 'axios';
import { onMainRUS, onMainUZB } from './helpers/onMain';
import { Microbus } from './models/microbus.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepo: typeof User,
    @InjectModel(Taxi) private readonly taxiRepo: typeof Taxi,
    @InjectModel(Search) private readonly searchRepo: typeof Search,
    @InjectModel(Address) private readonly addressRepo: typeof Address,
    @InjectModel(UserAddress) private readonly usAddrRepo: typeof UserAddress,
    @InjectModel(Driver) private readonly driverRepo: typeof Driver,
    @InjectModel(Microbus) private readonly microbusRepo: typeof Microbus,
  ) {}

  async onStart(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      // if (user.last_state === 'finish') {
      if (user.user_lang === 'UZB') {
        await ctx.reply(
          `Assalomu alaykum!\n«Lady Taxi» botiga xush kelibsiz!`,
          {
            parse_mode: 'HTML',
            ...uzKeyboards.main_menu,
          },
        );
      } else if (user.user_lang === 'RUS') {
        await ctx.reply(`Привет!\nДобро пожаловать в бот «Lady Taxi»!`, {
          parse_mode: 'HTML',
          ...ruKeyboards.main_menu,
        });
      }
      // } else
      if (user.last_state === 'user_lang') {
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
      } else if (user.last_state === 'change_lang') {
        await user.update({ user_lang: lang, last_state: 'finish' });
        if (user.user_lang === 'UZB') {
          await ctx.reply("Bot tili O'zbek tiliga o'zgartirildi");
          await ctx.reply(uzReplyMessages.to_main_menu[1], {
            parse_mode: 'HTML',
            ...uzKeyboards.main_menu,
          });
        } else if (user.user_lang === 'RUS') {
          await ctx.reply('Язык бота изменен на русский');
          await ctx.reply(ruReplyMessages.to_main_menu[1], {
            parse_mode: 'HTML',
            ...ruKeyboards.main_menu,
          });
        }
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
    const driver = await this.driverRepo.findOne({
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
              ...uzKeyboards.main_menu,
            });
          } else if (user.user_lang === 'RUS') {
            await ctx.reply(
              `Вы успешно зарегистрировались!\nВы можете воспользоваться услугами Lady Taxi!`,
            );
            await ctx.reply(ruReplyMessages.to_main_menu[1], {
              parse_mode: 'HTML',
              ...uzKeyboards.main_menu,
            });
          }
        } else if (user.last_state === 'change_name') {
          await user.update({
            real_name: ctx.message.text,
            last_state: 'finish',
          });
          if (user.user_lang == 'UZB') {
            await ctx.reply(`Ismingiz ${user.real_name}ga o'zgartirildi`, {
              parse_mode: 'HTML',
              ...uzKeyboards.main_menu,
            });
          } else {
            await ctx.reply(`Ваше имя изменено на ${user.real_name}`, {
              parse_mode: 'HTML',
              ...ruKeyboards.main_menu,
            });
          }
        } else if (user.last_state === 'change_phone') {
          await user.update({
            ads_phone_number: ctx.message.text,
            last_state: 'finish',
          });
          if (user.user_lang === 'UZB') {
            await ctx.reply(
              `Telefon raqamingiz ${user.ads_phone_number} ga o'zgartirildi`,
              {
                parse_mode: 'HTML',
                ...uzKeyboards.main_menu,
              },
            );
          } else if (user.user_lang === 'RUS') {
            await ctx.reply(
              `ваш номер телефона изменился на ${user.ads_phone_number}`,
              {
                parse_mode: 'HTML',
                ...ruKeyboards.main_menu,
              },
            );
          }
        } else if (user.last_state === 'newmyaddress') {
          const userAddress = await this.usAddrRepo.findOne({
            where: { user_id: user.user_id },
            order: [['createdAt', 'DESC']],
          });
          if (userAddress) {
            if (userAddress.last_state === 'name') {
              await userAddress.update({
                address_name: ctx.message.text,
                last_state: 'location',
              });
              if (user.user_lang === 'UZB') {
                await ctx.reply(uzReplyMessages.when_add_address);
              }
            }
          } else {
            await ctx.reply('/start');
          }
        } else if (user.last_state === 'delivery') {
          const taxi = await this.taxiRepo.findOne({
            where: {
              user_id: String(ctx.from.id),
            },
            order: [['createdAt', 'DESC']],
          });
          if (!taxi) {
            return await ctx.reply("Taxi yo'q"); //---------------------------------------------------------------
          }
          if (taxi.taxi_state === 'from_location' && 'text' in ctx.message) {
            let str: string[];
            if (user?.user_lang === 'UZB') {
              str = [
                'Kiritilgan manzilni qidirish natijasi:',
                "Mo'ljal:",
                'Manzil:',
                'Shu manzilni tanlayman 👆',
                "Agar ko'rsatilgan manzillar to'g'ri kelmasa, manzilni to'liqroq kiritib ko'ring ✏️ yoki kartadan aniq lokatsiyani tanlang 🗺 .",
                `-manzili topilmadi. ${'\n'}Kerakli manzilga yaqin mo'ljalni kiriting yoki kartadan aniq lokatsiyani tanlang.`,
                '🙅‍♀️ Bekor qilish',
              ];
            } else {
              str = [
                'Результат поиска по введенному адресу:',
                'Адрес назначения:',
                'Польный адрес:',
                'Я выбираю этот адрес 👆',
                'Если указанные адреса не совпадают, ✏️ введите полный адрес или выберите точное местоположение на карте 🗺 .',
                `- адрес не найден.${'\n'}Введите цель, ближайшую к нужному адресу или выберите точное местоположение на карте.`,
                '🙅‍♀️ Отмена',
              ];
            }
            let addresses;
            let search = await this.searchRepo.findOne({
              where: { request: ctx.message.text },
            });
            await ctx.sendChatAction('typing');
            await ctx.reply(str[0], {
              parse_mode: 'HTML',
              ...Markup.keyboard([[str[6]]]).resize(),
            });
            if (search) {
              search.request_count = search.dataValues.request_count + 1;
              await search.save();
              addresses = await this.addressRepo.findAll({
                where: { request_id: search.id },
              });
            } else {
              let data = await axios.get(
                `https://search-maps.yandex.ru/v1/?text=${
                  ctx.message.text
                }&type=geo&lang=${
                  user?.user_lang === 'RUS' ? 'ru_RU' : 'uz_UZ'
                }&apikey=${process.env.YANDEX_KEY}`,
              );
              addresses = data.data.features;
              if (!addresses.length) {
                ctx.reply(ctx.message.text + str[5]);
                return;
              }
              search = await this.searchRepo.create({
                request: ctx.message.text,
                founds:
                  data.data.properties.ResponseMetaData.SearchResponse.found,
              });
            }
            ctx.reply(str[4]);
            for (let place of addresses) {
              if ('properties' in place) {
                place = await this.addressRepo.create({
                  request_id: search.id,
                  coordinate_lon: place.geometry.coordinates[0],
                  coordinate_lat: place.geometry.coordinates[1],
                  address_name: place.properties.name,
                  address_text: place.properties.description,
                  bounded_top_lon: place.properties.boundedBy[0][0],
                  bounded_bottom_lon: place.properties.boundedBy[1][0],
                  bounded_top_lat: place.properties.boundedBy[0][1],
                  bounded_bottom_lat: place.properties.boundedBy[1][1],
                  full_text: JSON.stringify(place),
                });
              }
              await ctx.reply(
                `${str[1]} ${place.address_name} \n${str[2]} ${place.address_text}`,
                {
                  parse_mode: 'HTML',
                  ...Markup.inlineKeyboard([
                    [
                      {
                        text: str[3],
                        callback_data: `from-delivery-${place.id}`,
                      },
                    ],
                  ]),
                },
              );
            }
          } else if (
            taxi.taxi_state === 'to_location' &&
            'text' in ctx.message
          ) {
            let str: string[];
            if (user?.user_lang === 'UZB') {
              str = [
                'Kiritilgan manzilni qidirish natijasi:',
                "Mo'ljal:",
                'Manzil:',
                'Shu manzilni tanlayman 👆',
                "Agar ko'rsatilgan manzillar to'g'ri kelmasa, manzilni to'liqroq kiritib ko'ring ✏️ yoki kartadan aniq lokatsiyani tanlang 🗺 .",
                `-manzili topilmadi. ${'\n'}Kerakli manzilga yaqin mo'ljalni kiriting yoki kartadan aniq lokatsiyani tanlang.`,
                '🙅‍♀️ Bekor qilish',
              ];
            } else {
              str = [
                'Результат поиска по введенному адресу:',
                'Адрес назначения:',
                'Польный адрес:',
                'Я выбираю этот адрес 👆',
                'Если указанные адреса не совпадают, ✏️ введите полный адрес или выберите точное местоположение на карте 🗺 .',
                `- адрес не найден.${'\n'}Введите цель, ближайшую к нужному адресу или выберите точное местоположение на карте.`,
                '🙅‍♀️ Отмена',
              ];
            }
            let addresses;
            let search = await this.searchRepo.findOne({
              where: { request: ctx.message.text },
            });
            await ctx.sendChatAction('typing');
            await ctx.reply(str[0], {
              parse_mode: 'HTML',
              ...Markup.keyboard([[str[6]]]).resize(),
            });
            if (search) {
              search.request_count = search.dataValues.request_count + 1;
              await search.save();
              addresses = await this.addressRepo.findAll({
                where: { request_id: search.id },
              });
            } else {
              let data = await axios.get(
                `https://search-maps.yandex.ru/v1/?text=${
                  ctx.message.text
                }&type=geo&lang=${
                  user?.user_lang === 'RUS' ? 'ru_RU' : 'uz_UZ'
                }&apikey=${process.env.YANDEX_KEY}`,
              );
              addresses = data.data.features;
              if (!addresses.length) {
                ctx.reply(ctx.message.text + str[5]);
                return;
              }
              search = await this.searchRepo.create({
                request: ctx.message.text,
                founds:
                  data.data.properties.ResponseMetaData.SearchResponse.found,
              });
            }
            ctx.reply(str[4]);
            for (let place of addresses) {
              if ('properties' in place) {
                place = await this.addressRepo.create({
                  request_id: search.id,
                  coordinate_lon: place.geometry.coordinates[0],
                  coordinate_lat: place.geometry.coordinates[1],
                  address_name: place.properties.name,
                  address_text: place.properties.description,
                  bounded_top_lon: place.properties.boundedBy[0][0],
                  bounded_bottom_lon: place.properties.boundedBy[1][0],
                  bounded_top_lat: place.properties.boundedBy[0][1],
                  bounded_bottom_lat: place.properties.boundedBy[1][1],
                  full_text: JSON.stringify(place),
                });
              }
              await ctx.reply(
                `${str[1]} ${place.address_name} \n${str[2]} ${place.address_text}`,
                {
                  parse_mode: 'HTML',
                  ...Markup.inlineKeyboard([
                    [
                      {
                        text: str[3],
                        callback_data: `to-delivery-${place.id}`,
                      },
                    ],
                  ]),
                },
              );
            }
          }
        } else if (user.last_state === 'car_number') {
          await this.driverRepo.update(
            {
              car_number: `${ctx.message.text}`,
            },
            {
              where: {
                user_id: `${ctx.from.id}`,
              },
            },
          );
          await this.userRepo.update(
            {
              last_state: 'tex-passport',
            },
            {
              where: {
                user_id: `${ctx.from.id}`,
              },
            },
          );
          if (user.user_lang == 'UZB') {
            await ctx.replyWithHTML(
              'Mashinaning tex-passporti raqamini kiriting !',
            );
          } else {
            await ctx.replyWithHTML(
              'Введите номер технического паспорта автомобиля !',
            );
          }
        } else if (user.last_state === 'tex-passport') {
          let data;
          try {
            data = await (
              await axios.get(
                `https://api-dtp.yhxbb.uz/api/egov/open_data/info_car?format=json&plate_number=${driver.car_number}&tech_pass=${ctx.message.text}`,
              )
            ).data;
          } catch (error) {
            if (user.user_lang == 'UZB') {
              await ctx.reply(
                'Texnik ruxsatnomangiz yoki mashina raqamingiz xato',
              );
            } else {
              await ctx.reply(
                'Ваше техническое разрешение или номер транспортного средства неверны',
              );
            }
          }
          if (data) {
            await this.driverRepo.update(
              {
                last_state: 'non-active',
                car_model: `${data.pModel}`,
                car_color: `${data.pVehicleColor}`,
                car_year: `${data.pYear}`,
              },
              {
                where: {
                  user_id: `${ctx.from.id}`,
                },
              },
            );
            await this.userRepo.update(
              {
                last_state: 'non-active',
              },
              {
                where: {
                  user_id: `${ctx.from.id}`,
                },
              },
            );
          } else {
            console.log('error');
          }
          const newDriver = await this.driverRepo.findOne({
            where: {
              user_id: `${ctx.from.id}`,
            },
          });
          await user.update({ last_state: 'finish' });
          await ctx.telegram.sendMessage(
            +process.env.ADMIN_ID,
            `${newDriver.first_name}\n ${newDriver.last_name}\n ${newDriver.car_model}\n ${newDriver.car_number}\n ${newDriver.car_year}\n ${newDriver.user_id}`,
            {
              parse_mode: 'HTML',
              ...Markup.inlineKeyboard([
                Markup.button.callback(
                  '✅ Tasdiqlayman',
                  `verify=${ctx.from.id}`,
                ),
                Markup.button.callback(
                  '❌ Rad qilinsin',
                  `otmen=${ctx.from.id}`,
                ),
              ]),
            },
          );
          if (user.user_lang == 'UZB') {
            await ctx.replyWithHTML(
              "Ma'lumotlaringiz <b>admin</b> ga yetkazildi. Admin ruxsat berishi bilan sizga activelik taqdim qilinadi",
            );
          } else {
            await ctx.replyWithHTML(
              'Ваша информация была отправлена <b>admin</b>. Активность будет предоставлена вам, как только администратор одобрит ее.',
            );
          }
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
            ...uzKeyboards.main_menu,
          });
        } else if (user.user_lang === 'RUS') {
          await ctx.reply(
            `Вы успешно зарегистрировались!\nВы можете воспользоваться услугами Lady Taxi!`,
          );
          await ctx.reply(ruReplyMessages.to_main_menu[1], {
            parse_mode: 'HTML',
            ...ruKeyboards.main_menu,
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
        if (user.user_lang === 'UZB') {
          await ctx.reply(uzReplyMessages.input_name, {
            parse_mode: 'HTML',
            ...uzKeyboards.cancel_replace_name,
          });
        } else if (user.user_lang === 'RUS') {
          await ctx.reply(ruReplyMessages.input_name, {
            parse_mode: 'HTML',
            ...ruKeyboards.cancel_replace_name,
          });
        }
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async replacePhoneNumber(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if (user.last_state === 'finish') {
        await user.update({ last_state: 'change_phone' });

        if (user.user_lang == 'UZB') {
          await ctx.reply(`Yangi telefon raqam kiriting`, {
            parse_mode: 'HTML',
            ...uzKeyboards.cancel_replace_phone,
          });
        } else if (user.user_lang === 'RUS') {
          await ctx.reply('Введите новый номер телефона', {
            parse_mode: 'HTML',
            ...ruKeyboards.cancel_replace_phone,
          });
        }
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async hearsMyAddresses(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if (user.last_state === 'finish') {
        const userAddresses = await this.usAddrRepo.findAll({
          where: { user_id: `${ctx.from.id}` },
        });
        if (user.user_lang === 'UZB') {
          await ctx.reply(uzReplyMessages.input_constant_address, {
            parse_mode: 'HTML',
            ...uzKeyboards.input_constant_address,
          });
        } else if (user.user_lang === 'RUS') {
          await ctx.reply(ruReplyMessages.input_constant_address, {
            parse_mode: 'HTML',
            ...ruKeyboards.input_constant_address,
          });
        }
        for (let i = 0; i < userAddresses.length; i++) {
          if (user.user_lang === 'UZB') {
            await ctx.reply(
              uzReplyMessages.all_taxi_addresses(
                userAddresses[i].address_name,
                userAddresses[i].full_address,
              ),
              {
                parse_mode: 'HTML',
                ...uzKeyboards.delete_my_address(userAddresses[i].id),
              },
            );
          } else if (user.user_lang === 'RUS') {
            await ctx.reply(
              ruReplyMessages.all_taxi_addresses(
                userAddresses[i].address_name,
                userAddresses[i].full_address,
              ),
              {
                parse_mode: 'HTML',
                ...ruKeyboards.delete_my_address(userAddresses[i].id),
              },
            );
          }
        }
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async actioMyNewAddress(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      await user.update({ last_state: 'newmyaddress' });
      await this.usAddrRepo.create({
        user_id: `${ctx.from.id}`,
        last_state: 'name',
      });

      if (user.user_lang === 'UZB') {
        await ctx.reply(uzReplyMessages.input_address_name, {
          parse_mode: 'HTML',
          ...uzKeyboards.cancel_add_address,
        });
      } else if (user.user_lang === 'RUS') {
        await ctx.reply(ruReplyMessages.input_address_name, {
          parse_mode: 'HTML',
          ...ruKeyboards.cancel_add_address,
        });
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async onLocation(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if ('location' in ctx.message) {
        if (user.last_state === 'newmyaddress') {
          const userAddress = await this.usAddrRepo.findOne({
            where: { user_id: user.user_id },
            order: [['createdAt', 'DESC']],
          });
          if (userAddress.last_state === 'location') {
            const fullAddress = await getFullName(
              ctx.message.location.latitude,
              ctx.message.location.longitude,
            );
            await userAddress.update({
              full_address: fullAddress.display_name,
              lat: String(ctx.message.location.latitude),
              lon: String(ctx.message.location.longitude),
              last_state: 'finish',
            });
            await user.update({ last_state: 'finish' });
            if (user.user_lang === 'UZB') {
              await ctx.reply(uzReplyMessages.after_adding_address, {
                parse_mode: 'HTML',
                ...uzKeyboards.main_menu,
              });
            } else if (user.user_lang === 'RUS') {
              await ctx.reply(ruReplyMessages.after_adding_address, {
                parse_mode: 'HTML',
                ...ruKeyboards.main_menu,
              });
            }
          }
        } else if (user.last_state === 'taxi') {
          const taxi = await this.taxiRepo.findOne({
            where: { user_id: user.user_id },
            order: [['createdAt', 'DESC']],
          });
          if (taxi) {
            if (taxi.taxi_state === 'from_location') {
              const lat = ctx.message.location.latitude;
              const long = ctx.message.location.longitude;
              const fullAddress = await getFullName(lat, long);

              taxi.update({
                from_lat: String(ctx.message.location.latitude),
                from_long: String(ctx.message.location.longitude),
                from_full_adr: fullAddress.display_name,
                taxi_state: 'to_location',
              });
              await taxi.save();

              if (user.user_lang === 'UZB') {
                await ctx.reply(
                  `Borish manzilingizni yuborish uchun Telegramning 📎 tugmasi \norqali geolokatsiyani (Местоположение, Location) tanlang yoki \nmanzilni botga xabar ko'rinishida yuboring:`,
                  {
                    parse_mode: 'HTML',
                    ...Markup.keyboard([['🙅‍♀️ Bekor qilish']])
                      .oneTime()
                      .resize(),
                  },
                );
              } else if (user.user_lang === 'RUS') {
                await ctx.reply(
                  `Чтобы отправить пункт назначения, выберите геолокацию (Местоположение, Местоположение) кнопкой Telegram 📎 или отправьте адрес боту в сообщении:`,
                  {
                    parse_mode: 'HTML',
                    ...Markup.keyboard([['🙅‍♀️ Отменить']])
                      .oneTime()
                      .resize(),
                  },
                );
              }
            } else if (taxi.taxi_state === 'to_location') {
              const lat = ctx.message.location.latitude;
              const long = ctx.message.location.longitude;
              const fullAddress = await getFullName(lat, long);
              taxi.update({
                to_lat: String(ctx.message.location.latitude),
                to_long: String(ctx.message.location.longitude),
                to_full_adr: fullAddress.display_name,
              });
              await taxi.save();
              var config = {
                method: 'GET',
                url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${taxi.from_lat}%2C${taxi.from_long}&destinations=${taxi.to_lat}%2C${taxi.to_long}&key=${process.env.GOOGLE_API_KEY}`,
                headers: {},
              };
              const response = await axios(config);
              let distance_data = response.data;
              let distance = (
                distance_data.rows[0].elements[0].distance.value / 1000
              ).toFixed(1);
              let time = (
                distance_data.rows[0].elements[0].duration.value / 60
              ).toFixed();

              taxi.update({
                taxi_distance: +distance,
                taxi_time: +time,
                taxi_state: 'driver',
                info: 'confirm_location',
              });
              await taxi.save();
              if (user.user_lang === 'UZB') {
                await ctx.reply('Manzillarni tasdiqlang');
                const message = await ctx.reply(
                  `🔰 Jo'nash manzilingiz: ${taxi.from_full_adr}\n\n🏁 Borish manzilingiz: ${taxi.to_full_adr}\n\nMasofa: ${distance} km\nVaqti: ${time} min`,
                  {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                      Markup.button.callback(
                        '✅ Tasdiqlayman',
                        'okconfirmlocation',
                      ),
                      Markup.button.callback(
                        '🙅‍♀️ Bekor qilish',
                        'noconfirmlocation',
                      ),
                    ]),
                  },
                );
                taxi.update({ message_id: message.message_id });
                await taxi.save();
              } else if (user.user_lang === 'RUS') {
                await ctx.reply('Manzillarni tasdiqlang');
                const message = await ctx.reply(
                  `🔰 Адрес отправления: ${taxi.from_full_adr}\n\n🏁 Адрес назначения: ${taxi.to_full_adr}\n\nРасстояние: ${distance} км\nВремя: ${time} мин`,
                  {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                      Markup.button.callback(
                        '✅ Подтверждаю',
                        'okconfirmlocation',
                      ),
                      Markup.button.callback(
                        '🙅‍♀️ Отменить',
                        'noconfirmlocation',
                      ),
                    ]),
                  },
                );
                taxi.update({ message_id: message.message_id });
                await taxi.save();
              }
            }
          } else {
            await ctx.reply('/start');
          }
        } else if (user.last_state === 'delivery') {
          try {
            const user = await this.userRepo.findOne({
              where: { user_id: String(ctx.from.id) },
            });
            const taxi = await this.taxiRepo.findOne({
              where: {
                user_id: String(ctx.from.id),
              },
              order: [['createdAt', 'DESC']],
            });
            let latitude: number;
            let longitude: number;
            if ('location' in ctx.message) {
              latitude = ctx.message.location.latitude;
              longitude = ctx.message.location.longitude;
            }
            if (taxi?.taxi_state === 'from_location') {
              let data = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
              );
              let str: string;
              let str1: string;
              if (user?.dataValues.user_lang === 'UZB') {
                str =
                  "Jo'natma yetkazish manzilini yuborish uchun Telegramning 📎 tugmasi orqali 📍 geolokatsiyani (Местоположение, Location) tanlang yoki manzilni botga ✏️ xabar ko'rinishida yuboring:";
                str1 = '🙅‍♀️ Bekor qilish';
              } else {
                str =
                  'Выберите адрес доставки с помощью кнопки 📎 Телеграма или ✏️ отправьте адрес в виде сообщения:';
                str1 = '🙅‍♀️ Отмена';
              }
              taxi.from_full_adr = data.data.display_name;
              taxi.from_lat = String(latitude);
              taxi.from_long = String(longitude);
              taxi.taxi_state = 'to_location';
              await taxi.save();
              await ctx.telegram.sendChatAction(ctx.from.id, 'typing');
              await ctx.reply(str, {
                parse_mode: 'HTML',
                ...Markup.keyboard([[str1]])
                  .oneTime()
                  .resize(),
              });
            } else if (taxi?.taxi_state === 'to_location') {
              let data = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
              );
              let str: string;
              let str1: string;
              let str2: string;
              let str3: string;
              var config = {
                method: 'GET',
                url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${taxi.from_lat}%2C${taxi.from_long}&destinations=${latitude}%2C${longitude}&key=${process.env.GOOGLE_API_KEY}`,
                headers: {},
              };
              const response = await axios(config);
              let distance_data = response.data;
              let distance = (
                distance_data.rows[0].elements[0].distance.value / 1000
              ).toFixed(1);
              let time = (
                distance_data.rows[0].elements[0].duration.value / 60
              ).toFixed();

              if (user?.dataValues.user_lang === 'UZB') {
                str = 'Manzillarni tasdiqlang';
                str1 = '🙅‍♀️ Bekor qilish';
                str2 = '✅ Tasdiqlayman';
                str3 = `🔰 Jo'natma turgan manzil: ${taxi.from_full_adr} \n\n🏁 Jo'natmani yetkazish manzili: ${data.data.display_name} \n\nMasofa: ${distance} km\nVaqti: ${time} min`;
              } else {
                str = 'Подтвердите адреса';
                str1 = '🙅‍♀️ Отмена';
                str2 = '✅ Подтверждаю';
                str3 = `🔰 Адрес отправки: ${taxi.from_full_adr} \n\n🏁 Адрес доставки: ${data.data.display_name} \n\nРасстояние: ${distance} км\nВремя: ${time} мин`;
              }
              taxi.to_lat = String(latitude);
              taxi.to_long = String(longitude);
              taxi.to_full_adr = data.data.display_name;
              taxi.taxi_state = 'to_location';
              taxi.taxi_distance = Number(distance);
              taxi.taxi_time = Number(time);
              await taxi.save();
              await ctx.telegram.sendChatAction(ctx.from.id, 'typing');
              await ctx.reply(str, { ...Markup.removeKeyboard() });
              await ctx.reply(str3, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                  [
                    { text: str2, callback_data: 'accepted' },
                    { text: str1, callback_data: 'cancelled' },
                  ],
                ]),
              });
            }
          } catch (error) {
            console.log(error);
          }
        } else if (user.last_state === 'driver') {
          const taxiDriver = await this.taxiRepo.findOne({
            where: {
              driver_id: String(ctx.from.id),
            },
            order: [['createdAt', 'DESC']],
          });
          if (taxiDriver?.taxi_state === 'select_driver') {
            const passenger = await this.userRepo.findOne({
              where: { user_id: taxiDriver.dataValues.user_id },
            });
            let strDriver = [];
            let strPassenger = [];

            if (user.user_lang === 'UZB') {
              strDriver = [
                `Ismi: ${passenger.dataValues.first_name} \nTelefon raqami: ${passenger.dataValues.phone_number} \nXizmat narxi: ${taxiDriver.dataValues.taxi_price} so'm`,
                `😔 Mashina buzilib qoldi`,
                "Jo'nash manziliga yetib keldim",
                "Yo'lovchi sizni kutmoqda ...",
              ];
            } else {
              strDriver = [
                `Имя: ${passenger?.dataValues?.first_name} \nНомер телефона: ${passenger?.dataValues?.phone_number} \nСтоимость услуги: ${taxiDriver.dataValues.taxi_price} сум`,
                '😔 Машина сломалась',
                'прибыл по адресу',
                'Вас ждет пассажир...',
              ];
            }
            let latitude: number;
            let longitude: number;
            if ('location' in ctx.message) {
              latitude = ctx.message.location.latitude;
              longitude = ctx.message.location.longitude;
            }
            var config = {
              method: 'GET',
              url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${latitude}%2C${longitude}&destinations=${taxiDriver.from_lat}%2C${taxiDriver.from_long}&key=${process.env.GOOGLE_API_KEY}`,
              headers: {},
            };
            const response = await axios(config);
            let distance_data = response.data;
            let distance = (
              distance_data.rows[0].elements[0].distance.value / 1000
            ).toFixed(1);
            let time = (
              distance_data.rows[0].elements[0].duration.value / 60
            ).toFixed();
            if (passenger.user_lang === 'UZB') {
              strPassenger = [
                `Taxi ${time} minutda yetib keladi. U sizdan ${distance} km masofada`,
                '🙅‍♀️ Bekor qilish',
              ];
            } else {
              strPassenger = [
                `Taxi ${time} minutda yetib keladi. U sizdan ${distance} km masofada`,
                '🙅‍♀️ Отмена',
              ];
            }
            taxiDriver.taxi_state = 'driver_on_from_location';
            await taxiDriver.save();
            await ctx.sendChatAction('typing');
            await ctx.reply(strDriver[3], {
              parse_mode: 'HTML',
              ...Markup.removeKeyboard(),
            });
            await ctx.reply(strDriver[0], {
              parse_mode: 'HTML',
              ...Markup.inlineKeyboard([
                [{ text: strDriver[2], callback_data: 'on_from_location' }],
                [{ text: strDriver[1], callback_data: 'broken_car' }],
              ]),
            });

            await ctx.telegram.sendMessage(
              taxiDriver.user_id,
              strPassenger[0],
              {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                  [{ text: strPassenger[1], callback_data: 'cancelled_taxi' }],
                ]),
              },
            );
          }
        }
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async deleteMyAddress(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if ('match' in ctx) {
        if (user.last_state === 'finish') {
          const id = ctx.match[0].slice(9);
          await this.usAddrRepo.destroy({ where: { id: id } });

          if (user.user_lang === 'UZB') {
            await ctx.reply(
              "Sizning doimiy manzilingiz muvaffaqiyatli o'chirildi",
              {
                parse_mode: 'HTML',
                ...uzKeyboards.main_menu,
              },
            );
          } else if (user.user_lang === 'RUS') {
            await ctx.reply('Ваш постоянный адрес успешно удален', {
              parse_mode: 'HTML',
              ...ruKeyboards.main_menu,
            });
          }
        }
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async actionForCallingTaxi(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if (user.last_state === 'finish') {
        if (user.user_lang === 'UZB') {
          await ctx.reply("Bu yerda taxi chaqirish tartibi bo'ladi");
        } else if (user.user_lang === 'RUS') {
          await ctx.reply('Вот процедура вызова такси');
        }
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async actionForUserContract(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if (user.user_lang === 'UZB') {
        await ctx.reply("Bu yerda foydalanuvchi shartnomasi bo'ladi");
      } else if (user.user_lang === 'RUS') {
        await ctx.reply('Здесь пользовательское соглашение');
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async contactWithUs(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if (user.last_state === 'finish') {
        if (user.user_lang === 'UZB') {
          await ctx.reply(
            "Bu yerda biz bilan bog'lanish uchun raqamlar va linklar bo'ladi",
          );
        } else if (user.user_lang === 'RUS') {
          await ctx.reply('Здесь будут номера и ссылки для связи с нами');
        }
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async toMainMenu(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if (user.last_state === 'finish') {
        if (user.user_lang === 'UZB') {
          await ctx.reply(uzReplyMessages.to_main_menu[1], {
            parse_mode: 'HTML',
            ...uzKeyboards.main_menu,
          });
        } else if (user.user_lang === 'RUS') {
          await ctx.reply(ruReplyMessages.to_main_menu[1], {
            parse_mode: 'HTML',
            ...ruKeyboards.main_menu,
          });
        }
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async actionForChangeLang(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      // if (user.last_state === 'finish') {
      await user.update({ last_state: 'change_lang' });
      await ctx.reply('Tilni tanlang | Выберите язык', {
        parse_mode: 'HTML',
        ...Markup.keyboard([["🇺🇿 O'zbek tili"], ['🇷🇺 Русский язык']])
          .oneTime()
          .resize(),
      });
      // }
    } else {
      await ctx.reply('/start');
    }
  }

  async hearsPermanentAddresses(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if (user.last_state === 'finish') {
        const userAddresses = await this.usAddrRepo.findAll({
          where: { user_id: user.user_id },
        });
        if (userAddresses.length > 1) {
          if (user.user_lang === 'UZB') {
            await ctx.reply("Kerakli harakatlanish yo'nalishini tanlang");
          } else if (user.user_lang === 'RUS') {
            await ctx.reply('Выберите желаемое направление движения');
          }
          for (let i = 0; i < userAddresses.length - 1; i++) {
            for (let a = i + 1; a < userAddresses.length; a++) {
              if (user.user_lang === 'UZB') {
                await ctx.reply(
                  uzReplyMessages.in_my_addresses(
                    userAddresses[i].address_name,
                    userAddresses[a].address_name,
                  ),
                  {
                    parse_mode: 'HTML',
                    ...uzKeyboards.in_this_direction(
                      userAddresses[i].id,
                      userAddresses[a].id,
                    ),
                  },
                );
              } else if (user.user_lang === 'RUS') {
                await ctx.reply(
                  ruReplyMessages.in_my_addresses(
                    userAddresses[i].address_name,
                    userAddresses[a].address_name,
                  ),
                  {
                    parse_mode: 'HTML',
                    ...ruKeyboards.in_this_direction(
                      userAddresses[i].id,
                      userAddresses[a].id,
                    ),
                  },
                );
              }
            }
          }
          for (let i = userAddresses.length - 1; i > 0; i--) {
            for (let a = i - 1; a >= 0; a--) {
              if (user.user_lang === 'UZB') {
                await ctx.reply(
                  uzReplyMessages.in_my_addresses(
                    userAddresses[i].address_name,
                    userAddresses[a].address_name,
                  ),
                  {
                    parse_mode: 'HTML',
                    ...uzKeyboards.in_this_direction(
                      userAddresses[i].id,
                      userAddresses[a].id,
                    ),
                  },
                );
              } else if (user.user_lang === 'RUS') {
                await ctx.reply(
                  ruReplyMessages.in_my_addresses(
                    userAddresses[i].address_name,
                    userAddresses[a].address_name,
                  ),
                  {
                    parse_mode: 'HTML',
                    ...ruKeyboards.in_this_direction(
                      userAddresses[i].id,
                      userAddresses[a].id,
                    ),
                  },
                );
              }
            }
          }
        } else {
          if (user.user_lang === 'UZB') {
            await ctx.reply(
              "Doimiy manzillar bo'yicha harakatlanish uchun kamida ikkita manzil kiritilgan bo'lishi kerak",
            );
          } else if (user.user_lang === 'RUS') {
            await ctx.reply(
              'Для перехода к постоянным адресам необходимо ввести как минимум два адреса',
            );
          }
        }
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async hearsCallTaxi(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      // if (user.last_state === 'finish') {
      await user.update({ last_state: 'taxi' }); //==============
      await this.taxiRepo.create({
        user_id: user.user_id,
        taxi_call_type: 'taxi',
        taxi_state: 'from_location',
      });

      if (user.user_lang === 'UZB') {
        await ctx.reply(uzReplyMessages.call_taxi.about);
        await ctx.reply(uzReplyMessages.call_taxi.methods, {
          parse_mode: 'HTML',
          ...Markup.keyboard([
            [
              Markup.button.locationRequest('📍 Manzilni yuborish'),
              '🙅‍♀️ Bekor qilish',
            ],
          ])
            .oneTime()
            .resize(),
        });
      } else if (user.user_lang === 'RUS') {
        await ctx.reply(ruReplyMessages.call_taxi.about);
        await ctx.reply(ruReplyMessages.call_taxi.methods, {
          parse_mode: 'HTML',
          ...ruKeyboards.req_location,
        });
      }
      // }
    } else {
      await ctx.reply('/start');
    }
  }
  //=======================

  async delivery(ctx: Context, lang: string) {
    try {
      const user = await this.userRepo.findOne({
        where: { user_id: String(ctx.from.id) },
      });
      if (user) {
        const taxi = await this.taxiRepo.create({
          user_id: String(ctx.from.id),
          taxi_call_type: 'delivery',
          taxi_state: 'from_location',
        });
        await user.update({ last_state: 'delivery' });
        let str1: string;
        let str2: string;
        let str3: string;
        let str4: string;
        if (lang === 'UZB') {
          str1 = `<b>«Lady Taxi»</b> boti hozirda test rejimida ishlamoqda. Yetarli miqdordagi haydovchi ayollar yig'ilganidan so'ng to'liq rejimda faoliyat olib boriladi. Bizga qiziqish bildirganingiz uchun rahmat!`;
          str2 = `Jo'natma turgan manzilni quyidagi usullardan biri orqali yuboring:

1. «📍 Manzilni yuborish» tugmasini bosing
        
2. Telegramning 📎 tugmasi orqali geolokatsiyani (Местоположение, Location) tanlang
        
3. Manzilni botga xabar ko'rinishida yuboring`;
          str3 = `📍 Manzilni yuborish`;
          str4 = '🙅‍♀️ Bekor qilish';
        } else {
          str1 = `<b>Бот «Lady Taxi» </b>в настоящее время работает в тестовом режиме. Он заработает в полном режиме, как только будет набрано достаточное количество водителей-женщин. Спасибо, что проявили к нам интерес!`;
          str2 = `Выберите адрес отправки одним из следующих способов:

1. Нажмите кнопку «📍 Отправить геолокацию»
    
2. Выберите геолокацию с помощью кнопки 📎 Телеграма
    
3. Отправьте адрес в виде сообщения`;
          str3 = `📍 Отправить геолокацию`;
          str4 = '🙅‍♀️ Отмена';
        }
        await ctx.telegram.sendChatAction(ctx.from.id, 'typing');
        await ctx.reply(str1, { parse_mode: 'HTML' });
        await ctx.reply(str2, {
          parse_mode: 'HTML',
          ...Markup.keyboard([[Markup.button.locationRequest(str3), str4]])
            .oneTime()
            .resize(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async canselled(ctx: Context) {
    try {
      const user = await this.userRepo.findOne({
        where: { user_id: String(ctx.from.id) },
      });
      const taxi = await this.taxiRepo.findOne({
        where: {
          user_id: String(ctx.from.id),
        },
        order: [['createdAt', 'DESC']],
      });
      if (taxi) {
        taxi.taxi_state = 'cancelled';
        await taxi.save();
        await user.update({ last_state: 'finish' });
      }
      await ctx.telegram.sendChatAction(ctx.from.id, 'typing');
      if (user?.user_lang === 'UZB') {
        await onMainUZB(ctx);
      } else {
        await onMainRUS(ctx);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onFromDelivery(ctx: Context) {
    try {
      let id: number;
      if ('match' in ctx) {
        id = Number(ctx.match[0].split('-')[2]);
      }
      const user = await this.userRepo.findOne({
        where: { user_id: String(ctx.from.id) },
      });
      const taxi = await this.taxiRepo.findOne({
        where: {
          user_id: String(ctx.from.id),
        },
        order: [['createdAt', 'DESC']],
      });
      const place = await this.addressRepo.findOne({ where: { id } });
      await ctx.replyWithLocation(place.coordinate_lat, place.coordinate_lon);
      let str = [];
      if (user?.user_lang === 'UZB') {
        str = [
          "Jo'natma yetkazish manzilini yuborish uchun Telegramning 📎 tugmasi orqali 📍 geolokatsiyani (Местоположение, Location) tanlang yoki manzilni botga ✏️ xabar ko'rinishida yuboring:",
          '🙅‍♀️ Bekor qilish',
        ];
      } else {
        str = [
          'Выберите адрес доставки с помощью кнопки 📎 Телеграма или ✏️ отправьте адрес в виде сообщения:',
          '🙅‍♀️ Отмена',
        ];
      }
      await ctx.reply(str[0], {
        parse_mode: 'HTML',
        ...Markup.keyboard([[str[1]]])
          .oneTime()
          .resize(),
      });
      taxi.from_lat = String(place.coordinate_lat);
      taxi.from_long = String(place.coordinate_lon);
      taxi.from_full_adr = `${place.address_name}, ${place.address_text}`;
      taxi.taxi_state = 'to_location';
      await taxi.save();
    } catch (error) {
      console.log(error);
    }
  }

  async onToDelivery(ctx: Context) {
    try {
      let id: number;
      if ('match' in ctx) {
        id = Number(ctx.match[0].split('-')[2]);
      }
      const user = await this.userRepo.findOne({
        where: { user_id: String(ctx.from.id) },
      });
      const taxi = await this.taxiRepo.findOne({
        where: {
          user_id: String(ctx.from.id),
        },
        order: [['createdAt', 'DESC']],
      });
      const place = await this.addressRepo.findOne({ where: { id } });
      await ctx.replyWithLocation(place.coordinate_lat, place.coordinate_lon);
      let data = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${place.coordinate_lat}&lon=${place.coordinate_lon}&format=json`,
      );
      let str: string[];

      var config = {
        method: 'GET',
        url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${taxi.from_lat}%2C${taxi.from_long}&destinations=${place.coordinate_lat}%2C${place.coordinate_lon}&key=${process.env.GOOGLE_API_KEY}`,
        headers: {},
      };
      const response = await axios(config);
      let distance_data = response.data;
      let distance = (
        distance_data.rows[0].elements[0].distance.value / 1000
      ).toFixed(1);
      let time = (
        distance_data.rows[0].elements[0].duration.value / 60
      ).toFixed();

      if (user?.dataValues.user_lang === 'UZB') {
        str = [
          'Manzillarni tasdiqlang',
          '🙅‍♀️ Bekor qilish',
          '✅ Tasdiqlayman',
          `🔰 Jo'natma turgan manzil: ${taxi.from_full_adr} \n\n🏁 Jo'natmani yetkazish manzili: ${data.data.display_name} \n\nMasofa: ${distance} km\nVaqti: ${time} min`,
        ];
      } else {
        str = [
          'Подтвердите адреса',
          '🙅‍♀️ Отмена',
          '✅ Подтверждаю',
          `🔰 Адрес отправки: ${taxi.from_full_adr} \n\n🏁 Адрес доставки: ${data.data.display_name} \n\nРасстояние: ${distance} км\nВремя: ${time} мин`,
        ];
      }
      taxi.to_lat = String(place.coordinate_lat);
      taxi.to_long = String(place.coordinate_lon);
      taxi.to_full_adr = data.data.display_name;
      taxi.taxi_distance = Number(distance);
      taxi.taxi_time = Number(time);
      taxi.taxi_state = 'to_location';
      await taxi.save();
      await ctx.telegram.sendChatAction(ctx.from.id, 'typing');
      await ctx.reply(str[0], { ...Markup.removeKeyboard() });
      await ctx.reply(str[3], {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [
            { text: str[2], callback_data: 'accepted' },
            { text: str[1], callback_data: 'cancelled' },
          ],
        ]),
      });
    } catch (error) {
      console.log(error);
    }
  }
  async onAccepted(ctx: Context) {
    try {
      const user = await this.userRepo.findOne({
        where: { user_id: String(ctx.from.id) },
      });
      const taxi = await this.taxiRepo.findOne({
        where: {
          user_id: String(ctx.from.id),
        },
        order: [['createdAt', 'DESC']],
      });
      let price;
      let min_price = parseInt(process.env.MIN_PRICE);
      let price_koef = parseFloat(process.env.PRICE_KOEF);
      let distance = taxi.taxi_distance * 1000;
      if (distance < 1000) {
        price = min_price;
      } else
        price =
          min_price +
          +(((distance - 1000) * price_koef) / 1000).toFixed() * 1000;
      taxi.taxi_price = price;
      taxi.taxi_state = 'waiting_driver';
      await taxi.save();
      let str = [];
      if (user?.user_lang === 'UZB') {
        str = [
          `Lady Taxi tomonidan taklif qilinayotgan narx: ${taxi.taxi_price} so'm.`,
          '✅ Roziman',
          '🙅‍♀️ Bekor qilish',
        ];
      } else {
        str = [
          `Предлагаемая цена от Lady Taxi: ${taxi.taxi_price} сум.`,
          '✅ Я согласнa',
          '🙅‍♀️ Отмена',
        ];
      }
      await ctx.sendChatAction('typing');
      await ctx.editMessageText(str[0], {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [
            { text: str[1], callback_data: 'confirmed' },
            { text: str[2], callback_data: 'cancelled' },
          ],
        ]),
      });
    } catch (error) {
      console.log(error);
    }
  }
  async onConfirmed(ctx: Context) {
    try {
      const user = await this.userRepo.findOne({
        where: { user_id: String(ctx.from.id) },
      });
      let strDriver = [];
      let strPassenger = [];
      const taxi = await this.taxiRepo.findOne({
        where: {
          user_id: String(ctx.from.id),
        },
        order: [['createdAt', 'DESC']],
      });
      if (taxi?.taxi_state !== 'waiting_driver') {
        return;
      }
      if (user?.user_lang == 'UZB') {
        strPassenger = [`Kuting! Taksi qidirilmoqda...`, '🙅‍♀️ Bekor qilish'];
      } else {
        strPassenger = [
          `Заказ успешно отправлен! \nИдет поиск автомобиля...`,
          '🙅‍♀️ Отмена',
        ];
      }

      await ctx.sendChatAction('typing');
      await ctx.editMessageText(strPassenger[0], {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [{ text: strPassenger[1], callback_data: 'cancelled' }],
        ]),
      });
      const drivers = await this.driverRepo.findAll({
        where: { work_status: true },
      });
      if (drivers.length > 0) {
        for (let driver of drivers) {
          let userDriver = await this.userRepo.findOne({
            where: { user_id: driver.user_id },
          });
          if (!taxi.block_drivers.includes(driver.user_id)) {
            if (userDriver?.user_lang == 'UZB') {
              strDriver = [
                `🔰 Jo'natma turgan manzil: ${taxi.from_full_adr} \n\n🏁 Jo'natmani yetkazish manzili: ${taxi.to_full_adr} \n\nMasofa: ${taxi.taxi_distance} km\nVaqti: ${taxi.taxi_time} min`,
                "📍 Jo'nash manzilini ko'rish",
                `✅ ${taxi.taxi_price} so'mga roziman`,
              ];
            } else {
              strDriver = [
                `🔰 Адрес отправки: ${taxi.from_full_adr} \n\n🏁 Адрес доставки: ${taxi.to_full_adr} \n\nРасстояние: ${taxi.taxi_distance} км\nВремя: ${taxi.taxi_time} мин`,
                '📍 Посмотреть местоположение',
                `✅ Я отвезу на ${taxi.taxi_price} сум`,
              ];
            }

            await ctx.telegram.sendMessage(driver.user_id, strDriver[0], {
              parse_mode: 'HTML',
              ...Markup.inlineKeyboard([
                [
                  {
                    text: strDriver[1],
                    callback_data: `show_location-${taxi.from_lat}-${taxi.from_long}`,
                  },
                ],
                [
                  {
                    text: strDriver[2],
                    callback_data: `confirm_driver-${taxi.id}`,
                  },
                ],
              ]),
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async onConfirmDriver(ctx: Context) {
    let taxi_id;
    if ('match' in ctx) {
      taxi_id = +ctx.match['input'].split('-')[1];
    }
    try {
      const driverUser = await this.userRepo.findOne({
        where: { user_id: String(ctx.from.id) },
      });
      await driverUser.update({ last_state: 'driver' });
      let strPassenger = [];
      let strDriver = [];
      const taxi = await this.taxiRepo.findOne({
        where: {
          id: taxi_id,
        },
      });
      const passenger = await this.userRepo.findOne({
        where: { user_id: String(taxi.user_id) },
      });
      const user_taxi = await this.taxiRepo.findOne({
        where: {
          user_id: taxi.user_id,
        },
        order: [['createdAt', 'DESC']],
      });

      const driver = await this.driverRepo.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (driverUser?.user_lang == 'UZB') {
        strDriver = [
          `Yo'lovchini boshqa taksi haydovchisi tanlashga ulgurdi 😔. Tayyor turing! Tez orada sizga yangi yo'lovchi topamiz 🔍`,
          "Masofani hisoblash uchun '📍 Geolokatsiyani yuborish' tugmasini bosing yoki 📎 Telegram tugmasi yordamida geolokatsiyani tanlang!",
          '📍 Manzilni yuborish',
          'Mashina buzilib qoldi 😔',
        ];
      } else {
        strDriver = [
          `Взял другой таксист 😔. Будьте готовы! Мы скоро найдем вам нового пассажира 🔍`,
          'Чтобы рассчитать расстояние нажмите кнопку «📍 Отправить геолокацию» или Выберите геолокацию  с помощью кнопки 📎 Телеграма!',
          '📍 Отправить геолокацию',
          'Машина сломалась 😔',
        ];
      }
      if (passenger?.user_lang == 'UZB') {
        strPassenger = [
          '🙅‍♀️ Bekor qilish',
          `Haydovchi ismi: ${driver.first_name} \nTelefon raqami: ${driver.phone_number} \nTelegram username: @${driver.username} \nAvtomobil modeli: ${driver.car_model} \nAvtomobil rangi: ${driver.car_color} \nAvtomobil raqami: ${driver.car_number} \nXizmat naxi: ${taxi.taxi_price}`,
        ];
      } else {
        strPassenger = [
          '🙅‍♀️ Отмена',
          `Имя водителя: ${driver.first_name} \nНомер телефона: ${driver.phone_number} \nИмя пользователя Telegram: @${driver.username} \nМодель автомобиля: ${driver.car_model} \nЦвет автомобиля: ${driver.car_color} \nНомер автомобиля: ${driver.car_number} \nСтоимость услуги: ${taxi.taxi_price}`,
        ];
      }

      if (taxi.taxi_state !== 'waiting_driver' || user_taxi.id !== taxi.id) {
        ctx.reply(strDriver[0]);
        return;
      }

      await ctx.sendChatAction('typing');
      await ctx.telegram.sendMessage(+taxi.user_id, strPassenger[1], {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [{ text: strPassenger[0], callback_data: 'cancelled_taxi' }],
        ]),
      });

      await ctx.reply(strDriver[1], {
        parse_mode: 'HTML',
        ...Markup.keyboard([
          [Markup.button.locationRequest(strDriver[2])],
          [strDriver[3]],
        ]).resize(),
      });
      taxi.driver_id = driver.user_id;
      taxi.taxi_state = 'select_driver';
      taxi.save();
    } catch (error) {
      console.log(error);
    }
  }
  async onShowLocation(ctx: Context) {
    try {
      let lat: number;
      let lon: number;
      if ('match' in ctx) {
        lat = +ctx.match['input'].split('-')[1];
        lon = +ctx.match['input'].split('-')[2];
      }
      ctx.replyWithLocation(lat, lon);
    } catch (error) {
      console.log(error);
    }
  }

  async cancelled_taxi(ctx: Context) {
    try {
      let strUser = [];
      let strDriver = [];
      const user = await this.userRepo.findOne({
        where: { user_id: String(ctx.from.id) },
      });
      const taxi = await this.taxiRepo.findOne({
        where: {
          user_id: String(ctx.from.id),
        },
        order: [['createdAt', 'DESC']],
      });
      if (
        taxi.taxi_state == 'select_driver' ||
        taxi.taxi_state == 'driver_on_from_location'
      ) {
        const driver = await this.userRepo.findOne({
          where: { user_id: taxi.driver_id },
        });
        if (user?.user_lang == 'UZB') {
          strUser = [
            'Bu haydovchi bekor qilindi ',
            '✅ Yangi taxi chaqirish',
            '🙅‍♀️ Bekor qilish',
          ];
        } else {
          strUser = [
            'Этот шофёр был отменен',
            '✅ Вызов нового такси',
            '🙅‍♀️ Отмена',
          ];
        }
        if (driver?.user_lang === 'UZB') {
          strDriver = [
            "Yo'lovchi taksini bekor qildi. Tez orada sizga yangi yo'lovchilar jo'natamiz. Tayyor turing.",
            'Dam olish 🛋',
          ];
        } else {
          strDriver = [
            'Пассажир отказался от такси. Мы отправим вам новых пассажиров в ближайшее время. Приготовься.',
            'Oтдыхать 🛋',
          ];
        }
        const block_drivers = taxi.dataValues.block_drivers;
        block_drivers.push(driver.user_id);
        taxi.taxi_state = 'waiting_driver';
        taxi.driver_id = null;
        await taxi.update({
          block_drivers: block_drivers,
        });
        await taxi.changed('block_drivers', true);
        await taxi.save();
        await ctx.sendChatAction('typing');
        await ctx.reply(strUser[0], {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            [
              { text: strUser[1], callback_data: 'confirmed' },
              { text: strUser[2], callback_data: 'cancelled' },
            ],
          ]),
        });
        await ctx.telegram.sendMessage(driver.user_id, strDriver[0], {
          parse_mode: 'HTML',
          ...Markup.keyboard([[strDriver[1]]]).resize(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async brokenCar(ctx: Context) {
    let strUser = [];
    let strDriver = [];

    const driver = await this.userRepo.findOne({
      where: { user_id: String(ctx.from.id) },
    });
    const taxi = await this.taxiRepo.findOne({
      where: {
        driver_id: String(ctx.from.id),
      },
      order: [['createdAt', 'DESC']],
    });

    const user = await this.userRepo.findOne({
      where: { user_id: taxi.user_id },
    });

    if (
      taxi.taxi_state == 'select_driver' ||
      taxi.taxi_state == 'driver_on_from_location'
    ) {
      if (driver.user_lang == 'UZB') {
        strDriver = [
          "Avtomobilingizni imkon qadar tezroq ta'mirlang va haydovchilar safiga qayting.",
          'Dam olish 🛋',
        ];
      } else {
        strDriver = [
          'Отремонтируйте свою машину как можно быстрее и вернитесь в ряды водителей.',
          'Oтдыхать 🛋',
        ];
      }

      if (user?.user_lang == 'UZB') {
        strUser = [
          'Haydovchining mashinasi buzilib qoldi',
          '✅ Yangi taxi chaqirish',
          '🙅‍♀️ Bekor qilish',
        ];
      } else {
        strUser = [
          'У водителя сломалась машина',
          '✅ Вызов нового такси',
          '🙅‍♀️ Отмена',
        ];
      }
      const block_drivers = taxi.dataValues.block_drivers;
      block_drivers.push(driver.user_id);
      taxi.taxi_state = 'waiting_driver';
      taxi.driver_id = null;
      await taxi.update({
        block_drivers: block_drivers,
      });
      await taxi.changed('block_drivers', true);
      await taxi.save();
      await ctx.sendChatAction('typing');
      await ctx.telegram.sendMessage(user.user_id, strUser[0], {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [
            { text: strUser[1], callback_data: 'confirmed' },
            { text: strUser[2], callback_data: 'cancelled' },
          ],
        ]),
      });
      await ctx.reply(strDriver[0], {
        parse_mode: 'HTML',
        ...Markup.keyboard([[strDriver[1]]]).resize(),
      });
    }
  }

  async onFromLocation(ctx: Context) {
    let strUser = [];
    let strDriver = [];

    const driver = await this.userRepo.findOne({
      where: { user_id: String(ctx.from.id) },
    });
    const taxi = await this.taxiRepo.findOne({
      where: {
        driver_id: String(ctx.from.id),
      },
      order: [['createdAt', 'DESC']],
    });

    const user = await this.userRepo.findOne({
      where: { user_id: taxi.user_id },
    });

    if (taxi.taxi_state == 'driver_on_from_location') {
      if (driver.user_lang == 'UZB') {
        strDriver = [
          `Yurishni boshlaganingizda "Yurishni boshladik" knopkasini bosing`,
          'Yurishni boshladik',
        ];
      } else {
        strDriver = [
          'Когда вы начнете ходить, нажмите кнопку «движения началось».',
          'движения началось',
        ];
      }

      if (user?.user_lang == 'UZB') {
        strUser = ['Taksi yetib keldi'];
      } else {
        strUser = ['Такси прибыло'];
      }

      taxi.taxi_state = 'start_taxi_action';
      await taxi.save();

      await ctx.sendChatAction('typing');
      await ctx.reply(strDriver[0], {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [{ text: strDriver[1], callback_data: 'start_location' }],
        ]),
      });

      await ctx.telegram.sendChatAction(+user.user_id, 'typing');
      await ctx.telegram.sendMessage(+user.user_id, strUser[0]);
    }
  }

  async start_taxi_action(ctx: Context) {
    try {
      let strDriver = [];

      const driver = await this.userRepo.findOne({
        where: { user_id: String(ctx.from.id) },
      });
      const taxi = await this.taxiRepo.findOne({
        where: {
          driver_id: String(ctx.from.id),
        },
        order: [['createdAt', 'DESC']],
      });

      const user = await this.userRepo.findOne({
        where: { user_id: taxi.user_id },
      });

      if (taxi.taxi_state == 'start_taxi_action') {
        await taxi.update({ taxi_start_time: new Date() });
        if (driver.user_lang == 'UZB') {
          strDriver = [
            "Quyidagi lokatsiyaga borish kerak 👇🏽. Yetib borganingizda 'Yetib bordik' knopkasini bosing",
            'Yetib bordik',
          ];
        } else {
          strDriver = [
            'Вам нужно перейти в следующую локацию 👇🏽. Когда вы приедете, нажмите кнопку «Мы прибыли',
            'Мы приехали',
          ];
        }
        taxi.taxi_state = 'finish_location';
        await taxi.save();

        await ctx.sendChatAction('typing');
        await ctx.reply(strDriver[0], {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            [{ text: strDriver[1], callback_data: 'finish_location' }],
          ]),
        });
        await ctx.sendLocation(+taxi.to_lat, +taxi.to_long);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async finish_location(ctx: Context) {
    try {
      let strDriver = [];
      let strPossenger = [];

      const driver = await this.userRepo.findOne({
        where: { user_id: String(ctx.from.id) },
      });
      const taxi = await this.taxiRepo.findOne({
        where: {
          driver_id: String(ctx.from.id),
        },
        order: [['createdAt', 'DESC']],
      });

      const user = await this.userRepo.findOne({
        where: { user_id: taxi.user_id },
      });

      if (taxi.taxi_state == 'finish_location') {
        await taxi.update({ taxi_end_time: new Date() });
        await user.update({ last_state: 'finish' });
        await driver.update({ last_state: 'finish' });
        if (driver.user_lang === 'UZB') {
          strDriver = [
            "Salomat bo'ling. Biz tez orada sizga yangi yo'lovchi topamiz",
            'Dam olish 🛋',
          ];
        } else {
          strDriver = [
            '«Будьте здоровы. Скоро мы найдем вам нового пассажира»,',
            'Oтдыхать 🛋',
          ];
        }
        if (user.user_lang === 'UZB') {
          strPossenger = [
            `Sizga hizmat ko'rsatishdan hursand bo'lamiz. \nHaydovchi ko'rsatgan hizmatni baholang`,
          ];
        } else {
          strPossenger = [
            `Мы будем рады служить вам. \nОцените услугу водителя`,
          ];
        }
        taxi.taxi_state = 'finished_full';
        await taxi.save();

        await ctx.sendChatAction('typing');
        await ctx.reply(strDriver[0], {
          parse_mode: 'HTML',
          ...Markup.keyboard([[strDriver[1]]]).resize(),
        });

        await ctx.telegram.sendMessage(+user.user_id, strPossenger[0], {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            [
              { text: '1️⃣', callback_data: 'marking-1' },
              { text: '2️⃣', callback_data: 'marking-2' },
              { text: '3️⃣', callback_data: 'marking-3' },
              { text: '4️⃣', callback_data: 'marking-4' },
              { text: '5️⃣', callback_data: 'marking-5' },
            ],
          ]),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async marking(ctx: Context) {
    try {
      const user = await this.userRepo.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (user.user_lang == 'UZB') {
        await onMainUZB(ctx);
      } else {
        await onMainRUS(ctx);
      }
    } catch (error) {
      console.log('salom');
    }
  }

  //====================

  async onDriver(ctx: Context) {
    const driver = await this.driverRepo.findOne({
      where: {
        user_id: `${ctx.from.id}`,
      },
    });
    const user = await this.userRepo.findOne({
      where: {
        user_id: `${ctx.from.id}`,
      },
    });
    if (driver) {
      if (user.user_lang == 'UZB') {
        return this.workStatusTrue(ctx, 'UZB');
      } else {
        return this.workStatusFalse(ctx, 'RUS');
      }
    } else if (!user) {
      await ctx.replyWithHTML(
        '<b>Lady Taxi xizmatining haydovchi rejimiga xush kelibsiz</b>',
      );
      await ctx.replyWithHTML(
        "Haydovchi rejimiga o'tish uchun avval Mijoz rejimiga o'tib profilning Ism va Telefon ma'lumotlarini to'liq kiriting.",
      );
    } else {
      await this.driverRepo.create({
        user_id: `${user.user_id}`,
        first_name: `${user.first_name}`,
        last_name: `${user.last_name}`,
        username: `${user.username}`,
        user_lang: `${user.user_lang}`,
        phone_number: `${user.phone_number}`,
      });
      if (user.user_lang == 'UZB') {
        await ctx.reply(
          'Lady Taxi xizmatining haydovchi rejimiga xush kelibsiz !',
        );
        await ctx.reply(
          "Lady Taxi xizmatida haydovchi sifatida ro'yxatdan o'tish uchun «Ro'yxatdan o'tish» tugmasini bosing.",
          {
            parse_mode: 'HTML',
            ...Markup.keyboard(["👩🏼‍💻 Ro'yxatdan o'tish"]).oneTime().resize(),
          },
        );
      } else {
        await ctx.reply('Добро пожаловать в режим Таксист!');
        await ctx.reply(
          'Чтобы зарегистрироваться в качестве водителя в сервисе Lady Taxi, нажмите кнопку «Зарегистрироваться».',
          {
            parse_mode: 'HTML',
            ...Markup.keyboard(['👩🏼‍💻 Зарегистрироваться']).oneTime().resize(),
          },
        );
      }
    }
  }

  async registrationDriver(ctx: Context, lang: String) {
    await this.userRepo.update(
      {
        last_state: 'car_number',
      },
      {
        where: {
          user_id: `${ctx.from.id}`,
        },
      },
    );

    if (lang == 'UZB') {
      await ctx.reply('Avtomobil raqamini kiriting', {
        parse_mode: 'HTML',
      });
    } else {
      await ctx.reply('Введите номер автомобиля', {
        parse_mode: 'HTML',
      });
    }
  }

  async verifyDriver(ctx: Context) {
    let index;
    if ('match' in ctx) {
      const message = ctx.match[0];
      index = message.split('=')[1];
    }
    const idUser = await this.userRepo.findOne({
      where: {
        user_id: `${index}`,
      },
    });
    console.log(index);
    console.log(idUser);
    if (idUser.user_lang == 'UZB') {
      await ctx.telegram.sendMessage(
        `${index}`,
        'Admin sizga ruxsat berdi. Statusingizni tekshirib oling !',
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            Markup.button.callback(
              '☑️ Statusni tekshirish',
              'checkDriverStatus',
            ),
          ]),
        },
      );
    } else {
      await ctx.telegram.sendMessage(
        `${index}`,
        'Админ дал вам разрешение. Проверьте свой статус !',
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            Markup.button.callback('☑️ Проверь состояние', 'checkDriverStatus'),
          ]),
        },
      );
    }
  }

  async notAccesDriver(ctx: Context) {
    let index;
    if ('match' in ctx) {
      const message = ctx.match[0];
      index = message.split('=')[1];
    }
    const idUser = await this.userRepo.findOne({
      where: {
        user_id: `${index}`,
      },
    });
    if (idUser.user_lang == 'UZB') {
      await ctx.telegram.sendMessage(
        `${index}`,
        "Afsuski admin sizga ruxsat bermadi, Ma'lum muddatdan so'ng qayta urinib ko'ring ! ",
      );
    } else {
      await ctx.telegram.sendMessage(
        `${index}`,
        'К сожалению, админ не разрешил, попробуйте еще раз через определенный промежуток времени!',
      );
    }
  }

  async checkDriverStatus(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: {
        user_id: `${ctx.from.id}`,
      },
    });
    if (user.user_lang == 'UZB') {
      await ctx.reply(
        "Tabriklaymiz ! Siz <b>Lady Taxy</b> haydovchilari safiga qo'shildingiz !\n Hozirdan ishni boshlashingiz mumkin !",
        {
          parse_mode: 'HTML',
          ...Markup.keyboard([
            '🚕 Hozirdan ishlayman !',
            '🛋 Hozircha dam olaman',
          ])
            .oneTime()
            .resize(),
        },
      );
    } else {
      await ctx.reply(
        'Поздравляем! Вы пополнили ряды водителей <b>Lady Taxi</b>!\n Вы можете начать работать прямо сейчас!',
        {
          parse_mode: 'HTML',
          ...Markup.keyboard(['🚕 Я сейчас работаю !', '🛋 Я пока отдохну'])
            .oneTime()
            .resize(),
        },
      );
    }
  }

  async workStatusTrue(ctx: Context, lang: String) {
    await this.driverRepo.update(
      {
        last_state: 'ReadyToWork',
        work_status: true,
      },
      {
        where: {
          user_id: `${ctx.from.id}`,
        },
      },
    );
    if (lang == 'UZB') {
      await ctx.reply('🚖 Kuting, mijozlar chiqishi bilan sizga sms yozasiz', {
        parse_mode: 'HTML',
        ...Markup.keyboard([["⛔️ Ishni to'xtatish"]])
          .oneTime()
          .resize(),
      });
    } else {
      await ctx.reply(
        '🚖 Подождите, как только клиенты уйдут, вам придет СМС',
        {
          parse_mode: 'HTML',
          ...Markup.keyboard([['⛔️ Остановить работу']])
            .oneTime()
            .resize(),
        },
      );
    }
  }

  async workStatusFalse(ctx: Context, lang: String) {
    await this.driverRepo.update(
      {
        last_state: 'offWork',
        work_status: false,
      },
      {
        where: {
          user_id: `${ctx.from.id}`,
        },
      },
    );
    if (lang == 'UZB') {
      await ctx.reply('🚖 Tezroq ishga qayting !', {
        parse_mode: 'HTML',
        ...Markup.keyboard([['🚕 Hozirdan ishlayman !']])
          .oneTime()
          .resize(),
      });
    } else {
      await ctx.reply('🚖 Скорей вернись к работе!', {
        parse_mode: 'HTML',
        ...Markup.keyboard([['🚕 Я сейчас работаю !']])
          .oneTime()
          .resize(),
      });
    }
  }

  async noConfirmtaxi(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      const taxi = await this.taxiRepo.findOne({
        where: { user_id: user.user_id, taxi_call_type: 'taxi' },
        order: [['createdAt', 'DESC']],
      });
      if (taxi) {
        await taxi.update({ taxi_state: 'cancelled' });
        await user.update({ last_state: 'finish' });
        if (user.user_lang === 'UZB') {
          await onMainUZB(ctx);
        } else if (user.user_lang === 'RUS') {
          await onMainRUS(ctx);
        }
      } else {
        await ctx.reply('/start');
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async ConfirmTaxi(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      const taxi = await this.taxiRepo.findOne({
        where: { user_id: user.user_id, taxi_call_type: 'taxi' },
        order: [['createdAt', 'DESC']],
      });
      if (taxi) {
        if (taxi.info === 'confirm_location') {
          await taxi.update({ info: 'confirm_price' });
          let price;
          let min_price = parseInt(process.env.MIN_PRICE);
          let price_koef = parseFloat(process.env.PRICE_KOEF);
          let distance = taxi.taxi_distance * 1000;
          if (distance < 1000) {
            price = min_price;
          } else
            price =
              min_price +
              +(((distance - 1000) * price_koef) / 1000).toFixed() * 1000;
          await taxi.update({ taxi_price: price });
          if (user.user_lang === 'UZB') {
            await ctx.telegram.editMessageText(
              user.user_id,
              taxi.message_id,
              null,
              uzReplyMessages.suggested_price(taxi.taxi_price),
              { parse_mode: 'HTML', ...uzKeyboards.iagree },
            );
          } else if (user.user_lang === 'RUS') {
            await ctx.telegram.editMessageText(
              user.user_id,
              taxi.message_id,
              null,
              ruReplyMessages.suggested_price(taxi.taxi_price),
              { parse_mode: 'HTML', ...ruKeyboards.iagree },
            );
          }
        }
      } else {
        await ctx.reply('/start');
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async ConfirmPrice(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      const taxi = await this.taxiRepo.findOne({
        where: { user_id: user.user_id, taxi_call_type: 'taxi' },
        order: [['createdAt', 'DESC']],
      });
      if (taxi) {
        if (taxi.info === 'confirm_price') {
          await taxi.update({ info: 'find_car' });

          const drivers = await this.driverRepo.findAll({
            where: { work_status: true },
          });
          if (drivers.length) {
            for (let driver of drivers) {
              let userDriver = await this.userRepo.findOne({
                where: { user_id: driver.user_id },
              });
              if (!taxi.block_drivers.includes(driver.user_id)) {
                if (userDriver?.user_lang == 'UZB') {
                  await ctx.telegram.sendMessage(
                    userDriver.user_id,
                    `🔰 Yo'lovchi turgan manzil: ${taxi.from_full_adr} \n\n🏁 Yo'lovchini yetkazish manzili: ${taxi.to_full_adr} \n\nMasofa: ${taxi.taxi_distance} km\nVaqti: ${taxi.taxi_time} min`,
                    {
                      parse_mode: 'HTML',
                      ...Markup.inlineKeyboard([
                        Markup.button.callback(
                          "📍 Jo'nash manzilini ko'rish",
                          `show_location-${taxi.from_lat}-${taxi.from_long}`,
                        ),
                        Markup.button.callback(
                          `✅ ${taxi.taxi_price} so'mga roziman`,
                          `iwilltake=${taxi.id}`,
                        ),
                      ]),
                    },
                  );
                } else if (userDriver.user_lang === 'RUS') {
                  await ctx.telegram.sendMessage(
                    userDriver.user_id,
                    `🔰 Yo'lovchi turgan manzil: ${taxi.from_full_adr} \n\n🏁 Yo'lovchini yetkazish manzili: ${taxi.to_full_adr} \n\nMasofa: ${taxi.taxi_distance} km\nVaqti: ${taxi.taxi_time} min`,
                    {
                      parse_mode: 'HTML',
                      ...Markup.inlineKeyboard([
                        Markup.button.callback(
                          "📍 Jo'nash manzilini ko'rish",
                          `show_location-${taxi.from_lat}-${taxi.from_long}`,
                        ),
                        Markup.button.callback(
                          `✅ ${taxi.taxi_price} so'mga roziman`,
                          `iwilltake=${taxi.id}`,
                        ),
                      ]),
                    },
                  );
                }
              }
            }
          }

          if (user.user_lang === 'UZB') {
            await ctx.telegram.editMessageText(
              user.user_id,
              taxi.message_id,
              null,
              uzReplyMessages.waiting_find_taxi,
              {
                parse_mode: 'HTML',
                ...uzKeyboards.cancel_inline,
              },
            );
          } else if (user.user_lang === 'RUS') {
            await ctx.telegram.editMessageText(
              user.user_id,
              taxi.message_id,
              null,
              ruReplyMessages.waiting_find_taxi,
              {
                parse_mode: 'HTML',
                ...ruKeyboards.cancel_inline,
              },
            );
          }
        }
      } else {
        await ctx.reply('/start');
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async confirmInDriverAndSendHisToUser(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if ('match' in ctx) {
        const driver = await this.driverRepo.findOne({
          where: { user_id: user.user_id },
        });
        if (driver) {
          const id = ctx.match[0].slice(10);
          const taxi = await this.taxiRepo.findOne({ where: { id: +id } });
          await user.update({ last_state: 'driver' });
          if (taxi) {
            if (taxi.info === 'find_car') {
              await taxi.update({
                driver_id: driver.user_id,
                info: 'finish',
                taxi_state: 'select_driver',
              });
              const user = await this.userRepo.findOne({
                where: { user_id: taxi.user_id },
              });
              if (user) {
                if (user.user_lang === 'UZB') {
                  await ctx.telegram.sendMessage(
                    user.user_id,
                    uzReplyMessages.about_driver__for_user(
                      driver.first_name,
                      driver.phone_number,
                      driver.car_model,
                      driver.car_color,
                      driver.car_number,
                      taxi.taxi_price,
                    ),
                  );
                } else if (user.user_lang === 'RUS') {
                  await ctx.telegram.sendMessage(
                    user.user_id,
                    ruReplyMessages.about_driver__for_user(
                      driver.first_name,
                      driver.phone_number,
                      driver.car_model,
                      driver.car_color,
                      driver.car_number,
                      taxi.taxi_price,
                    ),
                  );
                }
              }

              await ctx.reply(uzReplyMessages.req_calculate_distance);
            }
          } else {
            await ctx.reply('/start');
          }
        } else {
          await ctx.reply('/start');
        }
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async confirmInMyAddresses(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if ('match' in ctx) {
        console.log(ctx.match[0]);
        const arr = ctx.match[0].split('=');
        const from = arr[1];
        const to = arr[3];
        console.log(from, to);
        const fromAd = await this.usAddrRepo.findOne({ where: { id: from } });
        const toAd = await this.usAddrRepo.findOne({ where: { id: to } });
        const taxi = await Taxi.create({
          user_id: user.user_id,
          from_full_adr: fromAd.full_address,
          from_lat: fromAd.lat,
          from_long: fromAd.lon,
          to_full_adr: toAd.full_address,
          to_lat: toAd.lat,
          to_long: toAd.lon,
          taxi_call_type: 'taxi',
        });
        var config = {
          method: 'GET',
          url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${taxi.from_lat}%2C${taxi.from_long}&destinations=${taxi.to_lat}%2C${taxi.to_long}&key=${process.env.GOOGLE_API_KEY}`,
          headers: {},
        };
        const response = await axios(config);
        let distance_data = response.data;
        let distance = (
          distance_data.rows[0].elements[0].distance.value / 1000
        ).toFixed(1);
        let time = (
          distance_data.rows[0].elements[0].duration.value / 60
        ).toFixed();

        taxi.update({
          taxi_distance: +distance,
          taxi_time: +time,
          taxi_state: 'driver',
          info: 'confirm_location',
        });
        await taxi.save();

        if (user.user_lang === 'UZB') {
          await ctx.reply('Manzillarni tasdiqlang');
          const message = await ctx.reply(
            `🔰 Jo'nash manzilingiz: ${taxi.from_full_adr}\n\n🏁 Borish manzilingiz: ${taxi.to_full_adr}\n\nMasofa: ${distance} km\nVaqti: ${time} min`,
            {
              parse_mode: 'HTML',
              ...Markup.inlineKeyboard([
                Markup.button.callback('✅ Tasdiqlayman', 'okconfirmlocation'),
                Markup.button.callback('🙅‍♀️ Bekor qilish', 'noconfirmlocation'),
              ]),
            },
          );
          taxi.update({ message_id: message.message_id });
          await taxi.save();
        } else if (user.user_lang === 'RUS') {
          await ctx.reply('Manzillarni tasdiqlang');
          const message = await ctx.reply(
            `🔰 Адрес отправления: ${taxi.from_full_adr}\n\n🏁 Адрес назначения: ${taxi.to_full_adr}\n\nРасстояние: ${distance} км\nВремя: ${time} мин`,
            {
              parse_mode: 'HTML',
              ...Markup.inlineKeyboard([
                Markup.button.callback('✅ Подтверждаю', 'okconfirmlocation'),
                Markup.button.callback('🙅‍♀️ Отменить', 'noconfirmlocation'),
              ]),
            },
          );
          taxi.update({ message_id: message.message_id });
          await taxi.save();
        }
      } else {
        await ctx.reply('/start');
      }
    }
  }

  async hearsMicroBus(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      const busDirections = await this.microbusRepo.findAll();
      let directions = [];
      for (let i = 0; i < busDirections.length; i++) {
        directions.push([
          Markup.button.callback(
            `${busDirections[i].full_direction_names}`,
            `seethis=${busDirections[i].id}`,
          ),
        ]);
      }
      if (user.user_lang === 'UZB') {
        await ctx.reply("Mavjud yo'nalishlar", {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([...directions]),
        });
      } else if (user.user_lang === 'RUS') {
        await ctx.reply('Доступные маршруты', {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([...directions]),
        });
      }
    } else {
      await ctx.reply('/start');
    }
  }

  async showBusDirection(ctx: Context) {
    const user = await this.userRepo.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
      if ('match' in ctx) {
        const id = ctx.match[0].split('=')[1];
        const busDirection = await this.microbusRepo.findOne({
          where: { id: +id },
        });
        // console.log(busDirection);
        if (user.user_lang === 'UZB') {
          // console.log(__dirname+busDirection.photo);
          const str = `🚍 Yo'nalish nomi: ${busDirection.full_direction_names}\n🕐 Qatnov vaqti: ${busDirection.work_time} gacha\n🚎 Mikroavtobuslar soni: ${busDirection.total_busses} ta\n🛣 Masofa: ${busDirection.direction_distance} km\n💷 Narxi: ${busDirection.price} so'm\n⏳ Borish vaqti: ${busDirection.finish_time} min`;
          await ctx.replyWithPhoto(
            { source: __dirname + '/..' + busDirection.photo },
            {
              caption: str,
              ...Markup.inlineKeyboard([
                [
                  Markup.button.callback(
                    `${busDirection.full_direction_names.split('-')[0]}`,
                    `show_location-${busDirection.from_coord}`,
                  ),
                ],
                [
                  Markup.button.callback(
                    `${busDirection.full_direction_names.split('-')[1]}`,
                    `show_location-${busDirection.to_coord}`,
                  ),
                ],
              ]),
            },
          );
        } else if (user.user_lang === 'RUS') {
          const str = `🚍 Название направления: ${busDirection.full_direction_names}\n🕐 Время в пути: до ${busDirection.work_time}\n🚎 Количество маршруток: до ${busDirection.total_busses}\n🛣 Расстояние: ${busDirection.direction_distance} км\n💷 Цена: ${busDirection.price} сом\n⏳ Время в пути: ${busDirection.finish_time} мин`;
          await ctx.replyWithPhoto(
            { source: __dirname + '/..' + busDirection.photo },
            {
              caption: str,
              ...Markup.inlineKeyboard([
                [
                  Markup.button.callback(
                    `${busDirection.full_direction_names.split('-')[0]}`,
                    `show_location-${busDirection.from_coord}`,
                  ),
                ],
                [
                  Markup.button.callback(
                    `${busDirection.full_direction_names.split('-')[1]}`,
                    `show_location-${busDirection.to_coord}`,
                  ),
                ],
              ]),
            },
          );
        }
      }
    } else {
      await ctx.reply('/start');
    }
  }
}
