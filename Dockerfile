FROM node:current-buster as build-stage
WORKDIR /app/

COPY ./package* ./
RUN npm install

COPY . /app/

RUN npm run build

FROM nginx:latest as production-stage

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE ${FRONTEND_PORT}
CMD ["nginx", "-g", "daemon off;"]