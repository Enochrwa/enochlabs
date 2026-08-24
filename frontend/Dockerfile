# Development image — used by docker-compose for local dev with hot reload.
# Production deploys build static assets via CI (see docs/DEPLOYMENT.md) and
# serve them from a static host (Vercel/Netlify/Cloudflare Pages), not this image.
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
