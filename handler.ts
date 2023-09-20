import { sendToUser } from "./src/sendToUser";

export async function hello(event) {
  const chatBody = JSON.parse(event.body!);
  const chatId = chatBody.message?.chat.id || chatBody.edited_message?.chat.id;
  await sendToUser(chatId, "Hello from AWS Lambda!");
  return {
    statusCode: 200,
  };
}
