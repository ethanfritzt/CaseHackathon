import { GraphStateType } from "src/server/state/index";
export async function createManimVisual(state: GraphStateType): Promise<Partial<GraphStateType>> {
  const { scenes } = state;
  // for each scene, generate visual content with manim
  Promise.all(scenes.map(async (scene, index) => {
    // generate visual content for the scene
    console.log(`Generating manim video for scene ${index}`);
  }));

  return {
    // todo
    // scenes: scenes,
  };
}