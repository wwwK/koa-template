FROM node:12.18.4-alpine3.9
ENV NODE_ENV production
WORKDIR /opt/bin//back-end
COPY . .
RUN npm config set registry https://registry.npm.taobao.org && npm ci --production

EXPOSE 5000

CMD [ "npm", "start" ]