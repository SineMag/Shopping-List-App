<img src="https://socialify.git.ci/SineMag/Shopping-List-App/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="Shopping-List-App" width="640" height="320" />

# Shopping List App

A full-featured shopping list application built with **React**, **TypeScript**, **Redux Toolkit**, and **json-server**. This app allows users to manage multiple shopping lists with complete CRUD functionality, user authentication, and advanced features like search, sorting, and URL-based filtering.

## 🎯 Project Overview

**Developer:** Sinenhlanhla Magubane   
**Framework:** React 19 with TypeScript  
**State Management:** Redux Toolkit  
**Backend:** json-server  

This is Task 5 from the React curriculum (Lesson 5), demonstrating modern React development practices including protected routing, Redux state management, and RESTful API integration.

---

## ✨ Features

### User Management
- **Registration**: Users can create accounts with email, password, name, surname, and cell number
- **Authentication**: Secure login with bcrypt password encryption/decryption
- **Protected Routes**: Authorization system prevents unauthorized access
- **Profile Management**: Users can view and update their profile information and credentials

### Shopping List Management
- **Create**: Add new shopping lists with custom names
- **Read**: View all your shopping lists and items
- **Update**: Edit existing lists and items
- **Delete**: Remove lists and items you no longer need
- **Multiple Lists**: Manage multiple shopping lists simultaneously

### Item Management
- **Add Items**: Add items with name, quantity, notes, category, and images
- **Search**: Real-time search functionality with URL parameter tracking
- **Sort**: Sort items by name (A-Z, Z-A), date added, or category
- **Filter**: Filter items by category
- **Image Upload**: Support for item images (file upload or URL)

### Advanced Features
- **URL Parameters**: Search and sort keywords visible in URL
- **URL Sync**: Updating URL parameters automatically updates the view
- **Category System**: Pre-defined categories for better organization
- **Share Lists**: Generate shareable links for shopping lists
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Notifications**: Toast messages for user feedback

---

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1, TypeScript 5.8.3
- **State Management**: Redux Toolkit 2.9.0, React-Redux 9.2.0
- **Routing**: React Router DOM 7.9.3
- **Backend**: json-server 1.0.0-beta.3
- **Security**: bcryptjs 3.0.2
- **Icons**: React Icons 5.5.0
- **Build Tool**: Vite 7.1.7
- **HTTP Client**: Axios 1.12.2

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SineMag/Shopping-List-App.git
   cd "Shopping List App"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the json-server** (Terminal 1)
   ```bash
   npm run server
   ```
   This starts the backend API on `http://localhost:3001`

4. **Start the development server** (Terminal 2)
   ```bash
   npm run dev
   ```
   This starts the React app (usually on `http://localhost:5173`)

5. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 📁 Project Structure

```
Shopping List App/
├── src/
│   ├── components/
│   │   ├── Footer.tsx          # Footer component
│   │   ├── Navbar.tsx          # Navigation bar
│   │   └── Toast.tsx           # Toast notification system
│   ├── data/
│   │   └── db.json             # json-server database
│   ├── features/
│   │   ├── ItemsSlice.ts       # Redux slice for items
│   │   ├── ListsSlice.ts       # Redux slice for shopping lists
│   │   ├── LoginSlice.ts       # Redux slice for login state
│   │   └── ...
│   ├── pages/
│   │   ├── HomePage.tsx        # Main dashboard
│   │   ├── LoginPage.tsx       # User login
│   │   ├── RegisterPage.tsx    # User registration
│   │   ├── ProfilePage.tsx     # User profile
│   │   ├── ListsPage.tsx       # Shopping lists management
│   │   ├── CategoriesPage.tsx  # Categories management
│   │   └── NotFoundPage.tsx    # 404 page
│   ├── App.tsx                 # Main app component with routes
│   ├── App.css                 # Global styles
│   └── main.tsx                # App entry point
├── store.ts                    # Redux store configuration
├── package.json
└── README.md
```

---

## 🔐 Authentication & Security

- **Password Encryption**: All passwords are hashed using bcrypt with salt rounds of 10
- **Protected Routes**: Logged-in users cannot access login/register pages
- **Authorization**: Non-authenticated users are redirected to login when accessing protected pages
- **Local Storage**: Auth tokens and user data stored securely in localStorage
- **Credential Validation**: Client-side and server-side validation

---

## 🎨 Pages

### 1. **Landing Page** (`/`)
- Welcome page for non-authenticated users
- Links to login and registration

### 2. **Login Page** (`/login`)
- Email and password authentication
- Input validation and error handling
- Redirect to home after successful login

### 3. **Registration Page** (`/register`)
- Multi-field registration form
- Email uniqueness validation
- Password confirmation
- Automatic login after registration

### 4. **Home Page** (`/home`) - Protected
- Personalized welcome message
- Quick access cards to main features
- Navigation to lists, categories, and profile

### 5. **Lists Page** (`/lists`) - Protected
- View all shopping lists
- Create, edit, and delete lists
- Add, edit, and delete items
- Search and sort functionality
- Category filtering
- Share list functionality

### 6. **Categories Page** (`/categories`) - Protected
- Manage item categories
- Add, edit, and delete categories
- View items by category

### 7. **Profile Page** (`/profile`) - Protected
- View and edit user information
- Change avatar
- Update password
- Persistent profile updates

---

## 🔍 Key Features Explained

### Search & Filter
- **URL-based search**: `?q=milk` searches for "milk"
- **Real-time updates**: Results update as you type
- **Category filter**: `?cat=Dairy` shows only Dairy items
- **Combined filters**: `?q=milk&cat=Dairy&sort=name_asc`

### Sorting Options
- **Date Descending**: `?sort=date_desc` (default)
- **Name A-Z**: `?sort=name_asc`
- **Name Z-A**: `?sort=name_desc`
- **Category**: `?sort=category`

### List Sharing
- Click "Share" button to copy list URL
- URL includes current filters and list ID
- Anyone with the link can view the list

---

## 📱 Responsive Breakpoints

The app is fully responsive and tested at:
- **320px** - Small mobile devices
- **480px** - Mobile phones
- **768px** - Tablets
- **1024px** - Laptops
- **1200px** - Desktops

---

## 🧪 Testing Instructions

### Test User Account
- **Email**: `em@mail.com`
- **Password**: `123456` (hashed in db.json)

### Test Workflow
1. **Register** a new account or login with test credentials
2. **Create** a new shopping list
3. **Add items** to your list with different categories
4. **Search** for items by name
5. **Sort** items using different options
6. **Filter** by category
7. **Edit** item details
8. **Delete** items
9. **Share** your list
10. **Update profile** information

---

## 📊 API Endpoints (json-server)

Base URL: `http://localhost:3001`

### Users
- `GET /users` - Get all users
- `GET /users?email={email}` - Find user by email
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Shopping Lists
- `GET /shopping-lists?userId={userId}` - Get user's lists
- `POST /shopping-lists` - Create new list
- `PUT /shopping-lists/:id` - Update list
- `DELETE /shopping-lists/:id` - Delete list

### Items
- `GET /items` - Get all items
- `GET /items?listId={listId}` - Get items for a list
- `GET /items?category={category}` - Filter by category
- `GET /items?name_like={query}` - Search by name
- `POST /items` - Create new item
- `PUT /items/:id` - Update item
- `DELETE /items/:id` - Delete item

### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

---

## 🚀 Available Scripts

```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run server       # Start json-server on port 3001
```

---

## ✅ Evaluation Criteria Met

### 1. GitHub Interaction ✓
- Frequent commits for every feature
- Clear commit messages
- Branch management (development/main)

### 2. User-Friendliness & Design ✓
- Intuitive navigation
- Consistent color scheme and typography
- Responsive layout
- Toast notifications for user feedback
- Hover effects on interactive elements

### 3. Functionality ✓
- User registration and login
- Encrypted credentials (bcrypt)
- Full CRUD for lists and items
- Search, sort, and filter
- URL parameter tracking
- Category organization

### 4. Security ✓
- Protected routes implemented
- Password encryption
- Authorization checks
- Secure data handling

### 5. Page Interactivity ✓
- Cursor changes on hover
- Color changes for interactive elements
- Easy navigation between pages
- Smooth transitions

### 6. React/TS Features ✓
- Custom reusable components
- Redux Toolkit for state management
- Props and state management
- TypeScript for type safety

### 7. Code Quality ✓
- camelCase naming convention
- Self-explanatory variable names
- Modular code structure
- Comments where needed
- Clean and readable code

### 8. Responsiveness ✓
- Mobile-first design
- Tested at all required breakpoints
- Flexible layouts

### 9. Documentation ✓
- Comprehensive README
- Setup instructions
- Feature documentation
- API endpoint documentation

---

## 🐛 Known Issues & Future Enhancements

### Current Limitations
- Image upload stores base64 in database (consider cloud storage for production)
- No real-time collaboration features
- No email verification for registration

### Future Enhancements
- Email verification
- Password reset functionality
- Dark mode toggle
- Export lists to PDF
- Barcode scanning
- Price tracking
- Recipe integration
- Meal planning features

---

## 📝 License

This project is submitted as part of academic coursework and is subject to the institution's academic integrity policy.

---

## 👤 Author

**Sinenhlanhla Magubane**  
GitHub: https://github.com/SineMag/

---

## 🙏 Acknowledgments

- Mobile Applications course instructors
- React documentation
- Redux Toolkit documentation
- Vite documentation
- json-server documentation

---

