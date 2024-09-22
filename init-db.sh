#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- ルートユーザーは既に存在するため、作成する必要はありません
    -- CREATE USER root WITH PASSWORD 'root' SUPERUSER;
    -- データベースも既に存在するため、作成する必要はありません
    -- CREATE DATABASE db;
    GRANT ALL PRIVILEGES ON DATABASE db TO root;
EOSQL