<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
<a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
<a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

## Description

This repository contains the **backend** of an **Online Library with Payment Integration**, built using **NestJS**. The backend provides RESTful APIs for managing books, users, and payment transactions. It allows users to read books online or purchase digital content securely.

---

## 🚀 Features

- **Book Management**: CRUD operations for managing books in the library.
- **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens).
- **Payment Integration**: Supports online payments for purchasing digital content.
- **RESTful APIs**: Provides endpoints for frontend interaction (built with Angular).
- **Scalable Architecture**: Built with NestJS for efficient and scalable server-side applications.

---

## 🛠️ Technologies Used

- **Backend Framework**: NestJS
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Integration**: Stripe or PayPal (depending on implementation)
- **API Documentation**: Swagger (optional)
- **Testing**: Jest (unit and e2e tests)

---

## 📂 Repository Structure

online-library-backend/
├── src/
│ ├── auth/ # Authentication module (JWT)
│ ├── books/ # Book management module
│ ├── payments/ # Payment integration module
│ ├── users/ # User management module
│ ├── app.module.ts # Main application module
│ └── main.ts # Application entry point
├── test/ # Unit and e2e tests
├── .env # Environment variables
├── README.md # Project documentation
└── .gitignore # Git ignore file


---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- NestJS CLI (`npm install -g @nestjs/cli`)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/SaifeddineBENZAIED/online-library-backend.git
   cd online-library-backend

Install Dependencies:

```bash
npm install
```

Set Up Environment Variables:

Create a .env file in the root directory and add the following:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/online_library
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Run Migrations:

```bash
npm run typeorm migration:run
```

Start the Application:

```bash
npm run start
```

The backend will be available at http://localhost:3000.

🔍 Key Features

Book Management

- CRUD Operations: Create, read, update, and delete books.

- Search and Filter: Search books by title, author, or category.

User Authentication

- JWT Authentication: Secure user login and registration.

- Role-Based Access: Different roles (admin, user) with specific permissions.

RESTful APIs

- Swagger Documentation: API documentation for easy testing and integration.

📫 Contact
For questions or feedback, feel free to reach out:

- Email: saif2001benz2036@gmail.com
