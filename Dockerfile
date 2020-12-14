FROM node:10

# Create app directory
WORKDIR /app
ADD . /app/

# global install & update
RUN npm i -g npm

ARG API_URL
ENV API_URL=$API_URL

RUN rm package-lock.json
RUN npm i
RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3000

# start command
CMD [ "npm", "run", "start" ]