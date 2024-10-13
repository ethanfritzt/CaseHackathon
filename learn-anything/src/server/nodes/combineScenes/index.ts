import { GraphStateType } from "src/server/state/index";

export async function combineScenes(state: GraphStateType): Promise<Partial<GraphStateType>> {
  const { scenes } = state;
  // combine scenes into a single video
  console.log("Combining scenes into a single video");
  return {
    // scenes: scenes,
  };
}