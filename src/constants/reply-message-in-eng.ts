export const engReplyMessages = {
  greeting: `Hello!\nWelcome to the bot «Lady Taxi»!`,
  greeting_with_choice_lang: `Hello! | Hello! | Greetings!\nChoose a language | Choose a language:`,
  req_registration: `Since you are using the Lady Taxi bot for the first time,\nyou need to do a one-time registration!`,
  req_phone_number: `Enter your phone number`,
  req_real_name: [
    `Select your name below to contact you:`,
    `Or enter your real name`,
  ],
  req_real_number: [
    `Choose your phone number below to contact you`,
    `Or enter another working phone number (example: 931234567):`,
  ],
  when_reg_completed: `You have successfully registered!\nYou can use "Lady Taxi" services!`,
  to_main_menu: [
    `"Lady Taxi" provides taxi and delivery services exclusively for women 🌸!`,
    'Lady Taxi is the best choice 🌹!',
    'Lady Taxi is always happy to serve beautiful women 🌷!',
    `We are glad that you chose "Lady Taxi" 🌺!`,
  ],
  sample_number: `Enter a number as shown in the sample`,
  address_search: {
    address_result: `Search result for the entered address:`,
    about_searched_address: (requestText: string, itsNaming: string) => {
      return `Destination: ${requestText}\nAddress: ${itsNaming}`;
    },

    when_address_search: `If the displayed addresses are not correct, try entering a more complete address or select a specific location from the map.`,
  },

  req_avto_num: `Enter your vehicle number (eg 01A123AA):`,
  re_avto_color: `Enter the color of your car (eg White):`,
  end_driver_reg: `Our operators will contact you shortly to activate the driving mode!\nIf you have any further questions, please contact the Lady Taxi Administrator! \n📞 Phone: 935450011/n📬 Telegram: @LadyTaxiAdmin`,

  when_confirm_to_addr: {
    confirm: `Confirm addresses`,
    about_to_and_from: (
      fromfullAddress: string,
      toFullAddress: string,
      distance: number,
      totalTime: number,
    ) => {
      return `🔰 Departure address: ${fromfullAddress}\n\n🏁 Destination address: ${toFullAddress}\n\nDistance: ${distance} km\nTime: ${totalTime} min`;
    },
  },

  call_taxi: {
    about: `Lady Taxi bot is currently working in test mode. Once sufficient number of women drivers are gathered, full-scale operation will be carried out. Thank you for your interest in us!`,
    methods: `Submit your destination using one of the following methods:\n\n1. Click "Send Address" button\n2. Select geolocation (Mestopolozhenie, Location) using Telegram's 📎 button\n3. Send the address to the bot as a message`,
  },

  to_addr_stage: `To send your destination, select geolocation (Mestopologenie, Location) with Telegram's 📎 button, or send the address to the bot as a message:`,

  suggested_price: (taxiPrice: number) => {
    return `Price offered by Lady Taxi: ${taxiPrice} soum`;
  },
  waiting_find_taxi: `Wait! Looking for a taxi...`,

  driver_greeting: `Welcome to Lady Taxi driver mode!`,
  req_driver_registration: `To register as a driver in the Lady Taxi service, click the "Register" button.`,
  req_avto_model: `Enter your vehicle model (eg Cobalt):`,
  when_driver_active: `Congratulations! You have become a driver of the Lady Taxi service.\nIf you are ready to transport passengers or deliver packages, press the JOIN button.`,
  when_status_work: `May God bless your work!\nKeep Telegram active. Information about all passengers will be provided.`,
  when_status_rest: `Have a good rest and come back soon ☺️.\nLet's not abandon female passengers to men.`,

  select_section: `Select the desired section:`,
  input_name: `Enter your name:`,
  input_phone_number: `Enter the phone number (example: 931234567):`,
  input_constant_address: `Enter your constant addresses.`,
  entered_address: 'Addresses previously entered:',

  all_taxi_addresses: (addressName: string, addressFullName: string) => {
    return `Address Name: ${addressName}\n\nFull Address: ${addressFullName}`;
  },

  input_address_name: `Enter the name of the address (for example, office):`,
  when_add_address: `Send the permanent address through Telegram's 📎 button (Mestopolozhenie, Location):`,
  after_adding_address: `Permanent address added.`,
  from_delivery_addr: `To send the delivery address, select geolocation (Mestopolozhenie, Location) using Telegram's 📎 button or send the address to the bot as a message:`,
  when_delivery_req: `Send the shipping address using one of the following methods:
 
    1. Click the "Send address" button
    2. Select geolocation (Mestopologenie, Location) using Telegram's 📎 button
    3. Send the address to the bot as a message,`,

  all_deli_address: (addressName: string, addressFullName: string) => {
    return `Shipping address: ${addressName}\n\nShipping address: ${addressFullName}`;
  },

  in_my_addresses: (fromAddress: string, toAddress: string) => {
    return `🔰 Departure address: ${fromAddress}
      🏁 Destination address: ${toAddress}`;
  },

  req_calculate_distance: `To calculate the distance, click the "Send Address" button or send geolocation via Telegram's 📎 button!`,
  res_to_driver: (totalTime: number, totalDistance: number) => {
    return `Address where the passenger is (${totalDistance} km, ${totalTime} minutes):`;
  },

  res_about_agreement: (
    username: string,
    phone_number: number,
    totalPrice: number,
  ) => {
    return `Passenger name: ${username}\nPhone number: ${phone_number}\nService price: ${totalPrice} soum.`;
  },
  to_address: `Destination address:`,

  when_arrived: `Bless him! We will find you a new passenger soon!`,

  about_driver__for_user: (
    name: string,
    phone: number,
    carModel: string,
    carColor: string,
    carNumber: string,
    totalPrice: number,
  ) => {
    return `Driver Name: ${name}\nPhone Number: ${phone}\nCar Model: ${carModel}\nCar Color: ${carColor}\nCar Number: ${carNumber}\nService Price: ${totalPrice}`;
  },

  driver_distance_from_user: (totalTime: number, totalDistance: number) => {
    return `The taxi will arrive in ${totalTime} minutes. It is currently ${totalDistance} km away from you.`;
  },

  when_taxi_arrived_from_addr: `Taxi has arrived!`,

  when_arrived_in_user: `We will be glad to serve you again!\n\nRate the service provided by the driver`,
};
