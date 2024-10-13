import { GraphStateType } from "src/server/state/index";
import { model } from "src/server/models/chatModel";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Define the chat prompt template for transcript creation
const presentationPromptTemplate = ChatPromptTemplate.fromMessages<{scene: string}>([
    [
      "system",
      "create a single graphical description of a image that will be good for this scene",
    ],
    ["user", "{scene}"],
  ]);

const presentationModel = presentationPromptTemplate.pipe(model);

export async function createPresentation(state: GraphStateType): Promise<Partial<GraphStateType>> {
    const {scenes} = state;
    const scenesWithDesc = await Promise.all(scenes.map(async (scene, index) => {
      const response = await presentationModel.invoke({scene: scene.content});
      return {
        ...scene,
        graphicDecsription: response.content as string,
      };
    }));
  
    return {
      scenes: scenesWithDesc,
    }
}