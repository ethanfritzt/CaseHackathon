
import { GraphStateType} from "../state/index.js";


export function isToxic(state: GraphStateType): "TRUE" | "FALSE" {
  const { isToxic } = state;
  // I think for conditional edges you need to return a string
  if (isToxic) {
    return "TRUE"
  }
  return "FALSE"
}

