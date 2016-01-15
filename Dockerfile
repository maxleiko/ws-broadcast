FROM node:0-wheezy
MAINTAINER Manuel Leduc <manuel.leduc@gmail.com> (@manuelleduc)

COPY . /app
WORKDIR /app
RUN npm i -g forever && npm i

EXPOSE 9001

CMD ["forever", "./bin/cli.js"]
