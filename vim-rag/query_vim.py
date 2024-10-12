import os

from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_postgres import PGVector
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.documents import Document

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get the connection string from environment variables
CONNECTION_STRING = os.getenv("CONNECTION_STRING")

# Create embeddings
embeddings = OpenAIEmbeddings()

# Connect to the existing vector store
vector_store = PGVector(
    collection_name="vim_help",
    connection=CONNECTION_STRING,
    embeddings=embeddings
)

# Function to query the database
def query_vim_help(query: str, prompt: ChatPromptTemplate, k: int = 3):

    # Retrieve relevant documents
    relevant_docs = vector_store.similarity_search(query, k=k)
    
    # Write each document's content to a new file
    for i, doc in enumerate(relevant_docs):
        filename = f"out/doc_{i+1}.txt"
        with open(filename, "w") as file:
            file.write(doc.page_content)

    # Convert to langchain_core Document objects
    relevant_docs = [Document(page_content=doc.page_content, metadata=doc.metadata) for doc in relevant_docs]


    # Initialize the language model
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)

    # Create a stuff documents chain
    stuff_documents_chain = create_stuff_documents_chain(llm, prompt)

    # Create a RetrievalQA chain
    retrieval_chain = create_retrieval_chain(
        vector_store.as_retriever(search_kwargs={"k": k}),
        stuff_documents_chain,
    )

    # Run the query
    response = retrieval_chain.invoke({"context": relevant_docs, "input": query})

    return response["answer"]

# Example usage
if __name__ == "__main__":
    user_query = input("Enter your Vim help query: ")
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an assistant that helps with Vim editor queries. Answer based on the following context:"),
        ("human", "{context}"),
        ("human", "{input}")
    ])
    result = query_vim_help(user_query, prompt)
    
    print(result)
