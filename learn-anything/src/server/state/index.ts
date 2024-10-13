import { Annotation } from "@langchain/langgraph";
import { Document } from "@langchain/core/documents";
import { BaseMessage } from "@langchain/core/messages";

interface SceneDetails {
  context: string;
  path: string;
  length: number;
}

export const GraphState = Annotation.Root({
  userInput: Annotation<string>,
  isToxic: Annotation<boolean>,
  generatedContent: Annotation<string>,
  transcript: Annotation<string>,
  scenes: Annotation<string[]>,
  });

export type GraphStateType = typeof GraphState.State;
