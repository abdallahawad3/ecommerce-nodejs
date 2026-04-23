# 📦 E-Commerce API Backend

A comprehensive RESTful API built with **Express.js** and **TypeScript** for managing an e-commerce platform. This backend provides complete functionality for product management, user authentication, categories, brands, and more.

## ✨ Key Features

- **User Management**: User registration, authentication, and profile management with password hashing (bcryptjs)
- **Product Management**: Full CRUD operations for products with filtering, sorting, and pagination
- **Category System**: Multi-level categorization with categories and subcategories
- **Brand Management**: Brand creation and management
- **Image Upload**: Secure file uploads with image optimization using Sharp and Multer
- **Authentication**: Secure user authentication with JWT-ready architecture
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Centralized error handling with custom error classes
- **Request Logging**: Morgan middleware for detailed request logging
- **CORS Support**: Cross-Origin Resource Sharing enabled
- **Database Integration**: MongoDB with Mongoose ODM
- **Code Quality**: ESLint configuration for code consistency

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: bcryptjs
- **File Upload**: Multer + Sharp (image processing)
- **Validation**: express-validator
- **Utilities**: slugify, uuid
- **DevTools**: ESLint, tsx

## 📁 Project Structure

```
src/
├── controllers/      # Request handlers for all routes
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── middlewares/     # Custom middleware (validation, errors, uploads)
├── validation/      # Schema validation rules
├── utils/           # Helper functions and API features
├── config/          # Database configuration
├── errors/          # Custom error definitions
└── types/           # TypeScript type definitions
```

## 🚀 Quick Start

```bash
npm install
npm run dev          # Development mode
npm run build        # Build TypeScript
npm start           # Production mode
```

## 📝 API Endpoints

- `GET/POST /api/products` - Product management
- `GET/POST /api/categories` - Category management
- `GET/POST /api/subCategories` - Subcategory management
- `GET/POST /api/brands` - Brand management
- `GET/POST /api/users` - User management

## 📦 Dependencies

### Main

- express.js - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- multer - File upload handling
- sharp - Image processing
- express-validator - Input validation
- cors - Cross-Origin Resource Sharing
- morgan - HTTP request logger
- dotenv - Environment variables
- slugify - URL slug generation
- uuid - Unique ID generation

### Dev

- TypeScript - Static type checking
- ESLint - Code quality
- tsx - TypeScript execution

## 🔧 Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

## 📄 License

ISC
