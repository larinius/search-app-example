# Project README  

## Tech Stack  
**Backend:**  
- Node.js (~22.14.0)  
- TypeScript  
- Express + Apollo GraphQL  
- SQLite with FTS5 (BM25 ranking)  
- TypeORM  

**Key Features:**  
- Full-text search with phrase/term matching  
- WebSocket support for GraphQL subscriptions  
- Rate limiting & security headers (Helmet)  
- Russian-language product generation for seeding (15000 records)  

## Startup locally: 
```bash
docker-compose -f docker-compose.local.yml down && \  
docker-compose -f docker-compose.local.yml build --no-cache && \  
docker-compose -f docker-compose.local.yml up  
```  

**Access:**  
👉 http://localhost:5173/  

**GraphQL Endpoint:**  
`/graphql`  
`/playground` (GraphQL IDE)  
```