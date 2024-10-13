import { request } from "http";
import { GraphStateType } from "src/server/state"
import fs from 'fs';
require('dotenv').config();

// function to save audio to disk
function saveAudio(audio: Buffer, path: string): Promise<void> {
  return new Promise((resolve, reject) =>
    fs.writeFile
  );
};
// define the generate audio function
async function generateAudio(scene: string, index:number, language: string = 'en-US'): Promise<{audioPath: string, audioLength: number}> {
  // generate audio for the scene
  // return the audio path and length
  console.log(`Generating audio for scene ${index}`);
  const requestBody = {
    input: {
      text: scene, // The text to convert to speech
    },
    voice: {
      languageCode: language, // Set the language code dynamically
      name: `${language}-Wavenet-D`, // Select a voice based on the language
    },
    audioConfig: {
      audioEncoding: "MP3", // Specify audio encoding format
      speakingRate: 1.0, // Specify the speaking rate
      sampleRateHertz: 16000 // Set the hertz rate
    },
  };

  const apiKey = process.env.OPENAI_API_KEY;
  const apiUrl = "https://api.openai.com/v1/chat/completions"
  try{
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
      mode: 'cors',
    });

    if (!response.ok){
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const audioContent = data.audioContent;

    console.log(`Audio content generated for scene ${index}`);

    return {
      audioPath: "path/to/audio",
      audioLength: 30,
    };

  }
  catch (error: unknown) {
    if (error instanceof Error) {
        // If the error is an instance of the Error class, you can safely access its properties
        console.error(`Failed to generate audio: ${error.message}`);
    } else {
        // Handle unexpected error types
        console.error(`Failed to generate audio: ${String(error)}`);
    }
    throw error; // Propagate the error
}
}

export async function audioGenerator(state: GraphStateType): Promise<Partial<GraphStateType>> {
  const {scenes} = state;
  // for each scene, generate audio in parallel
  // should probably modify the scenes to update with the audio file path, and length of the audio
  const updatedScenes = await Promise.all(scenes.map(async (scene, index) => {
    // generate audio for the scene
  const {audioPath, audioLength} = await generateAudio(scene.content, index);
  return {
    ...scene,
    path: audioPath,
    length: audioLength,
  };

}));
  return {
    scenes: updatedScenes,
  };
}

// async function test { await generateAudio("Hello, how are you?", 0); }
// test();