import { Markup } from 'telegraf';

export const uzKeyboards = {
  lang_selection: Markup.keyboard([
    ["🇺🇿 O'zbek tili"],
    ['🇷🇺 Русский язык'],
    ['🇺🇸 English Language'],
  ])
    .oneTime()
    .resize(),

  main_menu: Markup.keyboard([
    ['🚖 Taksi chaqirish 🙋‍♀️', '🚚 Yetkazib berish 🙋🏻‍♀️'],
    ['👩‍🔧 Profil', '🏠 Doimiy manzillar'],
  ])
    .oneTime()
    .resize(),

  registration: Markup.keyboard(["✅ Ro'yxatdan o'tish"]).oneTime().resize(),

  req_send_number: Markup.keyboard([
    Markup.button.contactRequest('Telefon raqamimni yuborish'),
  ])
    .oneTime()
    .resize(),

  choose_real_name: (usernick: string) => {
    return Markup.inlineKeyboard([
      Markup.button.callback(
        `Men "${usernick}" ismimni tanlayman`,
        `savedefaultname`,
      ),
    ]);
  },

  choose_working_number: (phone_number) => {
    Markup.inlineKeyboard([
      Markup.button.callback(
        `Men "${phone_number}" raqamimni tanlayman`,
        'savedefaultnumber',
      ),
    ]);
  },

  choose_this_address: (i: number) => {
    Markup.inlineKeyboard([
      Markup.button.callback('Shu manzilni tanlayman 👆', `thismy=${i}`),
    ]);
  },

  check_activity: Markup.keyboard(['✔️ Faollikni tekshirish'])
    .oneTime()
    .resize(),

  iconfirm: Markup.inlineKeyboard([
    Markup.button.callback('✅ Tasdiqlayman', 'okconfirmlocation'),
    Markup.button.callback('🙅‍♀️ Bekor qilish', 'noconfirmlocation'),
  ]),

  req_location: Markup.keyboard([
    [Markup.button.locationRequest('📍 Manzilni yuborish'), '🙅‍♀️ Bekor qilish'],
  ])
    .oneTime()
    .resize(),

  cancel: Markup.keyboard([['🙅‍♀️ Bekor qilish']])
    .oneTime()
    .resize(),
  cancel_replace_name: Markup.inlineKeyboard([
    Markup.button.callback('🙅‍♀️ Bekor qilish', 'noreplacename'),
  ]),
  cancel_replace_phone: Markup.inlineKeyboard([
    Markup.button.callback('🙅‍♀️ Bekor qilish', 'noreplacephone'),
  ]),

  iagree: Markup.inlineKeyboard([
    Markup.button.callback('✅ Roziman', 'okconfirmprice'),
    Markup.button.callback('🙅‍♀️ Bekor qilish', 'noconfirmprice'),
  ]),

  cancel_inline: Markup.inlineKeyboard([
    Markup.button.callback('🙅‍♀️ Bekor qilish', 'cancelfindcar'),
  ]),

  registration_for_driver: Markup.keyboard(["👩‍💻 Ro'yxatdan o'tish"])
    .oneTime()
    .resize(),

  iatwork: Markup.keyboard(['🚕 ISHDAMAN']).oneTime().resize(),
  iatrest: Markup.keyboard(['🛋 DAMDAMAN']).oneTime().resize(),

  profile: Markup.inlineKeyboard([
    [Markup.button.callback("🙍‍♀️ Ismni o'zgartirish", 'replacename')],
    [Markup.button.callback("📲 Telefon raqamni o'zgartirish", 'replacenumber')],
    [Markup.button.callback("🏠 Doimiy manzillarni o'zgartirish", 'repaddress')],
    [Markup.button.callback("🌐 Tilni o'zgartirish", 'replacelang')],
    [Markup.button.callback('💁‍♀️ Taksi chaqirish tartibi', 'forcallingtaxi')],
    [Markup.button.callback('📄 Foydalanuvchi shartnomasi', 'contract')],
    [Markup.button.callback(" ☎️ Lady Taxi xizmatiga bog'lanish", 'contactus')],
    [Markup.button.callback('👩‍🦳 Asosiy sahifa', 'mainmenu')],
  ]),

  input_constant_address: Markup.inlineKeyboard([
    Markup.button.callback(
      '🏥 Yangi manzillarni kiriting.',
      'mynewconstaddress',
    ),
  ]),

  delete_my_address: (id: number) => {
    return Markup.inlineKeyboard([
      Markup.button.callback("O'chirish", `deletemy=${id}`),
    ]);
  },

  cancel_add_address: Markup.keyboard(["🙅‍♀️ Manzil qo'shishni bekor qilish"])
    .oneTime()
    .resize(),

  in_this_direction: (first: number, second: number) => {
    return Markup.inlineKeyboard([
      Markup.button.callback(
        "Shu yo'nalishda kerak 🙋‍♀️",
        `to=${first},from=${second}`,
      ),
    ]);
  },

  from_client_to_driver: (id: number, totalPrice: number) => {
    Markup.inlineKeyboard([
      Markup.button.callback("Locatsiyani ko'rish", `seefromlocation=${id}`),
      Markup.button.callback(
        `✅ ${totalPrice} sumga man olib boraman`,
        `iwilltake=${id}`,
      ),
    ]);
  },

  after_arriving_in_user: (id: number) => {
    return Markup.inlineKeyboard([
      Markup.button.callback('1', `1to=${id}`),
      Markup.button.callback('2', `2to=${id}`),
      Markup.button.callback('3', `3to=${id}`),
      Markup.button.callback('4', `4to=${id}`),
      Markup.button.callback('5', `5to=${id}`),
    ]);
  },
};
