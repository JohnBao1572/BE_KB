<h1><b>BE_KB</b></h1>
npm v9.6.7 | license MIT | downloads | rate limited by upstream service | build passing | discord online | backers 848 | sponsors 324

Description
Backend Express.js + MongoDB framework for building efficient and scalable server-side applications.

Project setup
bash
$ npm install
Compile and run the project
bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
Environment Configuration
Create a .env file in the root directory:

env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
SECRET_KEY=your_jwt_secret_key
API Features
🔐 Authentication - JWT-based user authentication

👥 User Management - Customer and admin account management

🛍️ Product Management - CRUD operations for products

🛒 Cart & Orders - Shopping cart and order processing

💳 Payment Integration - Multiple payment methods including MoMo

📊 Reports & Analytics - Sales and inventory reports

🔔 Notifications - Real-time notifications and email alerts

Database
MongoDB with Mongoose ODM

Cloud-based MongoDB Atlas deployment

Scripts
npm run start - Start production server

npm run start:dev - Start development server with hot reload

npm run build - Build TypeScript project

Built with Express.js, MongoDB, and TypeScript
