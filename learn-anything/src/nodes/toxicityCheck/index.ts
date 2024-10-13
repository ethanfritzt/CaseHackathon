import { GraphStateType } from "src/state/index";
import { model } from "src/models/chatModel";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Update the chat prompt template for toxicity check
const toxicityPromptTemplate = ChatPromptTemplate.fromMessages<{userInput: string}>([
    [
      "system",
      "**You are a toxicity checker. Your task is to determine if the student's message contains toxic content.**\n\n- **TOXIC**\n  If the message contains harmful or inappropriate content.\n\n- **SAFE**\n  If the message is free from harmful or inappropriate content.\n\n**Answer only with the type of content: TOXIC or SAFE.**",
    ],
    ["user", "Text to check for toxicity:{userInput}"],
  ]);

const toxicityModel = toxicityPromptTemplate.pipe(model);

export async function toxicityCheck(state: GraphStateType): Promise<Partial<GraphStateType>> {
    const {userInput} = state;
    const response = await toxicityModel.invoke({userInput});
    const isInputToxic = (response.content as string) === "TOXIC" ? true : false;
  
    // return the response to the state
    // you can return anything but this is a simple example
    // this will be now available in the "global" state, so you can access it in other nodes
    // https://langchain-ai.github.io/langgraphjs/concepts/low_level/#state
    return{
      isToxic: isInputToxic,
    }
}
