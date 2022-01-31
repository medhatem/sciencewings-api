FROM node:14 as  NodeJS-env

WORKDIR /app
ADD package.json /app/package.json
RUN npm i

# the test step
FROM nodejs-env as Test-env
COPY src/server-test /app/src/server-test
RUN npm test


# the final step 
FROM nodejs-env

ADD src/client /app/src/client
ADD src/server /app/src/server
ADD src/tsconfig.json /app/src/tsconfig.json
ADD swaggerConfig.json /app/swaggerConfig.json

RUN npm run swagger-gen
RUN npm run build-without-test

CMD ["npm" ,"start"]












