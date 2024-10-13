import fs from "fs";
import path from "path";
import {OpenAI} from "openai"; // Assuming OpenAI is your image generation source
import dotenv from "dotenv";
import { DallEAPIWrapper } from "@langchain/openai";
import { GraphStateType } from "src/server/state/index";
dotenv.config();

const openai = new OpenAI();

// Define the output directory for images
const imageOutputDirectory = path.resolve("./generated_images");

// Ensure the image output directory exists
if (!fs.existsSync(imageOutputDirectory)) {
  fs.mkdirSync(imageOutputDirectory, { recursive: true });
}

async function generateImage({ prompt, index }: { prompt: string, index: number }) {
  console.log(`Generating image for scene ${index}`);

  try {
    // First attempt with DALL-E 3
    const response = await openai.images.generate({
      model: "dall-e-3",    // First try with DALL-E 3
      prompt: prompt,       // Prompt for the image
      n: 1,                 // Generate one image
      size: "1024x1024",    // Image size
    });

    // Get the URL of the generated image
    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error(`Image URL is undefined for scene ${index}`);
    }

    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    const imagePath = path.join(imageOutputDirectory, `scene_${index}.png`);
    await fs.promises.writeFile(imagePath, Buffer.from(imageBuffer));

    console.log(`Image content generated and saved for scene ${index} at ${imagePath}`);
    return {
      imagePath,
    };

  } catch (error) {
    console.error(`Failed to generate image for scene ${index} with DALL-E 3: ${error}`);

    // Retry with DALL-E 2 if the first attempt fails
    try {
      console.log(`Retrying with DALL-E 2 for scene ${index}`);

      // Attempt with DALL-E 2
      const response = await openai.images.generate({
        model: "dall-e-2",    // Retry with DALL-E 2
        prompt: prompt,       // Same prompt for the image
        n: 1,                 // Generate one image
        size: "1024x1024",    // Image size
      });

      const imageUrl = response.data[0]?.url;

      if (!imageUrl) {
        throw new Error(`Image URL is undefined for scene ${index} (DALL-E 2)`);
      }

      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();

      const imagePath = path.join(imageOutputDirectory, `scene_${index}.png`);
      await fs.promises.writeFile(imagePath, Buffer.from(imageBuffer));

      console.log(`Image content generated and saved for scene ${index} at ${imagePath} (DALL-E 2)`);
      return {
        imagePath,
      };

    } catch (retryError) {
      console.error(`Failed to generate image for scene ${index} with DALL-E 2 as well: ${retryError}`);
      throw retryError;
    }
  }
}


// This key has a limit of only 7 images per minute
export async function imageGenerator(state: GraphStateType): Promise<Partial<GraphStateType>> {
  const {scenes} = state;
  // remove any scenes that is higher than 7 so 7 scenes max
  const maxLimitScenes = scenes.slice(0, 7);
  // for each scene, generate images in parallel
  // should probably modify the scenes to update with the image file path
  const updatedScenes = await Promise.all(maxLimitScenes.map(async (scene, index) => {
    // make sure the scene has a graphic description
    if (!scene.graphicDescription) {
      throw new Error(`Scene ${index} does not have a graphic description`);
    }
    // generate image for the scene
    const { imagePath } = await generateImage({ prompt: scene.graphicDescription, index });

    return {
      ...scene,
      imagePath: imagePath
    };
  }));

  return {
    scenes: updatedScenes,
  };
}

// async function test(prompt: string) { await generateImage({ prompt, index: 0 }); }
// test("a white siamese cat"); // Outputs ./generated_images/scene_0.png