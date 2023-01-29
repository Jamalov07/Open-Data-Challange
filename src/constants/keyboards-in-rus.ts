import { Markup } from 'telegraf';

export const ruKeyboards = {
  lang_selection: Markup.keyboard([
    ["🇺🇿 O'zbek tili"],
    ['🇷🇺 Русский язык'],
    ['🇺🇸 English Language'],
  ])
    .oneTime()
    .resize(),

  main_menu: Markup.keyboard([
    ['🚖 Вызов такси 🙋‍♀️', '🚚 Доставка 🙋🏻‍♀️'],
    ['👩‍🔧 Профиль', '🏠 Постоянные адреса'],
    ['🚌 Микроавтобусы']
  ])
    .oneTime()
    .resize(),

  registration: Markup.keyboard([' ✅ Зарегистрироваться']).oneTime().resize(),

  req_send_number: Markup.keyboard([
    Markup.button.contactRequest('Отправить мой номер телефона'),
  ])
    .oneTime()
    .resize(),

  choose_real_name: (usernick: string) => {
    return Markup.inlineKeyboard([
      Markup.button.callback(
        `Я выбираю свое имя "${usernick}"`,
        `savedefaultname`,
      ),
    ]);
  },

  choose_working_number: (phone_number) => {
    Markup.inlineKeyboard([
      Markup.button.callback(
        `Я выбираю свой номер "${phone_number}"`,
        'savedefaultnumber',
      ),
    ]);
  },

  choose_this_address: (i: number) => {
    Markup.inlineKeyboard([
      Markup.button.callback('Я выбираю этот адрес 👆', `thismy=${i}`),
    ]);
  },

  check_activity: Markup.keyboard(['✔️ Проверка активности'])
    .oneTime()
    .resize(),

  iconfirm: Markup.inlineKeyboard([
    Markup.button.callback('✅ Я подтверждаю', 'okconfirmlocation'),
    Markup.button.callback('🙅‍♀️ Отмена', 'noconfirmlocation'),
  ]),

  req_location: Markup.keyboard([
    [Markup.button.locationRequest('📍 Отправить адрес'), '🙅‍♀️ Отмена'],
  ])
    .oneTime()
    .resize(),

  cancel: Markup.keyboard([['🙅‍♀️ Отмена']])
    .oneTime()
    .resize(),
  cancel_replace_name: Markup.inlineKeyboard([
    Markup.button.callback('🙅‍♀️ Отмена', 'noreplacename'),
  ]),
  cancel_replace_phone: Markup.inlineKeyboard([
    Markup.button.callback('🙅‍♀️ Отмена', 'noreplacephone'),
  ]),

  iagree: Markup.inlineKeyboard([
    Markup.button.callback('✅ Я согласен', 'okconfirmprice'),
    Markup.button.callback('🙅‍♀️ Отмена', 'noconfirmprice'),
  ]),

  cancel_inline: Markup.inlineKeyboard([
    Markup.button.callback('🙅‍♀️ Отмена', 'cancelfindcar'),
  ]),

  registration_for_driver: Markup.keyboard(['👩‍💻 Зарегистрироваться'])
    .oneTime()
    .resize(),

  iatwork: Markup.keyboard(['🚕 Я НА РАБОТЕ']).oneTime().resize(),
  iatrest: Markup.keyboard(['🛋 я на досуге']).oneTime().resize(),

  profile: Markup.inlineKeyboard([
    [Markup.button.callback('🙍‍♀️ Изменить имя', 'replacename')],
    [Markup.button.callback('📲 Изменить номер телефона', 'replacenumber')],
    [Markup.button.callback('🏠 Смена постоянных адресов', 'repaddress')],
    [Markup.button.callback('🌐 Изменить язык', 'replacelang')],
    [Markup.button.callback('💁‍♀️ Порядок вызова такси', 'forcallingtaxi')],
    [Markup.button.callback('📄 Пользовательское Соглашение', 'contract')],
    [
      Markup.button.callback(
        ' ☎️ Связаться со службой Леди Такси',
        'contactus',
      ),
    ],
    [Markup.button.callback('👩‍🦳 Главная страница', 'mainmenu')],
  ]),

  input_constant_address: Markup.inlineKeyboard([
    Markup.button.callback('🏥 Введите новые адреса.', 'mynewconstaddress'),
  ]),

  delete_my_address: (id: number) => {
    return Markup.inlineKeyboard([
      Markup.button.callback('Очистить', `deletemy=${id}`),
    ]);
  },

  cancel_add_address: Markup.keyboard(['🙅‍♀️ Отменить добавление адреса'])
    .oneTime()
    .resize(),

  in_this_direction: (first: number, second: number) => {
    return Markup.inlineKeyboard([
      Markup.button.callback(
        'Необходимо в этом направлении 🙋‍♀️',
        `to=${first}=from=${second}`,
      ),
    ]);
  },

  from_client_to_driver: (id: number, totalPrice: number) => {
    Markup.inlineKeyboard([
      Markup.button.callback(
        'Посмотреть местоположение',
        `seefromlocation=${id}`,
      ),
      Markup.button.callback(
        `✅ Возьму на сумму ${totalPrice}`,
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
