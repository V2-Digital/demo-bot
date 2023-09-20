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