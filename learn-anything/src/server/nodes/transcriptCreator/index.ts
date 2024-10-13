import { GraphStateType, SceneDetails } from "src/server/state/index";
import { model } from "src/server/models/chatModel"
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Define the chat prompt template for transcript creation
const transcriptPromptTemplate = ChatPromptTemplate.fromMessages<{content: string}>([
    [
      "system",
      // create a prompt for the transcript creator, that creates scenes and formats as ## SCENE <scene number>
        "Create a TikTok video transcript using the provided content, ensuring it's informative and educational. The transcript should be divided into a maximum of 6 scenes, with each scene clearly marked by '## SCENE <scene number>'. Focus on delivering clear educational messages, while maintaining natural transitions between scenes to keep the audience engaged.\n\n# Steps\n\n1. **Understand Content**: Thoroughly review the provided content to extract key educational points and messages.\n2. **Plan Scenes**: Break down the content into a maximum of 6 scenes, each focusing on specific key points or topics.\n3. **Write Transitions**: Craft natural transitions for the start and end of each scene to ensure a smooth flow of information.\n4. **Scene Crafting**: Write each scene to clearly and effectively convey the educational content.\n\n# Output Format\n\n- Start with '## SCENE 1', then write the transcript for the scene.\n- For each subsequent scene, start with '## SCENE <scene number>'.\n- Ensure each scene includes clear and natural transition elements at the beginning and end.\n\n# Example\n\n**Example Input:**\n\n```text\nContent about 'The Water Cycle Explained': Discuss the processes of evaporation, condensation, precipitation, and collection in the water cycle, and explain how they contribute to Earth's ecosystem.\n```\n\n**Example Transcript Output:**\n\n- ## SCENE 1\n  \"Have you ever wondered how water travels around our planet? Let's explore the stages of the water cycle, starting with evaporation.\"\n\n- ## SCENE 2\n  \"Evaporation happens when the sun heats up water in rivers, lakes, or oceans, turning it into vapor that rises into the air.\"\n\n- ## SCENE 3\n  \"As this water vapor rises, it cools and undergoes condensation, forming clouds made up of tiny water droplets.\"\n\n- ## SCENE 4\n  \"When these droplets combine and grow heavy, they fall as precipitation—rain, snow, sleet, or hail—back to the Earth's surface.\"\n\n- ## SCENE 5\n  \"This water then collects in bodies of water or seeps into the ground, a process known as collection, and the cycle starts again.\"\n\n- ## SCENE 6\n  \"Understanding the water cycle shows us how vital water is to our ecosystem, constantly recycling to sustain life on Earth.\"\n\n# Notes\n\n- Ensure each scene transition smoothly connects to the next educational point.\n- Maintain a clear and informative tone suitable for an educational TikTok audience.",
    ],
    ["user", "Content :{content}"],
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
  const splitContent = content.split('\n\n').map((sceneContent) => {
    // Use a regular expression to find text inside double quotes
    const match = sceneContent.match(/"([^"]*)"/);
    const textInsideQuotes = match ? match[1] : '';
    // if textInsideQuotes is empty, skip this scene

    return {
      content: textInsideQuotes ? textInsideQuotes : sceneContent,
      audioPath: undefined,
      imagePath: undefined,
      length: undefined,
      graphicDescription: undefined,
    };
  });
  // Remove any undefined values
  return splitContent;
}


// async function test() {
//   const state = {generatedContent: "Content about 'The Water Cycle Explained': Discuss the processes of evaporation, condensation, precipitation, and collection in the water cycle, and explain how they contribute to Earth's ecosystem."}
//   const response = await createTranscript(state);
//   console.log(response);
// }
// test()