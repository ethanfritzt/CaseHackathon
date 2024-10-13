import { GraphStateType } from "src/server/state/index";
import { model } from "src/server/models/chatModel";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Define the chat prompt template for transcript creation
const presentationPromptTemplate = ChatPromptTemplate.fromMessages<{scene: string}>([
    [
      "system",
      "describe what the appropriate visual content aligning with the scene transcript that we can generate with manim",
    ],
    ["user", "{scene}"],
  ]);

const presentationModel = presentationPromptTemplate.pipe(model);

export async function createPresentation(state: GraphStateType): Promise<Partial<GraphStateType>> {
    const {scenes} = state;
    const response = Promise.all(scenes.map(async (scene, index) => {
      // const response = await presentationModel.invoke({scene});
      console.log("presentation response generating for", index);
      // return response.content as string;
    }));
  
    return {
      // need to update the state so this can be added the appropriate scene
      // for now, just returning the scenes
      // scenes: scenes
    }
}