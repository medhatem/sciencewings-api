FROM node:16 as  nodejs-env

WORKDIR /app
ADD package.json /app/package.json
RUN npm i

# the test step
FROM nodejs-env as Test-env
ADD package.json /app/package.json
RUN npm i
ADD src/client /app/src/client
ADD src/server-test /app/src/server-test
ADD src/server /app/src/server
ADD src/tsconfig.json /app/src/tsconfig.json
RUN npm run build
RUN npm test


# the final step 
FROM nodejs-env
ADD package.json /app/package.json
RUN npm i
ADD src/client /app/src/client
ADD src/server /app/src/server
ADD src/tsconfig.json /app/src/tsconfig.json
ADD swaggerConfig.json /app/swaggerConfig.json

RUN npm run build-without-test
RUN npm run swagger-gen

CMD ["npm" ,"start"]
