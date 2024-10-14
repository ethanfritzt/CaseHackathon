import { GraphStateType } from "@/server/state";
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
  console.log("running createPresentation")
    const {scenes} = state;
    const scenesWithDesc = await Promise.all(scenes.map(async (scene) => {
      const response = await presentationModel.invoke({scene: scene.content});
      // console.log("response", response)
      return {
        ...scene,
        graphicDescription: response.content as string,
      };
    }));
    console.log("scenesWithDesc", scenesWithDesc)
    return {
      scenes: scenesWithDesc.map(scene => ({
        ...scene,
        graphicDescription: scene.graphicDescription,
      })),
    }
}

// async function test(scenes: string[]) {
//   const state: GraphStateType = {
//     scenes: scenes.map(scene => ({content: scene})),
//   }
//   await createPresentation(state)
// }
// test(["this is a scene", "this is another scene", "this is a third scene"])