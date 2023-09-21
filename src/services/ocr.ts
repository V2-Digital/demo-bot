import {
  TextractClient,
  DetectDocumentTextCommand,
  DetectDocumentTextCommandInput,
} from "@aws-sdk/client-textract";
import fs from "fs";

export const readText = async (fileName: string) => {
  const client = new TextractClient();
  const params: DetectDocumentTextCommandInput = {
    Document: { Bytes: fs.readFileSync(fileName) },
  };
  const command = new DetectDocumentTextCommand(params);
  const res = await client.send(command);
  const allLines = res.Blocks?.filter((block) => block.BlockType === "LINE");
  const allText = allLines?.map((line) => line.Text).join("\n");
  if (!allText) throw new Error("No text found");
  return allText;
};
