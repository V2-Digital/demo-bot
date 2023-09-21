import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey,
});

export const completeChatWithUserContent = async (userContent: string) => {
  const prompt =
    "I have extracted some text from an image. Possibly some information is lost during extraction and some information might be irrelevant. Could you please have a look and see what you could help this? The content is below:\n";
  const content = prompt + userContent;
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content }],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content || "";
};
