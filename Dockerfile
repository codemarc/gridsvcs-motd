FROM node:lts-alpine
LABEL org.opencontainers.image.source=https://github.com/codemarc/gridsvcs

RUN apk add --no-cache tzdata

WORKDIR /gridsvcs/motd
COPY ./ .

RUN chown -R node /gridsvcs/motd
RUN yarn global add node-gyp && yarn

USER node
CMD "./start.sh"

