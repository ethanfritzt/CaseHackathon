import { GraphStateType, SceneDetails } from "src/server/state/index";
import { model } from "src/server/models/chatModel"
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Define the chat prompt template for transcript creation
const transcriptPromptTemplate = ChatPromptTemplate.fromMessages<{content: string}>([
    [
      "system",
      // create a prompt for the transcript creator, that creates scenes and formats as ## SCENE <scene number>
        "You are a transcript creator. Split each scene by starting a new line with '## SCENE <scene number>'",
    ],
    ["user", "Content to split:{content}"],
  ]);

const transcriptModel = transcriptPromptTemplate.pipe(model);

export async function createTranscript(state: GraphStateType): Promise<Partial<GraphStateType>> {
    const {generatedContent} = state;
    const response = await transcriptModel.invoke({content: generatedContent});
    const scenes = splitContent(response.content as string);
  
    return {
      scenes: scenes,
    }
}

function splitContent(content: string): SceneDetails[] {
  // Implement the logic to split the content and create SceneDetails objects
  // This is a placeholder implementation
  return content.split('\n\n').map((sceneContent, index) => ({
    content: sceneContent,
    path: undefined,
    length: undefined,
    graphicDecsription: undefined,
    manimCode: undefined
  }));
}