import { Markup } from 'telegraf';

export const engKeyboards = {
  lang_selection: Markup.keyboard([
    ["πΊπΏ O'zbek tili"],
    ['π·πΊ Π ΡΡΡΠΊΠΈΠΉ ΡΠ·ΡΠΊ'],
    ['πΊπΈ English Language'],
  ])
    .oneTime()
    .resize(),

  main_menu: Markup.keyboard([
    ['π Call a taxi πββοΈ', 'π Delivery ππ»ββοΈ'],
    ['π©βπ§ Profile', 'π  Permanent Addresses'],
  ])
    .oneTime()
    .resize(),

  registration: Markup.keyboard([' β Register']).oneTime().resize(),
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
      Markup.button.callback('I choose this address π', `thismy=${i}`),
    ]);
  },

  check_activity: Markup.keyboard(['βοΈ Activity check']).oneTime().resize(),

  iconfirm: Markup.inlineKeyboard([
    Markup.button.callback(' β I confirm', 'okconfirmlocation'),
    Markup.button.callback('πββοΈ Cancel', 'noconfirmlocation'),
  ]),

  req_location: Markup.keyboard([
    [Markup.button.locationRequest('π Submit Location'), 'πββοΈ Cancel'],
  ])
    .oneTime()
    .resize(),

  cancel: Markup.keyboard([['πββοΈ Cancel']])
    .oneTime()
    .resize(),
  cancel_replace_name: Markup.inlineKeyboard([
    Markup.button.callback('πββοΈ Cancel', 'noreplacename'),
  ]),
  cancel_replace_phone: Markup.inlineKeyboard([
    Markup.button.callback('πββοΈ Cancel', 'noreplacephone'),
  ]),

  iagree: Markup.inlineKeyboard([
    Markup.button.callback(' β I agree', 'okconfirmprice'),
    Markup.button.callback('πββοΈ Cancel', 'noconfirmprice'),
  ]),

  cancel_inline: Markup.inlineKeyboard([
    Markup.button.callback('πββοΈ Cancel', 'cancelfindcar'),
  ]),

  registration_for_driver: Markup.keyboard(['π©βπ» Register']).oneTime().resize(),

  iatwork: Markup.keyboard(['π I WORK']).oneTime().resize(),
  iatrest: Markup.keyboard([`π I'm on vacation`]).oneTime().resize(),

  profile: Markup.inlineKeyboard([
    Markup.button.callback('πββοΈ Replace Name', 'replacename'),
    Markup.button.callback('π² Change phone number', 'replacenumber'),
    Markup.button.callback('π  Change permanent addresses', 'repaddress'),
    Markup.button.callback('π Change language', 'replacelang'),
    Markup.button.callback('πββοΈ Procedure for calling taxi', 'forcallingtaxi'),
    Markup.button.callback('π User Agreement', 'contract'),
    Markup.button.callback(' βοΈ Contact Lady Taxi', 'contactus'),
    Markup.button.callback('π©βπ¦³ Main Page', 'mainmenu'),
  ]),

  input_constant_address: Markup.inlineKeyboard([
    Markup.button.callback('π₯ Enter new addresses.', 'mynewconstaddress'),
  ]),

  delete_my_address: (id: number) => {
    return Markup.inlineKeyboard([
      Markup.button.callback('Delete', `deletemy=${id}`),
    ]);
  },

  cancel_add_address: Markup.keyboard(['πββοΈ Cancel Add Address'])
    .oneTime()
    .resize(),

  in_this_direction: (first: number, second: number) => {
    return Markup.inlineKeyboard([
      Markup.button.callback(
        'Need in this direction πββοΈ',
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
