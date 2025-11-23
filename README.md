# 🍔 Food-App

A full-stack web application for food ordering with comprehensive admin and user management features. Built with Node.js, Express, MongoDB, and JWT authentication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Features

- 👤 User registration and authentication
- 🔐 Secure JWT-based session management
- 🍕 Browse available menu items
- 📝 Create, view, edit, and delete personal orders
- 👁️ View order history

### Admin Features

- 🛡️ Admin role-based access control
- 📋 Create, edit, and delete menu items
- 📊 View all user orders
- 📈 Export orders to Excel format
- 🎛️ Full CRUD operations on menu and orders

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **Template Engine:** EJS
- **Testing:** Jest, Supertest
- **Dev Tools:** Nodemon, env-cmd
- **Utilities:** Cookie-parser, Validator, xlsx, yargs

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB** (v4.0 or higher) - Local installation or MongoDB Atlas account
- **Git**

Check your installations:

```bash
node --version
npm --version
git --version
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/EmmanuScript/Food-App.git
cd Food-App
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:

- express
- mongoose
- jsonwebtoken
- bcryptjs
- ejs
- cookie-parser
- validator
- xlsx
- jest (dev)
- supertest (dev)
- nodemon (dev)

## ⚙️ Configuration

### 1. Environment Variables

Create a `config/dev.env` file in the root directory with the following variables:

```env
PORT=3003
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

**Important:**

- Replace `your_mongodb_connection_string` with your actual MongoDB connection string
- Replace `your_jwt_secret_key` with a strong, random secret key
- For MongoDB Atlas, the format is: `mongodb+srv://<username>:<password>@cluster.mongodb.net/food-app?retryWrites=true&w=majority`

### 2. MongoDB Setup

**Option A: Local MongoDB**

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/food-app`

**Option B: MongoDB Atlas (Cloud)**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string from "Connect" > "Connect your application"
4. Whitelist your IP address
5. Create database user with credentials

## 🔐 Authentication & Authorization

This application implements role-based access control (RBAC) with two user roles:

### User Roles

- **User** (default): Can create, view, edit, and delete their own orders
- **Admin**: Has all User permissions plus menu management and viewing all orders

### Middleware Functions

The application uses three middleware functions defined in `middleware/auth.js`:

1. **requireAuth**: Validates JWT token, redirects to login if invalid
2. **checkUser**: Extracts user info from JWT and attaches to request
3. **authRole**: Checks if user has Admin role, redirects non-admins to /home

### Authorization Pattern

Admin-only routes should use both `requireAuth` and `authRole` middleware:

```javascript
app.get("/admin-route", requireAuth, authRole, (req, res) => {
  // Admin-only logic
});
```

User routes only need `requireAuth`:

```javascript
app.get("/user-route", requireAuth, (req, res) => {
  // Authenticated user logic
});
```

**Important**: All write operations (POST, PATCH, DELETE) on menu items require Admin role. User operations on orders only require authentication.

## 🎯 Running the Application

### Development Mode (with auto-restart)

```bash
npm run dev
```

The server will start on `http://localhost:3003` (or your specified PORT) and automatically restart on file changes.

### Production Mode

```bash
npm start
```

Runs the application without auto-restart.

### Accessing the Application

Once running, open your browser and navigate to:

```
http://localhost:3003
```

**Default Routes:**

- `/` - Home/Landing page
- `/signup` - User registration
- `/login` - User login
- `/home` - User dashboard (requires authentication)
- `/make-order` - Create new order (requires authentication)
- `/admin-home` - Admin dashboard (requires admin role)
- `/create-menu` - Create menu items (admin only)

## 🧪 Testing

The application includes comprehensive test coverage for authentication, orders, admin functions, and models.

### Running Tests

**Watch Mode (Recommended for Development)**

```bash
npm test
```

Runs tests in watch mode with coverage report. Tests will re-run when files change.

**CI Mode (For Continuous Integration)**

```bash
npm run test:ci
```

Runs tests once with coverage report, suitable for CI/CD pipelines.

### Test Structure

```
__tests__/
├── auth.test.js      # Authentication tests (signup, login, logout)
├── order.test.js     # Order management tests (CRUD operations)
├── admin.test.js     # Admin functionality tests (role-based access)
└── models.test.js    # Database model validation tests
```

### Test Coverage

Tests cover:

- ✅ User registration with validation
- ✅ User authentication (login/logout)
- ✅ Order creation, retrieval, updating, and deletion
- ✅ Admin-only operations (menu management)
- ✅ Role-based access control
- ✅ Database model validation
- ✅ Password hashing
- ✅ JWT token generation

### Viewing Coverage Report

After running tests, view the coverage report:

```bash
# Open coverage/lcov-report/index.html in your browser
```

### Writing New Tests

To add new tests:

1. Create a new file in `__tests__/` directory with `.test.js` extension
2. Follow the existing test structure
3. Run `npm test` to verify

Example test structure:

```javascript
const request = require("supertest");
const app = require("../app");

describe("Feature Tests", () => {
  it("should do something", async () => {
    const res = await request(app).get("/endpoint");
    expect(res.statusCode).toBe(200);
  });
});
```

## 📁 Project Structure

```
Food-App/
├── __tests__/                 # Test files
│   ├── auth.test.js          # Authentication tests
│   ├── order.test.js         # Order management tests
│   ├── admin.test.js         # Admin function tests
│   └── models.test.js        # Model validation tests
├── config/
│   └── dev.env               # Environment variables
├── controllers/
│   ├── adminControllers.js   # Admin logic (menu, orders management)
│   ├── authController.js     # Order operations
│   └── regController.js      # User registration
├── middleware/
│   └── auth.js               # JWT authentication & role verification
├── model/
│   ├── Menu.js               # Menu schema
│   ├── Order.js              # Order schema
│   └── User.js               # User schema with password hashing
├── public/
│   ├── css/                  # Stylesheets
│   ├── img/                  # Images
│   └── downloads/            # Exported files
├── routes/
│   ├── adminRoutes.js        # Admin endpoints
│   └── authRoutes.js         # Auth & order endpoints
├── views/                    # EJS templates
│   ├── partials/             # Reusable components (header, footer)
│   ├── index.ejs             # Landing page
│   ├── signup.ejs            # Registration page
│   ├── login.ejs             # Login page
│   ├── home.ejs              # User dashboard
│   ├── make-order.ejs        # Order creation form
│   ├── edit-order.ejs        # Order editing page
│   ├── admin-home.ejs        # Admin dashboard
│   ├── create-menu.ejs       # Menu creation form
│   ├── edit-menu.ejs         # Menu editing page
│   └── see-orders.ejs        # View all orders
├── app.js                    # Express app setup
├── package.json              # Dependencies & scripts
├── vercel.json               # Vercel deployment config
└── README.md                 # This file
```

## 🔌 API Endpoints

### Authentication Routes

| Method | Endpoint  | Description       | Auth Required |
| ------ | --------- | ----------------- | ------------- |
| GET    | `/signup` | Signup page       | No            |
| POST   | `/signup` | Create new user   | No            |
| GET    | `/login`  | Login page        | No            |
| POST   | `/login`  | Authenticate user | No            |
| GET    | `/logout` | Logout user       | No            |

### User/Order Routes

| Method | Endpoint        | Description       | Auth Required |
| ------ | --------------- | ----------------- | ------------- |
| GET    | `/home`         | User dashboard    | Yes           |
| GET    | `/make-order`   | Order form page   | Yes           |
| POST   | `/make-order`   | Create new order  | Yes           |
| GET    | `/get-orders`   | Get user's orders | Yes           |
| PATCH  | `/edit-order`   | Update order      | Yes           |
| DELETE | `/delete-order` | Delete order      | Yes           |

### Admin Routes

| Method | Endpoint          | Description            | Auth Required | Admin Only |
| ------ | ----------------- | ---------------------- | ------------- | ---------- |
| GET    | `/admin-home`     | Admin dashboard        | Yes           | Yes        |
| GET    | `/create-menu`    | Menu creation page     | Yes           | Yes        |
| POST   | `/create-menu`    | Create menu item       | Yes           | Yes        |
| GET    | `/get-menu`       | Get all menu items     | Yes           | Yes        |
| PATCH  | `/edit-menu`      | Update menu item       | Yes           | Yes        |
| DELETE | `/delete-menu`    | Delete menu item       | Yes           | Yes        |
| GET    | `/get-all-orders` | Get all orders         | Yes           | Yes        |
| GET    | `/export`         | Export orders to Excel | Yes           | Yes        |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Use consistent indentation (2 spaces)
- Follow existing code patterns
- Add comments for complex logic
- Write tests for new features

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Emmanuel Oanjorin** (EmmanuScript)

- GitHub: [@EmmanuScript](https://github.com/EmmanuScript)
- Repository: [Food-App](https://github.com/EmmanuScript/Food-App)

## 🐛 Issues

If you encounter any bugs or have feature requests, please [open an issue](https://github.com/EmmanuScript/Food-App/issues).

## 📞 Support

For support, email [your-email@example.com] or open an issue on GitHub.

---

**Happy Coding! 🚀**
