import { GraphStateType } from "src/server/state";
import { model } from "src/server/models/chatModel";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Update the chat prompt template for content creation
const contentCreatorPromptTemplate = ChatPromptTemplate.fromMessages<{ userInput: string }>([
    // placeholder prompt for content creation
    ["system",
        "**You are a content creator. Your task is to generate creative content based on the student's input.**\n\n- **CREATIVE**\n  Generate engaging and informative content.\n\n- **INFORMATIVE**\n  Provide clear and concise information.\n\n**Answer with a creative or informative response based on the input.**",
    ],
    ["user", "Input for content creation: {userInput}"],
]);

const contentCreatorModel = contentCreatorPromptTemplate.pipe(model);

export async function createContent(state: GraphStateType): Promise<Partial<GraphStateType>> {
    const { userInput } = state;
    const response = await contentCreatorModel.invoke({ userInput });
    
    // Return the generated content to the state
    return {
        generatedContent: response.content as string, // Ensure type is string
    };
}
