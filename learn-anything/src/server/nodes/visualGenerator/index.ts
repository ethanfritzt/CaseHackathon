import { GraphStateType } from "src/server/state/index";
import { OpenAI } from "@langchain/openai";
import fs from 'fs';

export async function createManimVisual(state: GraphStateType): Promise<Partial<GraphStateType>> {
  const { scenes } = state;
  // for each scene, generate visual content with manim
  Promise.all(scenes.map(async (scene, index) => {
    // generate visual content for the scene
    console.log(`Generating manim video for scene ${index}`);
  }));
}

// save the image to disk
function saveImage(image_url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile("path/to/image", image_url, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// define the generate image function
async function generateImage(scene: string, index: number): Promise<{imagePath: string}> {
  // generate image for the scene
  // return the image path
  console.log(`Generating image for scene ${index}`);
  
  return {
    imagePath: "path/to/image",
  }
}

export async function imageGenerator(state: GraphStateType): Promise<Partial<GraphStateType>> {
  const {scenes} = state;
  // for each scene, generate images in parallel
  // should probably modify the scenes to update with the image file path
  const updatedScenes = await Promise.all(scenes.map(async (scene, index) => {
    // generate image for the scene
    console.log(`Generating image for scene ${index}`);
    const { imagePath } = await generateImage(scene.content, index).resolve();

    return {
      ...scene,
      path: imagePath
    };
  }));

  return {
    scenes: updatedScenes,
  };
}
