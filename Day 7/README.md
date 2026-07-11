Day 7

follow README
follow SETUP
have .env filled from .env.example and SETUP steps 

then
> npx prisma migrate dev --name init

    PS D:\git\ai.Ashish\Day 7\security\project> npx prisma migrate dev --name init
    npm notice run secure-notes-api@1.0.0 npx
    npm notice run prisma migrate dev --name init
    Environment variables loaded from .env
    Prisma schema loaded from prisma\schema.prisma
    Datasource "db": SQLite database "dev.db" at "file:./dev.db"

    SQLite database dev.db created at file:./dev.db

    Applying migration `20260711101426_init`

    The following migration(s) have been created and applied from new schema changes:

    migrations/
    └─ 20260711101426_init/
        └─ migration.sql

    Your database is now in sync with your schema.

    ✔ Generated Prisma Client (v5.22.0) to .\node_modules\@prisma\client in 98ms


    ┌─────────────────────────────────────────────────────────┐
    │  Update available 5.22.0 -> 7.8.0                       │
    │                                                         │
    │  This is a major update - please follow the guide at    │
    │  https://pris.ly/d/major-version-upgrade                │
    │                                                         │
    │  Run the following to update                            │
    │    npm i --save-dev prisma@latest                       │
    │    npm i @prisma/client@latest                          │
    └─────────────────────────────────────────────────────────┘
    PS D:\git\ai.Ashish\Day 7\security\project> 
    PS D:\git\ai.Ashish\Day 7\security\project> 

so dev.db generated inside prisma folder 

then 
> npm run dev

    PS D:\git\ai.Ashish\Day 7\security\project> npm run dev                       
    npm notice run secure-notes-api@1.0.0 dev
    npm notice run tsx watch src/index.ts
    {"level":30,"time":1783767159872,"pid":268,"hostname":"DESKTOP-CCEKOC2","port":3000,"env":"development","msg":"server started"}

then used prisma extension in kiro
default running
postgres://postgres:postgres@localhost:51214/template1?sslmode=disable


![NOT WORKING](image.png)

> npm init -y 
> npm i express jsonwebtoken argon2 zod dotenv @prisma/client
> npm i -D @types/express @types/jsonwebtoken @types/node prisma tsx typescript


--------------------------------------------
then 
> docker pull returntocorp/semgrep


    PS D:\git\ai.Ashish\Day 7\security\project> docker pull returntocorp/semgrep
    Using default tag: latest
    latest: Pulling from returntocorp/semgrep
    9049ecc4ddce: Pulling fs layer 
    ffca6f36b8c4: Pulling fs layer 
    e6f31ffc071e: Pulling fs layer 
    e227f139f3f0: Pulling fs layer 
    f4cbfaba6e2b: Pulling fs layer 
    9049ecc4ddce: Pull complete 
    e08e74f806c1: Pull complete 
    bd9ddc54bea9: Pull complete 
    538aed312edf: Pull complete 
    e86718175e55: Pull complete 
    d44f2628839e: Pull complete 
    94e01ae9a186: Pull complete 
    6be285c53517: Pull complete 
    7316ee489c6c: Download complete 
    Digest: sha256:59fbed6127ea7c5dde3ba6a85142733bb20ea9aaa36120c953904f1539aaf66e
    Status: Downloaded newer image for returntocorp/semgrep:latest
    docker.io/returntocorp/semgrep:latest

    What's next:
        View a summary of image vulnerabilities and recommendations → docker scout quickview returntocorp/semgrep
    PS D:\git\ai.Ashish\Day 7\security\project> 





