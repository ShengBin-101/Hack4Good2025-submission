# Hack4Good2025

Team Gone4Good's submission for Hack4Good2025. (Backed up from https://github.com/ShengBin-101/Hack4Good2025, as the repository stopped working)

Prototype deployed on Vercel. Link: https://hack4-good2025-submission-frontend.vercel.app/

## Testing the Prototype as a User

```
Email: tester53322@gmail.com
Password: tester
```

> [!IMPORTANT]
> If you want to register your own account, the OTP will be sent to your email and in the SPAM folder. To enable the link in the email, you have to report the email as "Not Phishing".

If you require Admin Actions such as register account, task approval and order approvals, you may contact me at shengbin.chan@gmail.com! 

## Getting started

Requirements:
- Make sure you have npm installed beforehand.

1) Clone the Repo
2) After cloning the repo, go to `path/to/Hack4Good2025-submission/` and run

```
npm install
```

3) Go to `path/to/Hack4Good2025-submission/client/` and run
```
npm install
```
4) Once Dependencies are installed, we can run the web app on `localhost:3000`

Terminal 1: Start Front End
```
cd path/to/Hack4Good2025-submission/client/
npm start
```

Terminal 2: Connect to Back End
```
cd path/to/Hack4Good2025-submission/server/
nodemon index.js
```


# Feature Documentation

## Overview
This document outlines the core features of the application, emphasizing user interaction, admin functionality, and security mechanisms.

---

## Features

### 1. User Registration with OTP Verification
- **Process**:
  - New users are created with a status of `pendingOTP`.
  - An OTP is generated and sent to the user's email for verification.
  - Users must verify the OTP to transition to `pending` status.
- **Integration**:
  - Emails are sent using **Nodemailer**.

### 2. Admin Approval for Users
- **Process**:
  - Once OTP verification is successful, users move to `pending` status.
  - Admins review and approve or reject users.
- **Security**:
  - Admin-specific operations require JWT authentication and admin privileges.

### 3. Secure Password Handling
- **Encryption**:
  - Passwords are hashed using [bcrypt](https://www.npmjs.com/package/bcrypt) before being stored in the database.
  - Ensures secure and irreversible password storage.

### 4. JWT Authentication
- **Process**:
  - Users receive a JWT upon successful login.
  - The token includes:
    - User ID
    - Admin privileges (if applicable)
- **Security**:
  - JWTs are signed with a secret key (`JWT_SECRET`).
  - Admin operations validate the `admin` field in the token payload.

### 5. Product Management
- **Features**:
  - Full CRUD operations (Create, Read, Update, Delete) for products.
  - Products include:
    - Name
    - Description
    - Voucher requirements
    - Stock quantity
    - Image uploads (handled using **Multer**).

### 6. Task Management
- **User Features**:
  - Users can submit tasks, including image uploads.
  - Each task includes:
    - Task description
    - Voucher request amount
    - Completion date
- **Admin Features**:
  - Admins can approve or reject tasks.
  - Approved tasks update the user's voucher balance.

### 7. Transaction Management
- **User Features**:
  - Users can exchange vouchers for products.
  - Transactions track:
    - Product name
    - Quantity
    - Voucher amount deducted
- **Admin Features**:
  - Admins can view all transactions for auditing.

### 8. Nodemailer Integration
- **Use Cases**:
  - Sends OTP emails during user registration.
  - Sends password reset links during password recovery.
- **Configuration**:
  - Uses Gmail as the email service.
  - Authentication credentials are securely managed.

---

## Security Highlights
- **Password Encryption**: Utilizes bcrypt for secure password storage.
- **JWT Authentication**: Ensures secure access to protected endpoints.
- **OTP Verification**: Validates user identity during registration.
- **Role-Based Access Control**: Differentiates between regular users and admins for secure operations.

---

## Additional Notes
- The application supports auditing via transaction history and task logs.
- All file uploads are stored in the `public/assets` directory.
- The modular design of APIs ensures scalability and maintainability.


# Security Documentation

## Overview
This document details the security mechanisms implemented in the application, including password encryption, JSON Web Tokens (JWT), and OTP verification.

---

## Environment Variables
Ensure the following environment variables are set:
- `MONGO_URL`: MongoDB connection string.
- `PORT`: Port number the server listens on.
- `JWT_SECRET`: Secret key used for signing JWT tokens.

Example:
```env
MONGO_URL='mongodb+srv://username:password@cluster.mongodb.net/dbname'
PORT=3001
JWT_SECRET='yourSuperSecretKey'
```

---

## Password Encryption
Passwords are securely hashed using **bcrypt** before being stored in the database.

### Example
**Registration Flow**:
1. The user provides a plaintext password during registration.
2. The password is hashed using bcrypt:
    ```javascript
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    ```
3. The hashed password is stored in the database.

---

## JSON Web Tokens (JWT)
JWTs are used for authentication and authorization. Tokens are signed with the `JWT_SECRET` key.

### Token Verification
**Middleware**:
- `verifyToken`: Verifies the token in the `Authorization` header.
    ```javascript
    const token = req.header("Authorization");
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    ```

- `verifyAdmin`: Ensures the authenticated user has admin privileges.
    ```javascript
    if (!req.user || !req.user.admin) {
        return res.status(403).json({ msg: "Admin access required." });
    }
    ```

---

## OTP (One-Time Password)
OTP is used for account verification. OTPs are generated, stored temporarily, and sent via email.

### OTP Generation
1. Generate a 6-digit random number:
    ```javascript
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    ```
2. Store the OTP and its expiration time in the database:
    ```javascript
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // Expires in 15 minutes
    ```

### OTP Verification
1. Compare the provided OTP with the stored OTP.
2. Check if the OTP has expired:
    ```javascript
    if (new Date() > user.otpExpiresAt) {
        return res.status(400).json({ msg: "OTP expired." });
    }
    ```

### Email Delivery
OTPs are sent to the user's email address using Nodemailer:
```javascript
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your_email@gmail.com",
        pass: "your_email_password",
    },
});
await transporter.sendMail({
    from: '"Your App" <no-reply@yourapp.com>',
    to: email,
    subject: "Verify your account",
    text: `Your OTP is ${otp}`,
    html: `<p>Your OTP is <b>${otp}</b></p>`,
});
```

---

## Forgot Password Flow
1. Generate a temporary reset token:
    ```javascript
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    ```
2. Send the reset token via email.
3. Verify the token and reset the password.

---

## Examples

### Token-Based Authorization
**Request Header**:
```http
Authorization: Bearer <JWT_TOKEN>
```

### Error Responses
- **403 Access Denied**:
    ```json
    {
        "error": "Access Denied!"
    }
    ```

- **500 Internal Server Error**:
    ```json
    {
        "error": "Error details here."
    }
    ```


# Admin API Documentation

## Base URL
`/admin`

## Authentication
All endpoints in this route require the following middleware:
- `verifyToken`: Ensures the user is authenticated.
- `verifyAdmin`: Ensures the user has admin privileges.

---

## Endpoints

### 1. Get Pending Users
**GET** `/admin/pending`  
- **Description**: Retrieves all users with the status `pending`.  
- **Authentication**: Admin token required.  
- **Response Example**:
    ```json
    [
        {
            "_id": "12345",
            "name": "John Doe",
            "email": "john@example.com",
            "status": "pending"
        }
    ]
    ```

---

### 2. Get Existing Users
**GET** `/admin/existing`  
- **Description**: Retrieves all users whose status is not `pending`.  
- **Authentication**: Admin token required.  
- **Response Example**:
    ```json
    [
        {
            "_id": "67890",
            "name": "Jane Doe",
            "email": "jane@example.com",
            "status": "approved"
        }
    ]
    ```

---

### 3. Approve User
**PUT** `/admin/approve/:id`  
- **Description**: Approves a user by setting their status to `approved`.  
- **Path Parameters**:
    - `id` (string): The user ID.  
- **Authentication**: Admin token required.  
- **Response Example**:
    ```json
    {
        "_id": "67890",
        "name": "Jane Doe",
        "status": "approved"
    }
    ```

---

### 4. Reject User
**DELETE** `/admin/reject/:id`  
- **Description**: Rejects and deletes a user by ID.  
- **Path Parameters**:
    - `id` (string): The user ID.  
- **Authentication**: Admin token required.  
- **Response Example**:
    ```json
    {
        "msg": "User rejected and deleted"
    }
    ```

---

### 5. Delete User
**DELETE** `/admin/delete/:id`  
- **Description**: Deletes a user by ID.  
- **Path Parameters**:
    - `id` (string): The user ID.  
- **Authentication**: Admin token required.  
- **Response Example**:
    ```json
    {
        "message": "User deleted successfully",
        "deletedUser": {
            "_id": "12345",
            "name": "John Doe",
            "email": "john@example.com"
        }
    }
    ```


# Auth API Documentation

## Base URL
`/auth`

## Authentication
- Most routes do not require authentication except for sensitive operations like password resets.
- Admin registration requires elevated permissions.

---

## Endpoints

### 1. Register User
**POST** `/auth/register`  
- **Description**: Registers a new user and sends an OTP email.  
- **Request Body** (JSON):
    ```json
    {
        "name": "John Doe",
        "email": "john@example.com",
        "birthday": "1990-01-01",
        "password": "securepassword"
    }
    ```
- **Response Example**:
    ```json
    {
        "_id": "12345",
        "name": "John Doe",
        "email": "john@example.com",
        "status": "pendingOTP",
        "otpExpiresAt": "2025-01-01T12:00:00.000Z"
    }
    ```

---

### 2. Login
**POST** `/auth/login`  
- **Description**: Authenticates a user and returns a JWT token.  
- **Request Body** (JSON):
    ```json
    {
        "email": "john@example.com",
        "password": "securepassword"
    }
    ```
- **Response Example**:
    ```json
    {
        "token": "jwt_token_here",
        "user": {
            "_id": "12345",
            "name": "John Doe",
            "email": "john@example.com"
        }
    }
    ```

---

### 3. Verify OTP
**POST** `/auth/verify-otp`  
- **Description**: Verifies the OTP, moves user from `pendingOTP` to `pending`.  
- **Request Body** (JSON):
    ```json
    {
        "userId": "12345",
        "otp": "123456"
    }
    ```
- **Response Example**:
    ```json
    {
        "msg": "OTP verified. Awaiting admin approval."
    }
    ```

---

### 4. Register Admin
**POST** `/auth/register-admin`  
- **Description**: Registers an admin user.  
- **Request Body** (JSON):
    ```json
    {
        "name": "Admin Name",
        "email": "admin@example.com",
        "birthday": "1990-01-01",
        "password": "securepassword",
        "userPicturePath": "optional-profile.jpg"
    }
    ```
- **Response Example**:
    ```json
    {
        "_id": "adminID",
        "name": "Admin Name",
        "email": "admin@example.com",
        "admin": true,
        "status": "pendingOTP"
    }
    ```

---

### 5. Forgot Password
**POST** `/auth/forgot-password`  
- **Description**: Sends a reset link to the user’s email.  
- **Request Body** (JSON):
    ```json
    {
        "email": "john@example.com"
    }
    ```
- **Response Example**:
    ```json
    {
        "msg": "Reset link sent to your email"
    }
    ```

---

### 6. Reset Password
**POST** `/auth/reset-password`  
- **Description**: Resets the user’s password using a valid token.  
- **Request Body** (JSON):
    ```json
    {
        "userId": "12345",
        "token": "jwt_reset_token",
        "password": "newPassword"
    }
    ```
- **Response Example**:
    ```json
    {
        "msg": "Password reset successful"
    }
    ```


# Product API Documentation

## Base URL
`/products`

## Authentication
- All endpoints require `verifyToken` middleware for authentication.
- Admin-specific operations (create, update, delete) additionally require `verifyAdmin` middleware.

---

## Endpoints

### 1. Create Product
**POST** `/products`  
- **Description**: Creates a new product.  
- **Request Body** (multipart/form-data):
    ```json
    {
        "name": "Product Name",
        "description": "Description of the product",
        "voucherNeeded": 10,
        "stockQuantity": 100,
        "productPicture": "uploaded file"
    }
    ```
- **Response Example** (`201 Created`):
    ```json
    {
        "_id": "p123",
        "name": "Product Name",
        "description": "Description of the product",
        "voucherNeeded": 10,
        "stockQuantity": 100,
        "productPicturePath": "product_image.jpg"
    }
    ```

---

### 2. Update Product
**PUT** `/products/:id`  
- **Description**: Updates an existing product by its ID.  
- **Path Parameters**:
    - `id` (string): The product ID.  
- **Request Body** (multipart/form-data):
    ```json
    {
        "name": "Updated Product Name",
        "description": "Updated description",
        "voucherNeeded": 15,
        "stockQuantity": 80,
        "productPicture": "new uploaded file (optional)"
    }
    ```
- **Response Example** (`200 OK`):
    ```json
    {
        "_id": "p123",
        "name": "Updated Product Name",
        "description": "Updated description",
        "voucherNeeded": 15,
        "stockQuantity": 80,
        "productPicturePath": "updated_product_image.jpg"
    }
    ```

---

### 3. Delete Product
**DELETE** `/products/:id`  
- **Description**: Deletes a product by its ID.  
- **Path Parameters**:
    - `id` (string): The product ID.  
- **Response Example** (`200 OK`):
    ```json
    {
        "msg": "Product deleted successfully."
    }
    ```

---

### 4. Get All Products
**GET** `/products`  
- **Description**: Retrieves all products.  
- **Response Example** (`200 OK`):
    ```json
    [
        {
            "_id": "p123",
            "name": "Product A",
            "description": "Description A",
            "voucherNeeded": 5,
            "stockQuantity": 20,
            "productPicturePath": "product_a.jpg"
        },
        {
            "_id": "p456",
            "name": "Product B",
            "description": "Description B",
            "voucherNeeded": 3,
            "stockQuantity": 15,
            "productPicturePath": "product_b.jpg"
        }
    ]
    ```


# Task API Documentation

## Base URL
`/tasks`

## Authentication
- All endpoints require `verifyToken` middleware for authentication.
- Admin-specific operations (approval, viewing all tasks) additionally require `verifyAdmin` middleware.

---

## Endpoints

### 1. Create Task
**POST** `/tasks`  
- **Description**: Allows a user to create a task with an associated picture.  
- **Request Body** (multipart/form-data):
    ```json
    {
        "userId": "12345",
        "taskDescription": "Description of the task",
        "voucherRequest": 10,
        "dateCompleted": "2025-01-20",
        "picture": "uploaded file"
    }
    ```
- **Response Example** (`201 Created`):
    ```json
    {
        "_id": "t123",
        "userId": "12345",
        "taskDescription": "Description of the task",
        "voucherRequest": 10,
        "dateCompleted": "2025-01-20",
        "taskPicturePath": "task_image.jpg",
        "status": "pending"
    }
    ```

---

### 2. Approve/Reject Task
**PUT** `/tasks/:taskId/approve`  
- **Description**: Admin approves or rejects a task.  
- **Path Parameters**:
    - `taskId` (string): The task ID.  
- **Request Body** (JSON):
    ```json
    {
        "approval": true  // or false
    }
    ```
- **Response Example** (`200 OK` if approved):
    ```json
    {
        "msg": "Task has been approved.",
        "task": {
            "_id": "t123",
            "status": "approved",
            "voucherRequest": 10
        }
    }
    ```

---

### 3. Get All Tasks
**GET** `/tasks`  
- **Description**: Retrieves all tasks. **Admin only**.  
- **Response Example** (`200 OK`):
    ```json
    [
        {
            "_id": "t123",
            "userId": "12345",
            "taskDescription": "Description of the task",
            "status": "approved",
            "voucherRequest": 10,
            "taskPicturePath": "task_image.jpg"
        },
        {
            "_id": "t456",
            "userId": "67890",
            "taskDescription": "Another task description",
            "status": "pending",
            "voucherRequest": 5,
            "taskPicturePath": "another_task_image.jpg"
        }
    ]
    ```

---

### 4. Get User Tasks
**GET** `/tasks/:userId`  
- **Description**: Retrieves all tasks associated with a specific user.  
- **Path Parameters**:
    - `userId` (string): The user ID.  
- **Response Example** (`200 OK`):
    ```json
    [
        {
            "_id": "t123",
            "taskDescription": "Description of the task",
            "status": "approved",
            "voucherRequest": 10,
            "taskPicturePath": "task_image.jpg"
        },
        {
            "_id": "t789",
            "taskDescription": "Yet another task description",
            "status": "rejected",
            "voucherRequest": 15,
            "taskPicturePath": "yet_another_task_image.jpg"
        }
    ]
    ```


# Task Category API Documentation

## Base URL
`/task-categories`

## Authentication
- All endpoints require `verifyToken` middleware for authentication.
- The creation of a task category requires `verifyAdmin` middleware.

---

## Endpoints

### 1. Create Task Category
**POST** `/task-categories`  
- **Description**: Allows an admin to create a new task category.  
- **Request Body** (JSON):
    ```json
    {
        "name": "Category Name",
        "voucherValue": 10,
        "description": "Description of the category"
    }
    ```
- **Response Example** (`201 Created`):
    ```json
    {
        "_id": "c123",
        "name": "Category Name",
        "voucherValue": 10,
        "description": "Description of the category"
    }
    ```

---

### 2. Get Task Categories
**GET** `/task-categories`  
- **Description**: Retrieves all task categories.  
- **Response Example** (`200 OK`):
    ```json
    [
        {
            "_id": "c123",
            "name": "Category A",
            "voucherValue": 10,
            "description": "Description of Category A"
        },
        {
            "_id": "c456",
            "name": "Category B",
            "voucherValue": 5,
            "description": "Description of Category B"
        }
    ]
    ```


# Transaction API Documentation

## Base URL
`/transactions`

## Authentication
- All endpoints require `verifyToken` middleware for authentication.
- Viewing all transactions requires `verifyAdmin` middleware.

---

## Endpoints

### 1. Create Transaction
**POST** `/transactions`  
- **Description**: Allows a user to create a transaction by redeeming products using vouchers.  
- **Request Body** (JSON):
    ```json
    {
        "userId": "12345",
        "productName": "Product A",
        "productQuantity": 2,
        "dateTransaction": "2025-01-25",
        "timeTransaction": "15:30"
    }
    ```
- **Response Example** (`201 Created`):
    ```json
    {
        "_id": "txn001",
        "userId": "12345",
        "productName": "Product A",
        "productQuantity": 2,
        "voucherTransaction": 20,
        "dateTransaction": "2025-01-25",
        "timeTransaction": "15:30"
    }
    ```

---

### 2. Get User Transactions
**GET** `/transactions/user/:userId`  
- **Description**: Retrieves all transactions associated with a specific user.  
- **Path Parameters**:
    - `userId` (string): The user ID.  
- **Response Example** (`200 OK`):
    ```json
    [
        {
            "_id": "txn001",
            "productName": "Product A",
            "productQuantity": 2,
            "voucherTransaction": 20,
            "dateTransaction": "2025-01-25",
            "timeTransaction": "15:30"
        },
        {
            "_id": "txn002",
            "productName": "Product B",
            "productQuantity": 1,
            "voucherTransaction": 10,
            "dateTransaction": "2025-01-26",
            "timeTransaction": "10:00"
        }
    ]
    ```

---

### 3. Get All Transactions (Admin)
**GET** `/transactions`  
- **Description**: Retrieves all transactions. **Admin only**.  
- **Response Example** (`200 OK`):
    ```json
    [
        {
            "_id": "txn001",
            "userId": "12345",
            "productName": "Product A",
            "productQuantity": 2,
            "voucherTransaction": 20,
            "dateTransaction": "2025-01-25",
            "timeTransaction": "15:30"
        },
        {
            "_id": "txn002",
            "userId": "67890",
            "productName": "Product B",
            "productQuantity": 1,
            "voucherTransaction": 10,
            "dateTransaction": "2025-01-26",
            "timeTransaction": "10:00"
        }
    ]
    ```


# User API Documentation

## Base URL
`/users`

## Authentication
- All endpoints require `verifyToken` middleware for authentication.

---

## Endpoints

### 1. Get User by ID
**GET** `/users/:userId`  
- **Description**: Retrieves detailed information about a specific user based on their user ID.  
- **Path Parameters**:
    - `userId` (string): The ID of the user whose information is being requested.  
- **Response Example** (`200 OK`):
    ```json
    {
        "_id": "12345",
        "name": "John Doe",
        "email": "john@example.com",
        "birthday": "1990-01-01",
        "voucher": 50,
        "status": "approved",
        "userPicturePath": "profile.jpg"
    }
    ```
- **Error Responses**:
    - **404 Not Found**:
        ```json
        {
            "msg": "User not found."
        }
        ```
    - **500 Internal Server Error**:
        ```json
        {
            "error": "Error details here."
        }
        ```

