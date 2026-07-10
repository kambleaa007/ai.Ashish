

install docker-desktop

> docker run --name my-redis -p 6379:6379 -d redis

PS C:\WINDOWS\System32> docker run --name my-redis -p 6379:6379 -d redis
Unable to find image 'redis:latest' locally
latest: Pulling from library/redis
3b3d036990fd: Pull complete
5096a4b992f4: Pull complete
b682f1c4b938: Pull complete
12cf9316ae87: Pull complete
f6e607ad0f52: Pull complete
e95a6c7ea7d4: Pull complete
4f4fb700ef54: Pull complete
45983244b0aa: Download complete
5457d5da3ec8: Download complete
Digest: sha256:2838d5524559494f6f1cd66e97e76b200d64a633a8614200620755ed395daf32
Status: Downloaded newer image for redis:latest
22e95c24fbd119ad437b47388b589cbdca99a88bd58774f01a0a32c53aace3a2
PS C:\WINDOWS\System32>


then in desktop app
you see container running at http://localhost:6379/ (but it cant connect by web browser as its dont have HTML so do by redis-cli)

click on my-redis container
go to exec then type redis-cli 
# redis-cli
127.0.0.1:6379> ping
PONG
127.0.0.1:6379>

ping gives pong TESTED



