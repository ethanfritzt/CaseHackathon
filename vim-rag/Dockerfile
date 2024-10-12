FROM postgres:15

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    postgresql-server-dev-15

# Clone and build pgvector
RUN git clone --branch v0.4.4 https://github.com/ankane/pgvector.git \
    && cd pgvector \
    && make \
    && make install

# Cleanup
RUN apt-get remove -y build-essential git postgresql-server-dev-15 \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /pgvector

# Add vector extension to default database
RUN echo "CREATE EXTENSION vector;" > /docker-entrypoint-initdb.d/init.sql