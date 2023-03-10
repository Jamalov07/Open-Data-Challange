import { Markup } from 'telegraf';

export const uzKeyboards = {
  lang_selection: Markup.keyboard([
    ["πΊπΏ O'zbek tili"],
    ['π·πΊ Π ΡΡΡΠΊΠΈΠΉ ΡΠ·ΡΠΊ'],
    ['πΊπΈ English Language'],
  ])
    .oneTime()
    .resize(),

  main_menu: Markup.keyboard([
    ['π Taksi chaqirish πββοΈ', 'π Yetkazib berish ππ»ββοΈ'],
    ['π©βπ§ Profil', 'π  Doimiy manzillar'],
    ['π Mikro avtobuslar'],
  ])
    .oneTime()
    .resize(),

  registration: Markup.keyboard(["β Ro'yxatdan o'tish"]).oneTime().resize(),

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
      Markup.button.callback('Shu manzilni tanlayman π', `thismy=${i}`),
    ]);
  },

  check_activity: Markup.keyboard(['βοΈ Faollikni tekshirish'])
    .oneTime()
    .resize(),

  iconfirm: Markup.inlineKeyboard([
    Markup.button.callback('β Tasdiqlayman', 'okconfirmlocation'),
    Markup.button.callback('πββοΈ Bekor qilish', 'noconfirmlocation'),
  ]),

  req_location: Markup.keyboard([
    [Markup.button.locationRequest('π Manzilni yuborish'), 'πββοΈ Bekor qilish'],
  ])
    .oneTime()
    .resize(),

  cancel: Markup.keyboard([['πββοΈ Bekor qilish']])
    .oneTime()
    .resize(),
  cancel_replace_name: Markup.inlineKeyboard([
    Markup.button.callback('πββοΈ Bekor qilish', 'noreplacename'),
  ]),
  cancel_replace_phone: Markup.inlineKeyboard([
    Markup.button.callback('πββοΈ Bekor qilish', 'noreplacephone'),
  ]),

  iagree: Markup.inlineKeyboard([
    Markup.button.callback('β Roziman', 'okconfirmprice'),
    Markup.button.callback('πββοΈ Bekor qilish', 'noconfirmprice'),
  ]),

  cancel_inline: Markup.inlineKeyboard([
    Markup.button.callback('πββοΈ Bekor qilish', 'cancelfindcar'),
  ]),

  registration_for_driver: Markup.keyboard(["π©βπ» Ro'yxatdan o'tish"])
    .oneTime()
    .resize(),

  iatwork: Markup.keyboard(['π ISHDAMAN']).oneTime().resize(),
  iatrest: Markup.keyboard(['π DAMDAMAN']).oneTime().resize(),

  profile: Markup.inlineKeyboard([
    [Markup.button.callback("πββοΈ Ismni o'zgartirish", 'replacename')],
    [
      Markup.button.callback(
        "π² Telefon raqamni o'zgartirish",
        'replacenumber',
      ),
    ],
    [
      Markup.button.callback(
        "π  Doimiy manzillarni o'zgartirish",
        'repaddress',
      ),
    ],
    [Markup.button.callback("π Tilni o'zgartirish", 'replacelang')],
    [Markup.button.callback('πββοΈ Taksi chaqirish tartibi', 'forcallingtaxi')],
    [Markup.button.callback('π Foydalanuvchi shartnomasi', 'contract')],
    [Markup.button.callback(" βοΈ Lady Taxi xizmatiga bog'lanish", 'contactus')],
    [Markup.button.callback('π©βπ¦³ Asosiy sahifa', 'mainmenu')],
  ]),

  input_constant_address: Markup.inlineKeyboard([
    Markup.button.callback(
      'π₯ Yangi manzillarni kiriting.',
      'mynewconstaddress',
    ),
  ]),

  delete_my_address: (id: number) => {
    return Markup.inlineKeyboard([
      Markup.button.callback("O'chirish", `deletemy=${id}`),
    ]);
  },

  cancel_add_address: Markup.keyboard(["πββοΈ Manzil qo'shishni bekor qilish"])
    .oneTime()
    .resize(),

  in_this_direction: (first: number, second: number) => {
    return Markup.inlineKeyboard([
      Markup.button.callback(
        "Shu yo'nalishda kerak πββοΈ",
        `to=${first}=from=${second}`,
      ),
    ]);
  },

  from_client_to_driver: (id: number, totalPrice: number) => {
    Markup.inlineKeyboard([
      Markup.button.callback("Locatsiyani ko'rish", `seefromlocation=${id}`),
      Markup.button.callback(
        `β ${totalPrice} sumga man olib boraman`,
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
