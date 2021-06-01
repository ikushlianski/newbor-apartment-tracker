FROM public.ecr.aws/lambda/nodejs:14

WORKDIR .

COPY src/index.js package.json .env ./

RUN npm install

RUN npm install chrome-aws-lambda@8.0.2 puppeteer-core@8.0.0

CMD [ "index.handler" ]
