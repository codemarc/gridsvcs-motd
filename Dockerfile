FROM node:lts-alpine
LABEL description="message of the day service, part of the GridLinks project" \
  source="https://github.com/codemarc/gridsvcs-motd" 

RUN apk add --no-cache tzdata jq

WORKDIR /gridsvcs/motd
COPY ./ .

RUN chown -R node /gridsvcs/motd
RUN yarn global add node-gyp && yarn

CMD "./start.sh"