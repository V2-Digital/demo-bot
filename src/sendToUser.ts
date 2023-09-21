import axios from "axios";

export const sendToUser = async (chatId: string | number, text: string) => {
  const options = {
    params: {
      chat_id: chatId,
      text,
    },
  };
  return await axios.post(
    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
    {},
    options
  );
};

export const sendPaymentOptions = async (
  chat_id: string | number,
  text: string
) => {
  const PAYMENT_OPTIONS = [
    [
      {
        text: `$2.99 for 10 usages`,
        callback_data: `pay:2.99`,
      },
      {
        text: `$4.99 for 30 usages`,
        callback_data: `pay:4.99`,
      },
    ],
    [
      {
        text: `$9.99 for 99 usages`,
        callback_data: `pay:9.99`,
      },
    ],
  ];
  const options = {
    params: {
      parse_mode: "HTML",
      chat_id,
      text,
      disable_web_page_preview: true,
      reply_markup: JSON.stringify({
        resize_keyboard: true,
        inline_keyboard: PAYMENT_OPTIONS,
      }),
    },
  };
  return await axios.get(
    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
    options
  );
};

export const sendInvoice = async (chat_id: string | number, amount: string) => {
  const prices = [
    {
      label: "Payment to bot",
      // amount in cent, if you have a decimal price with . instead of ,
      amount: parseInt(amount.replace(".", "")),
    },
  ];
  const options = {
    params: {
      chat_id,
      title: "Payment to bot",
      description: "$" + amount,
      payload: Date.now() + amount,
      provider_token: process.env.STRIPE_TOKEN,
      currency: "AUD",
      prices: JSON.stringify(prices),
    },
  };
  return await axios.get(
    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendInvoice`,
    options
  );
};

export const answerPreCheckoutQuery = async (id: string) => {
  const options = {
    params: {
      pre_checkout_query_id: id,
      ok: true,
    },
  };
  return await axios.get(
    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/answerPreCheckoutQuery`,
    options
  );
};
