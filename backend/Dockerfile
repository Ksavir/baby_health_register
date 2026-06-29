FROM oven/bun:1

WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .

RUN mkdir -p data

EXPOSE 4000

CMD ["bun", "run", "start"]
