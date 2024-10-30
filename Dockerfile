FROM node:lts-alpine
LABEL org.opencontainers.image.source=https://github.com/codemarc/gridsvcs-motd

RUN apk add --no-cache tzdata jq

WORKDIR /gridsvcs/motd
COPY ./ .

RUN chown -R node /gridsvcs/motd
RUN yarn global add node-gyp && yarn

USER node
CMD "./start.sh"