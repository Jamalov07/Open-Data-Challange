import { Context, Markup } from "telegraf";

export async function onMainUZB(ctx: Context) {
  let str = [
    "«Lady Taxi» go'zal ayollarga xizmat ko'rsatishdan doimo mamnun 🌷!",
    "«Lady Taxi» faqat ayollar uchun taxi va yetkazib berish xizmatlarini amalga oshiradi 🌸!",
    "«Lady Taxi» - eng to'g'ri tanlov 🌹!",
    "«Lady Taxi»ni tanlanganingizdan xursandmiz 🌺!",
  ];
  ctx.reply(str[Number(Math.floor(Math.random() * 4))], {
    parse_mode: "HTML",
    ...Markup.keyboard([
      ["🚖 Taksi chaqirish 🙋‍♀️", "🚚 Yetkazib berish 🙋🏻‍♀️"],
      ["👩‍🔧 Profil", "🏠 Doimiy manzillar"],
      ['🚌 Mikro avtobuslar'],
    ])
      .resize()
      .oneTime(),
  });
}
export async function onMainRUS(ctx: Context) {
  let str = [
    "«Lady Taxi» всегда рада обслуживать красивых женщин 🌷!!",
    "«Lady Taxi» - самый правильный выбор 🌹!",
    "Мы рады, что вы выбрали «Lady Taxi» 🌺!",
  ];
  ctx.reply(str[Number(Math.floor(Math.random() * 4))], {
    parse_mode: "HTML",
    ...Markup.keyboard([
      ["🚖 Вызвать такси 🙋‍♀️", "🚚 Служба доставки 🙋🏻‍♀️"],
      ["👩‍🔧 Профиль", "🏠 Постоянные адреса"],
      ['🚌 Микроавтобусы']
    ])
      .resize()
      .oneTime(),
  });
}