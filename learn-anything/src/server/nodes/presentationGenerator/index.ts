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
  console.log("running createPresentation")
    const {scenes} = state;
    const scenesWithDesc = await Promise.all(scenes.map(async (scene, index) => {
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

// async function test() {
// await createPresentation({scenes: [{content: "this is a scene"}, {content: "this is another scene"}, {content: "this is a third scene"}]})
// }
// test()