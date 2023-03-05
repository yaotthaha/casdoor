FROM node:16.13.0 AS FRONT
WORKDIR /web
COPY ./web .
RUN yarn config set registry https://registry.npmmirror.com
RUN yarn install --frozen-lockfile --network-timeout 1000000 && yarn run build


FROM golang:1.17.5 AS BACK
WORKDIR /go/src/casdoor
COPY . .
RUN ./build.sh


FROM alpine:latest AS STANDARD
LABEL MAINTAINER="https://casdoor.org/"
ARG TARGETOS
ARG TARGETARCH
ENV BUILDX_ARCH="${TARGETOS:-linux}_${TARGETARCH:-amd64}"

RUN sed -i 's/https/http/' /etc/apk/repositories
RUN apk add curl
RUN apk add ca-certificates && update-ca-certificates
RUN apk add gcompat

RUN mkdir logs

WORKDIR /
COPY --from=BACK /go/src/casdoor/server_${BUILDX_ARCH} ./server
COPY --from=BACK /go/src/casdoor/swagger ./swagger
COPY --from=BACK /go/src/casdoor/conf/app.conf ./conf/app.conf
COPY --from=FRONT /web/build ./web/build

CMD ["/server", "--createDatabase=true"]
