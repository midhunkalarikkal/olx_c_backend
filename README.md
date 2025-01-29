# 0lx_backend

## Description
This is an Express server for the OLX project, designed to perform CRUD operations. The project is built to master various concepts, including React, Tailwind CSS, Context API, custom hooks, and more.

## Features
- CRUD operations for handling data
- Cloudinary storage for image uploads
- Express.js for backend handling
- MongoDB with Mongoose for database management
- Environment variable handling with dotenv
- File uploads using Multer
- CORS support for cross-origin requests

## Dependencies
The server uses the following dependencies:

- **express** - Web framework for Node.js
- **mongoose** - MongoDB object modeling tool
- **cloudinary** - Cloud storage for images
- **multer** - Middleware for handling file uploads
- **multer-storage-cloudinary** - Cloudinary storage for Multer
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Development
- **nodemon** is used for hot-reloading in development mode.

## Scripts
- `npm run dev` - Starts the server using nodemon
- `npm start` - Starts the server normally

## Image Uploads
Images are uploaded to Cloudinary using Multer and Cloudinary storage integration.
