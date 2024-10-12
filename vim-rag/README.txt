
Example Output Files
====================

When a user prompts the system with a query like "how to quit vim", the `query_vim_help` function in `query_vim.py` generates example output files. These files, named `doc_1.txt`, `doc_2.txt`, and `doc_3.txt`, are created in the `out/` directory and contain relevant information retrieved from the Vim documentation.

How the Documents are Created:
------------------------------

1. The function uses a vector store to perform a similarity search based on the user's query.
2. It retrieves the top 3 most relevant documents (by default, as k=3).
3. For each retrieved document:
   - A new file is created in the `out/` directory.
   - The file is named `doc_{i+1}.txt`, where i is the index of the document (0, 1, 2).
   - The content of the retrieved document is written to this file.

Content of the Example Files:
-----------------------------

1. doc_1.txt:
   Contains information about commands for all windows in Vim, including how to quit Vim when multiple windows are open.

2. doc_2.txt:
   Includes various Vim-related information, such as uninstalling Vim on different systems and troubleshooting tips.

3. doc_3.txt:
   Provides detailed instructions on uninstalling Vim, including command-line instructions for Unix systems and GUI uninstallation for Windows.

These files serve as a snapshot of the relevant information retrieved from the Vim documentation based on the user's query. They can be useful for debugging, verifying the retrieval process, or providing additional context to the user if needed.


Building and Running the PostgreSQL with pgvector Docker Container
==================================================================

This README provides instructions on how to build and run the custom PostgreSQL
Docker container with pgvector extension.

Prerequisites:
--------------
- Docker installed on your system
- The Dockerfile in the same directory as this README

Steps:
------

1. Build the Docker image:
   Open a terminal in the directory containing the Dockerfile and run:
   
   docker build -t postgres-pgvector .

   This command builds the Docker image and tags it as "postgres-pgvector:15".

2. Run the Docker container:
   After the image is built, you can run it with the following command:
   
   docker run -d --name postgres-pgvector -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres-pgvector

   Replace "your_password" with a secure password of your choice.

   This command:
   - Runs the container in detached mode (-d)
   - Names the container "postgres-pgvector"
   - Maps port 5432 from the container to port 5432 on your host
   - Sets the PostgreSQL password to "your_password"

3. Verify the container is running:
   
   docker ps

   You should see your "postgres-pgvector" container in the list.

4. Connect to the PostgreSQL database:
   You can now connect to the database using any PostgreSQL client, using:
   - Host: localhost
   - Port: 5432
   - User: postgres
   - Password: your_password (the one you set in step 2)

   The vector extension should be automatically available in the default database.

5. Stop the container (when you're done):
   
   docker stop postgres-pgvector

6. Remove the container (if you want to delete it):
   
   docker rm postgres-pgvector

Note: The pgvector extension is automatically created in the default database.
If you create new databases, you'll need to manually enable the extension by
running: CREATE EXTENSION vector;
