FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY package-lock*.json ./
COPY tsconfig*.json ./

RUN npm ci

COPY apps/auth apps/auth
COPY libs libs

RUN cd apps/auth && npm install

RUN npm run build

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD [ "node","dist/apps/auth/main" ]