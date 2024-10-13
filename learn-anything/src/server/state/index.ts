import { Annotation } from "@langchain/langgraph";
import { Document } from "@langchain/core/documents";
import { BaseMessage } from "@langchain/core/messages";

// very bad way of doing this but it works for now
export type SceneDetails = {
  content: string;
  audioPath: string | undefined;
  imagePath: string | undefined;
  length: number | undefined;
  graphicDescription: string | undefined;
}

export const GraphState = Annotation.Root({
  userInput: Annotation<string>,
  isToxic: Annotation<boolean>,
  generatedContent: Annotation<string>,
  transcript: Annotation<string>,
  scenes: Annotation<SceneDetails[]>,
  finalVideoPath: Annotation<string>,
  });

export type GraphStateType = typeof GraphState.State;
