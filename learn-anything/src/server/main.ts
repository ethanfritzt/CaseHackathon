// src/main.ts
import dotenv from "dotenv";
dotenv.config()

// nodes
import { toxicityCheck } from "./nodes/toxicityCheck";
import { createContent } from "./nodes/contentCreator";
import { createTranscript } from "./nodes/transcriptCreator";
import { audioGenerator } from "./nodes/audioGenerator";
import { createPresentation } from "./nodes/presentationGenerator";
import { imageGenerator } from "./nodes/visualGenerator";
import { combineScenes } from "./nodes/combineScenes";



// edges
import { END, START } from "@langchain/langgraph";
import { isToxic } from "./edges";

// state
import { GraphState } from "./state";

// models
import { StateGraph } from "@langchain/langgraph";

// other
import fs from "fs";


const workflow = new StateGraph(GraphState)
    .addNode("toxicityCheck", toxicityCheck)
    .addNode("createContent", createContent)
    .addNode("createTranscript", createTranscript)
    .addNode("audioGenerator", audioGenerator)
    .addNode("createPresentation", createPresentation)
    .addNode("createImageVisual", imageGenerator)
    .addNode("combineScenes", combineScenes)

workflow.addEdge(START, "toxicityCheck")
// need to build conditional edge function
    .addConditionalEdges("toxicityCheck", isToxic, {
        "TRUE": END,
        "FALSE": "createContent"
    })
    .addEdge("createContent", "createTranscript")
    .addEdge("createTranscript", "audioGenerator")
    .addEdge("audioGenerator", "createPresentation")
    .addEdge("createPresentation", "createImageVisual")
    .addEdge("createImageVisual", "combineScenes")
    .addEdge("combineScenes", END)


// Compile
const app = workflow.compile()

// create image
const representation = app.getGraph();

const inputs = {
  userInput: "Teach me about the history of the United States",
};

let _finalState; // DEBUG

(async () => {
  const image = await representation.drawMermaidPng();
  const arrayBuffer = await image.arrayBuffer();
  fs.writeFileSync("graph.png", Buffer.from(arrayBuffer));

  for await (const output of await app.stream(inputs, { recursionLimit: 10 })) {
    // if (!output.__end__) {
    //   console.log(output);
    //   console.log("---");
    // }
    for (const [key, value] of Object.entries(output)) {
      // Ensure that output[key].messages exists and is an array
      if (output[key].messages && Array.isArray(output[key].messages) && output[key].messages.length > 0) {
        const lastMsg = output[key].messages[output[key].messages.length - 1];
        console.log(`Output from node: '${key}'`);
        console.dir({
          type: lastMsg._getType(),
          content: lastMsg.content,
          tool_calls: lastMsg.tool_calls,
        }, { depth: null });
        console.log("---\n");
        _finalState = value; // DEBUG
      } else {
        console.warn(`Output from node '${key}' does not contain valid messages. \n\n Here is the output: \n\n ${JSON.stringify(output[key], null, 2)}`);
      }
    }
  }
})();

// console.log(JSON.stringify(_finalState, null, 2)); // DEBUG


