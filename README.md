This is my implementation for the AWS workshop **"Build a Real-Time Leaderboard with Amazon Aurora Serverless and Amazon ElastiCache."** The goal of this project is to create a scalable, real-time leaderboard system for a multiplayer gaming platform.

The project demos how to use **Amazon Aurora Serverless** for managing relational data and **Amazon ElastiCache** for high-speed leaderboard data processing. It uses serverless architecture and AWS services to add scalability, security, and cost efficiency.

### Goals:
1. Design a schema for relational data.
2. Implement real-time data processing using ElastiCache(for redis)
3. Expose APIs for client interaction.
4. Authenticate users via Amazon Cognito.
5. Test and deploy the application using AWS Lambda and API Gateway.



**Technologies Used:**
- **Amazon Aurora:** Handles relational data like user profiles and scores.
- **Amazon ElastiCache(for Redis):** Stores leaderboard data for real-time performance.
- **AWS Lambda:** Executes serverless backend logic.
- **Amazon API Gateway:** Exposes REST APIs.
- **Amazon Cognito:** Manages user authentication and authorization.
- **AWS Secrets Manager:** Secures database credentials and sensitive info
- **AWS SDK for Node.js:** Helps in interacting with AWS services.


#### Setup Instructions

If you want to test this, you need the following
- An AWS account with admin permissions.
- AWS CLI installed and configured.
- Node.js installed locally.

### Steps
1. Clone this repository:
   ```bash
   git clone https://github.com/thesarfo/real-time-leaderboard.git
   cd real-time-leaderboard
   ```
2. Deploy the networking and resource setup:
   ```bash
   bash scripts/create-networking.sh
   bash scripts/create-user-pool.sh
   bash scripts/create-user-pool-client.sh
   bash scripts/create-lambda.sh
   bash scripts/create-rest-api.sh
   ```

3. Populate the database:
   ```bash
   node scripts/createTable.js
   node scripts/insertGames.js
   ```

4. Load Redis data:
   ```bash
   node scripts/loadRedis.js
   ```

5. Test the setup:
   ```bash
   node scripts/testDatabase.js
   node scripts/testRedis.js
   ```

6. Start using the application by calling the APIs.