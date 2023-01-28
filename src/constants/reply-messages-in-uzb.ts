export const uzReplyMessages = {
  greeting: `Assalomu alaykum!\n«Lady Taxi» botiga xush kelibsiz!`,
  greeting_with_choice_lang: `Assalomu alaykum! | Здравствуйте! | Greetings!\nTilni tanlang | Выберите язык:`,
  req_registration: `Siz «Lady Taxi» botidan ilk marta foydalanayotganingiz uchun,\nbir martalik ro'yxatdan o'tishingiz lozim!`,
  req_phone_number: `Telefon raqamingizni kiriting`,
  req_real_name: [
    `Sizga murojaat qilish uchun quyidagi ismingizni tanlang:`,
    `Yoki haqiqiy ismingizni kiriting"`,
  ],
  req_real_number: [
    `Siz bilan bog'lanish uchun quyidagi telefon raqamingizni tanlang`,
    `Yoki boshqa ishlab turgan telefon raqam kiriting (namuna: 931234567):`,
  ],
  when_reg_completed: `Siz muvaffaqqiyatli ro'yxatdan o'tdingiz!\n«Lady Taxi» xizmatlaridan foydalanishingiz mumkin!`,
  to_main_menu: [
    '«Lady Taxi» faqat ayollar uchun taxi va yetkazib berish xizmatlarini amalga oshiradi 🌸!',
    "«Lady Taxi» - eng to'g'ri tanlov 🌹!",
    "«Lady Taxi» go'zal ayollarga xizmat ko'rsatishdan doimo mamnun 🌷!",
    '«Lady Taxi»ni tanlanganingizdan xursandmiz 🌺!',
  ],
  sample_number: `Namunada ko'rsatilgandek raqam kiriting`,
  address_search: {
    address_result: `Kiritilgan manzilni qidirish natijasi:`,
    about_searched_address: (requestText: string, itsNaming: string) => {
      return `Mo'ljal: ${requestText}\nManzil: ${itsNaming}`;
    },

    when_address_search: `Agar ko'rsatilgan manzillar to'g'ri kelmasa, manzilni to'liqroq kiritib ko'ring yoki kartadan aniq lokatsiyani tanlang.`,
  },
  req_avto_num: `Avtomobilingiz nomerini kiriting (masalan, 01A123AA):`,
  re_avto_color: `Avtomobilingiz rangini kiriting (masalan, Oq):`,
  end_driver_reg: `Haydovchilik rejimini faollashtirish uchun tez fursatda operatorlarimiz siz bilan bog'lanishadi!\nAgarda sizda qo'shimcha savollar bo'lsa, Lady Taxi Administratori bilan bog'laning! \n📞 Telefon: 935450011/n📬 Telegram: @LadyTaxiAdmin`,

  when_confirm_to_addr: {
    confirm: `Manzillarni tasdiqlang`,
    about_to_and_from: (
      fromfullAddress: string,
      toFullAddress: string,
      distance: number,
      totalTime: number,
    ) => {
      return `🔰 Jo'nash manzilingiz: ${fromfullAddress}\n\n🏁 Borish manzilingiz: ${toFullAddress}\n\nMasofa: ${distance} km\nVaqti: ${totalTime} min`;
    },
  },

  call_taxi: {
    about: `«Lady Taxi» boti hozirda test rejimida ishlamoqda. Yetarli \nmiqdordagi haydovchi ayollar yig'ilganidan so'ng to'liq rejimda \nfaoliyat olib boriladi. Bizga qiziqish bildirganingiz uchun rahmat!`,
    methods: `Jo'nash manzilingizni quyidagi usullardan biri orqali yuboring:\n\n1. «📍 Manzilni yuborish» tugmasini bosing\n2. Telegramning 📎 tugmasi orqali geolokatsiyani (Местоположение, Location) tanlang\n3. Manzilni botga xabar ko'rinishida yuboring`,
  },

  to_addr_stage: `Borish manzilingizni yuborish uchun Telegramning 📎 tugmasi \norqali geolokatsiyani (Местоположение, Location) tanlang yoki \nmanzilni botga xabar ko'rinishida yuboring:`,

  suggested_price: (taxiPrice: number) => {
    return `Lady Taxi tomonidan taklif qilinayotgan narx: ${taxiPrice} so'm`;
  },
  waiting_find_taxi: `Kuting! Taksi qidirilmoqda...`,

  driver_greeting: `Lady Taxi xizmatining haydovchi rejimiga xush kelibsiz!`,
  req_driver_registration: `Lady Taxi xizmatida haydovchi sifatida ro'yxatdan o'tish uchun «Ro'yxatdan o'tish» tugmasini bosing.`,
  req_avto_model: `Avtomobilingiz modelini kiriting (masalan, Cobalt):`,
  when_driver_active: `Tabriklayman! Siz Lady Taxi xizmatining haydovchisiga aylandingiz.\nYo'lovchi tashishga yoki jo'natmalarni yetkazishga tayyor bo'lsangiz «ISHDAMAN» tugmasini bosing.`,
  when_status_work: `Alloh ishingizni barakasini bersin!\nTelegramni faol holatda ushlang. Barcha yo'lovchilar to'g'risida ma'lumot berib boriladi.`,
  when_status_rest: `Yaxshi dam olib, tezroq qayting ☺️.\nAyol yo'lovchilarni erkaklarga tashlab qo'ymaylik.`,

  select_section: `Kerakli bo'limni tanlang:`,
  input_name: `Ismingizni kiriting:`,
  input_phone_number: `Telefon raqamini kiriting (namuna:931234567):`,
  input_constant_address: `Doimiy manzillaringizni kiriting.`,
  entered_address: 'Avval kiritilgan manzillar:',

  all_taxi_addresses: (addressName: string, addressFullName: string) => {
    return `Manzil nomi: ${addressName}\n\nTo'liq manzil: ${addressFullName}`;
  },

  input_address_name: `Manzil nomini kiriting (masalan, ishxona):`,
  when_add_address: `Doimiy manzilni Telegramning 📎 tugmasi orqali (Местоположение, Location) yuboring:`,
  after_adding_address: `Doimiy manzil qo'shildi.`,
  from_delivery_addr: `Jo'natma yetkazish manzilini yuborish uchun Telegramning 📎 tugmasi orqali geolokatsiyani (Местоположение, Location) tanlang yoki manzilni botga xabar ko'rinishida yuboring:`,
  when_delivery_req: `Jo'natma turgan manzilni quyidagi usullardan biri orqali yuboring:

  1. «📍 Manzilni yuborish» tugmasini bosing
  2. Telegramning 📎 tugmasi orqali geolokatsiyani (Местоположение, Location) tanlang
  3. Manzilni botga xabar ko'rinishida yuboring`,

  all_deli_address: (addressName: string, addressFullName: string) => {
    return `Jo'natma turgan manzil: ${addressName}\n\nJo'natmani yetkazish manzili: ${addressFullName}`;
  },

  in_my_addresses: (fromAddress: string, toAddress: string) => {
    return `🔰 Jo'nash manzili: ${fromAddress}
    🏁 Borish manzili: ${toAddress}`;
  },

  req_calculate_distance: `Masofani hisoblash uchun «📍 Manzilni yuborish» tugmasini bosing yoki Telegramning 📎 tugmasi orqali geolokatsiyani yuboring!`,
  res_to_driver: (totalTime: number, totalDistance: number) => {
    return `Yo'lovchi turgan manzil (${totalDistance} km, ${totalTime} minut):`;
  },

  res_about_agreement: (
    username: string,
    phone_number: number,
    totalPrice: number,
  ) => {
    return `Yo'lovchi ismi: ${username}\nTelefon raqami: ${phone_number}\nXizmat narxi: ${totalPrice} so'm.`;
  },
  to_address: `Borish manzili:`,

  when_arrived: `Barakasini bersin! Tez orada Sizga yangi yo'lovchi topib beramiz!`,

  about_driver__for_user: (
    name: string,
    phone: string,
    carModel: string,
    carColor: string,
    carNumber: string,
    totalPrice: number,
  ) => {
    return `Haydovchi ismi: ${name}\nTelefon raqami: ${phone}\nAvtomobil modeli: ${carModel}\nAvtomobil rangi: ${carColor}\nAvtomobil raqami: ${carNumber}\nXizmat narxi: ${totalPrice}`;
  },

  driver_distance_from_user: (totalTime: number, totalDistance: number) => {
    return `Taxi ${totalTime} minutda yetib keladi. Hozirda u sizdan ${totalDistance} km masofada.`;
  },

  when_taxi_arrived_from_addr: `Taksi yetib keldi!`,

  when_arrived_in_user: `Sizga qayta hizmat ko'rsatishdan hursand bo'lamiz!\n\nHaydovchi ko'rsatgan hizmatni baholang`,
};
