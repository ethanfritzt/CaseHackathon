import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
import { GraphStateType } from "@/server/state";
dotenv.config();

const openai = new OpenAI();
const outputDirectory = path.resolve("./generated_audio");

// Ensure the output directory exists
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, { recursive: true });
}

async function generateAudio({sceneText, index}: {sceneText: string, index: number}) {
  console.log(`Generating audio for scene ${index}`);
  
  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: `alloy`, // Adjusted according to OpenAI's voice system
      input: sceneText, // Text input from scene
    });

    // Create the file path for storing the audio
    const audioPath = path.join(outputDirectory, `scene_${index}.mp3`);

    // Convert the response to a buffer and write to the file
    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.promises.writeFile(audioPath, buffer);

    console.log(`Audio content generated for scene ${index}`);
    return {
      audioPath,
      audioLength: buffer.length / 1000 // Return length in seconds as a rough estimate
    };
  } catch (error) {
    console.error(`Failed to generate audio for scene ${index}: ${error}`);
    throw error;
  }
}

export async function audioGenerator(state: GraphStateType): Promise<Partial<GraphStateType>> {
  const { scenes } = state;
  
  const updatedScenes = await Promise.all(
    scenes.map(async (scene, index) => {
      const { audioPath, audioLength } = await generateAudio({ sceneText: scene.content, index });
      return {
        ...scene,
        path: audioPath,
        length: audioLength
      };
    })
  );

  return {
    scenes: updatedScenes
  };
}

// async function test() {
//   try {
//     await audioGenerator({
//       scenes: [{ content: "This is a scene audio text", path: undefined, length: undefined, graphicDescription: undefined, manimCode: undefined }]
//     });
//     console.log("Audio generation completed successfully.");
//   } catch (error) {
//     console.error("Audio generation failed:", error);
//   }
// }

// test();
