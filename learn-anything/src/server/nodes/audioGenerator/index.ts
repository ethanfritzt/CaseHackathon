import { GraphStateType } from "src/server/state"

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
  return {
    audioPath: "path/to/audio",
    audioLength: 30,
  };
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
