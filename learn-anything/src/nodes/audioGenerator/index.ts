import { GraphStateType } from "src/state/index";

// define the generate audio function
async function generateAudio(scene: string, index:number): Promise<{audioPath: string, audioLength: number}> {
  // generate audio for the scene
  // return the audio path and length
  console.log(`Generating audio for scene ${index}`);
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
    const {audioPath, audioLength} = await generateAudio(scene, index);

}));
  return {
    // need to update the state so scenes can have metadata like audio path, length, number etc
    // maybe a record would be better
    // scenes: scenes,
  };
}
