import axios from "axios";

import fs from "fs";
import FormData from "form-data";
import download from "download";

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


export const sendDocumentToUser = async (chat_id: string, filename: string) => {
  const formData = new FormData();
  formData.append("document", fs.createReadStream(filename));
  formData.append("chat_id", chat_id);
  return await axios.post(
    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendDocument`,
    formData,
    {
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    }
  );
};

const getPathById = async (fileId: string) => {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/getFile?file_id=${fileId}`;
  const response = await axios.get(url);
  // documents/file_6.pdf or photos/file_4.jpg
  return response.data.result.file_path;
};

export const downloadFileWithIdToTmp = async (fileId: string) => {
  try {
    const storagePath = "/tmp";
    const path = await getPathById(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${path}`;
    await download(fileUrl, storagePath);
    return `${storagePath}/${path.split("/").at(-1)}`;
  } catch (error) {
    console.error(error);
  }
};