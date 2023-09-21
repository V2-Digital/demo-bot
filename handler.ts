import { answerPreCheckoutQuery, sendInvoice, sendPaymentOptions, sendToUser } from "./src/sendToUser";

export async function hello(event) {
  const chatBody = JSON.parse(event.body!);
  const chatId = chatBody.message?.chat.id || chatBody.edited_message?.chat.id;
  
  const chatText = chatBody.message?.text || chatBody.edited_message?.text;

  // Step 1. Ask user to select a payment option
  if (chatText && chatText.includes('/pay')) {
    await sendPaymentOptions(chatId, 'Please select a payment option');
  }

  // Step 2. Send invoice to user
  if (chatBody.callback_query) {
    const [, amountString] = chatBody.callback_query.data.split(":");
    await sendInvoice(chatBody.callback_query.from.id, amountString);
  }

  // Step 3. Confirm checkout to allow payment
  if (chatBody.pre_checkout_query) {
    await answerPreCheckoutQuery(chatBody.pre_checkout_query.id);
  }

  return {
    statusCode: 200,
  };
}
