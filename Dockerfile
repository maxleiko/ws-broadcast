FROM       mhart/alpine-node:base-4.6.2
MAINTAINER Maxime Tricoire <max.tricoire@gmail.com>

COPY       ./bin/server.js /root/bin/server.js
COPY       ./lib /root/lib
COPY       ./public /root/public
COPY       ./node_modules /root/node_modules

CMD        ["node", "/root/bin/server.js"]
