export const ruReplyMessages = {
  greeting: `Привет!\nДобро пожаловать в бот «Lady Taxi»!`,
  greeting_with_choice_lang: `Assalomu alaykum! | Здравствуйте! | Greetings!\nTilni tanlang | Выберите язык | Select a language`,
  req_registration: `Поскольку вы впервые пользуетесь ботом Lady Taxi,\nвам нужно зарегистрироваться один раз!`,
  req_phone_number: `Введите свой номер телефона`,
  req_real_name: [
    `Выберите свое имя ниже, чтобы связаться с вами:`,
    `Или введите свое настоящее имя`,
  ],
  req_real_number: [
    `Выберите свой номер телефона ниже, чтобы связаться с вамиSiz bilan bog'lanish uchun quyidagi telefon raqamingizni tanlang`,
    `Или введите другой рабочий номер телефона (пример: 931234567):`,
  ],
  when_reg_completed: `Вы успешно зарегистрировались!\nВы можете воспользоваться услугами <<Леди Такси>>!`,
  to_main_menu: [
    `«Леди Такси» предоставляет услуги такси и доставки исключительно для женщин 🌸!»`,
    'Леди Такси - лучший выбор 🌹!',
    'Lady Taxi всегда рада обслужить красивых женщин 🌷!',
    `Мы рады, что вы выбрали "Леди Такси" 🌺!`,
  ],
  sample_number: `Введите число, как показано в образце`,
  address_search: {
    address_result: `Результат поиска по введенному адресу:`,
    about_searched_address: (requestText: string, itsNaming: string) => {
      `Пункт назначения: ${requestText}\nАдрес: ${itsNaming}`;
    },

    when_address_search: `Если отображаемые адреса неверны, попробуйте ввести более полный адрес или выберите конкретное место на карте.`,
  },
  req_avto_num: `Введите номер вашего автомобиля (например, 01A123AA):`,
  re_avto_color: `Введите цвет вашего автомобиля (например, белый):`,
  end_driver_reg: `Наши операторы свяжутся с вами в ближайшее время, чтобы активировать режим вождения!\nЕсли у вас есть дополнительные вопросы, пожалуйста, свяжитесь с администратором Lady Taxi! \n📞 Телефон: 935450011/n📬 Telegram: @LadyTaxiAdmin`,

  when_confirm_to_addr: {
    confirm: `Подтвердить адреса`,
    about_to_and_from: (
      fromfullAddress: string,
      toFullAddress: string,
      distance: number,
      totalTime: number,
    ) => {
      return `🔰 Адрес отправления: ${fromfullAddress}\n\n🏁 Адрес назначения: ${toFullAddress}\n\nРасстояние: ${distance} км\nВремя: ${totalTime} мин`;
    },
  },

  call_taxi: {
    about: `Бот Lady Taxi сейчас работает в тестовом режиме. После того, как будет собрано достаточное количество женщин-водителей, будет проведена полномасштабная операция. Спасибо за интерес к нам!`,
    methods: `Отправьте пункт назначения одним из следующих способов:\n\n1. Нажмите кнопку "Отправить адрес"\n2. Выберите геолокацию (Местоположение, Местоположение) с помощью кнопки 📎 в Telegram\n3. Отправьте адрес боту в сообщении`,
  },

  to_addr_stage: `Чтобы отправить пункт назначения, выберите геолокацию (Местопологения, Местонахождение) с помощью кнопки 📎 в Telegram или отправьте адрес боту в сообщении:`,

  suggested_price: (taxiPrice: number) => {
    return `Цена от Lady Taxi: ${taxiPrice} сум`;
  },
  waiting_find_taxi: `Подождите! Ищу такси...`,

  driver_greeting: `Добро пожаловать в режим таксиста Lady Taxi!'`,
  req_driver_registration: `Чтобы зарегистрироваться в качестве водителя в сервисе Lady Taxi, нажмите кнопку «Зарегистрироваться».`,
  req_avto_model: `Введите модель вашего автомобиля (например, Cobalt):`,
  when_driver_active: `Поздравляем! Вы стали водителем службы "Леди Такси".\nЕсли вы готовы перевозить пассажиров или доставлять посылки, нажмите кнопку ПРИСОЕДИНИТЬСЯ''.`,
  when_status_work: `Да благословит Бог вашу работу!\nПоддерживайте активность Telegram. Будет предоставлена ​​информация обо всех пассажирах.`,
  when_status_rest: `Хорошо отдохните и скорее возвращайтесь ☺️.\nДавайте не будем бросать женщин-пассажиров мужчинам.`,

  select_section: `Выберите нужный раздел:`,
  input_name: `Введите свое имя:`,
  input_phone_number: `Введите номер телефона (пример: 931234567):`,
  input_constant_address: `Введите свои постоянные адреса.`,
  enter_address: 'Ранее введенные адреса:',

  all_taxi_addresses: (addressName: string, addressFullName: string) => {
    return `Имя адреса: ${addressName}\n\nПолный адрес: ${addressFullName}`;
  },

  input_address_name: `Введите название адреса (например, офис):`,
  when_add_address: `Отправить постоянный адрес через кнопку 📎 в Telegram (Местоположение, Местоположение):`,
  after_adding_address: `Добавлен постоянный адрес.`,
  from_delivery_addr: `Чтобы отправить адрес доставки, выберите геолокацию (Местоположение, Местоположение) с помощью кнопки 📎 в Telegram или отправьте адрес боту в сообщении:`,
  when_delivery_req: `Отправьте адрес доставки одним из следующих способов:
  
  1. Нажмите кнопку «Отправить адрес»
  2. Выберите геолокацию (Местопологения, Местоположение) с помощью кнопки 📎 в Telegram.
  3. Отправьте адрес боту в сообщении`,

  all_deli_address: (addressName: string, addressFullName: string) => {
    return `Адрес доставки: ${addressName}\n\nАдрес доставки: ${addressFullName}`;
  },

  in_my_addresses: (fromAddress: string, toAddress: string) => {
    return `🔰 Адрес отправления: ${fromAddress}
    🏁 Адрес назначения: ${toAddress}`;
  },

  req_calculate_distance: `Masofani hisoblash uchun «📍 Manzilni yuborish» tugmasini bosing yoki Telegramning 📎 tugmasi orqali geolokatsiyani yuboring!`,
  res_to_driver: (totalTime: number, totalDistance: number) => {
    return `Адрес, где находится пассажир (${totalDistance} км, ${totalTime} минут):`;
  },

  res_about_agreement: (
    username: string,
    phone_number: number,
    totalPrice: number,
  ) => {
    return `Имя пассажира: ${username}\nНомер телефона: ${phone_number}\nСтоимость услуги: ${totalPrice} сум.`;
  },
  to_address: `Адрес назначения:`,
  when_arrived: `Alhamdulillah Скоро мы найдем вам нового пассажира!`,

  about_driver__for_user: (
    name: string,
    phone: number,
    carModel: string,
    carColor: string,
    carNumber: string,
    totalPrice: number,
  ) => {
    return `Имя водителя: ${name}\nНомер телефона: ${phone}\nМодель автомобиля: ${carModel}\nЦвет автомобиля: ${carColor}\nНомер автомобиля: ${carNumber}\nЦена услуги: ${totalPrice}`;
  },

  driver_distance_from_user: (totalTime: number, totalDistance: number) => {
    return `Такси прибудет через ${totalTime} минут. В настоящее время он находится в ${totalDistance} км от вас.`;
  },

  when_taxi_arrived_from_addr: `Такси приехало!`,

  when_arrived_in_user: `Будем рады снова обслужить вас!\n\nОцените услуги водителя`,
};
