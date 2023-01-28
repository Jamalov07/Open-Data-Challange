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
    ['🚖 Call a taxi 🙋‍♀️', '🚚 Delivery 🙋🏻‍♀️'],
    ['👩‍🔧 Profile', '🏠 Permanent Addresses'],
  ])
    .oneTime()
    .resize(),

  registration: Markup.keyboard([' ✅ Register']).oneTime().resize(),
  req_send_number: Markup.keyboard([
    Markup.button.contactRequest('Send my phone number'),
  ])
    .oneTime()
    .resize(),

  choose_real_name: (usernick: string) => {
    return Markup.inlineKeyboard([
      Markup.button.callback(
        `I choose my name "${usernick}"`,
        `savedefaultname`,
      ),
    ]);
  },

  choose_working_number: (phone_number) => {
    Markup.inlineKeyboard([
      Markup.button.callback(
        `I choose my number "${phone_number}`,
        'savedefaultnumber',
      ),
    ]);
  },

  choose_this_address: (i: number) => {
    Markup.inlineKeyboard([
      Markup.button.callback('I choose this address 👆', `thismy=${i}`),
    ]);
  },

  check_activity: Markup.keyboard(['✔️ Activity check']).oneTime().resize(),

  iconfirm: Markup.inlineKeyboard([
    Markup.button.callback(' ✅ I confirm', 'okconfirmlocation'),
    Markup.button.callback('🙅‍♀️ Cancel', 'noconfirmlocation'),
  ]),

  req_location: Markup.keyboard([
    [Markup.button.locationRequest('📍 Submit Location'), '🙅‍♀️ Cancel'],
  ])
    .oneTime()
    .resize(),

  cancel: Markup.keyboard([['🙅‍♀️ Cancel']])
    .oneTime()
    .resize(),
  cancel_replace_name: Markup.inlineKeyboard([
    Markup.button.callback('🙅‍♀️ Cancel', 'noreplacename'),
  ]),
  cancel_replace_phone: Markup.inlineKeyboard([
    Markup.button.callback('🙅‍♀️ Cancel', 'noreplacephone'),
  ]),

  iagree: Markup.inlineKeyboard([
    Markup.button.callback(' ✅ I agree', 'okconfirmprice'),
    Markup.button.callback('🙅‍♀️ Cancel', 'noconfirmprice'),
  ]),

  cancel_inline: Markup.inlineKeyboard([
    Markup.button.callback('🙅‍♀️ Cancel', 'cancelfindcar'),
  ]),

  registration_for_driver: Markup.keyboard(['👩‍💻 Register']).oneTime().resize(),

  iatwork: Markup.keyboard(['🚕 I WORK']).oneTime().resize(),
  iatrest: Markup.keyboard([`🛋 I'm on vacation`]).oneTime().resize(),

  profile: Markup.inlineKeyboard([
    Markup.button.callback('🙍‍♀️ Replace Name', 'replacename'),
    Markup.button.callback('📲 Change phone number', 'replacenumber'),
    Markup.button.callback('🏠 Change permanent addresses', 'repaddress'),
    Markup.button.callback('🌐 Change language', 'replacelang'),
    Markup.button.callback('💁‍♀️ Procedure for calling taxi', 'forcallingtaxi'),
    Markup.button.callback('📄 User Agreement', 'contract'),
    Markup.button.callback(' ☎️ Contact Lady Taxi', 'contactus'),
    Markup.button.callback('👩‍🦳 Main Page', 'mainmenu'),
  ]),

  input_constant_address: Markup.inlineKeyboard([
    Markup.button.callback('🏥 Enter new addresses.', 'mynewconstaddress'),
  ]),

  delete_my_address: (id: number) => {
    return Markup.inlineKeyboard([
      Markup.button.callback('Delete', `deletemy=${id}`),
    ]);
  },

  cancel_add_address: Markup.keyboard(['🙅‍♀️ Cancel Add Address'])
    .oneTime()
    .resize(),

  in_this_direction: (first: number, second: number) => {
    return Markup.inlineKeyboard([
      Markup.button.callback(
        'Need in this direction 🙋‍♀️',
        `to=${first},from=${second}`,
      ),
    ]);
  },

  from_client_to_driver: (id: number, totalPrice: number) => {
    Markup.inlineKeyboard([
      Markup.button.callback('See from location', `seefromlocation=${id}`),
      Markup.button.callback(
        `I will take it to ${totalPrice} soums`,
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
