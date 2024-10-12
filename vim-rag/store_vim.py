import os

from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_postgres import PGVector

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get the connection string from environment variables
CONNECTION_STRING = os.getenv("CONNECTION_STRING")

# Load the Vim help PDF file
loader = PyPDFLoader("vim_help.pdf")
documents = loader.load()

# Custom text splitter function
def split_on_bars(text):
    return [chunk.strip() for chunk in text.split('=' * 78) if chunk.strip()]

# Create a custom CharacterTextSplitter
text_splitter = CharacterTextSplitter(
    separator='\n' + '=' * 78 + '\n',
    chunk_size=3000,
    chunk_overlap=0,
    length_function=len,
)

# Apply the custom splitting
texts = []
for doc in documents:
    texts.extend(text_splitter.create_documents([doc.page_content]))

# Create embeddings
embeddings = OpenAIEmbeddings()

# Create and populate the vector store
vector_store = PGVector.from_documents(
    documents=texts,
    embedding=embeddings,
    collection_name="vim_help",
    connection=CONNECTION_STRING,
)

print("Vim help documentation has been stored in the PostgreSQL database.")
