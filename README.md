# 🌍 ExploreHub

ExploreHub is a modern **travel accommodation platform** inspired by Airbnb. It allows users to discover beautiful places, share unique stays, and explore destinations around the world. The platform provides a simple and intuitive interface for travelers to browse listings, view details, leave reviews, and manage their own properties.

---

## 🚀 Features

### 👤 User Authentication
- Secure user registration and login
- Password hashing using **bcrypt**
- Session-based authentication
- Protected routes for authorized users

### 🏡 Property Listings
- Create new property listings
- Edit existing listings
- Delete listings
- View detailed information about each property
- Browse all available properties
- Responsive property cards with images

### 📍 Location Support
- Store property location with city, state, and country
- Map integration for viewing property locations
- Easy navigation for travelers

### ⭐ Reviews & Ratings
- Add reviews for properties
- Delete your own reviews
- Display all reviews on listing pages

### 🖼 Image Upload
- Upload property images
- Display high-quality images for every listing

### 🔒 Authorization
- Only listing owners can edit or delete their listings
- Users can only manage their own reviews

### 📱 Responsive Design
- Mobile-friendly interface
- Clean and modern UI
- Optimized for desktop, tablet, and mobile devices

---

# 🛠 Tech Stack

## Frontend
- HTML5
- CSS3
- Bootstrap 5
- EJS
- JavaScript

## Backend
- Node.js
- Express.js

## Database
- MongoDB
- Mongoose

## Authentication
- Passport.js
- Passport Local
- Express Session
- bcrypt

## Other Packages
- Connect Flash
- Method Override
- Dotenv
- Multer
- Cloudinary (for image storage)
- Mapbox (for maps and geocoding)

---

# 📂 Project Structure

```
ExploreHub/
│
├── models/
├── routes/
├── controllers/
├── middleware/
├── views/
├── public/
├── utils/
├── data/
├── app.js
├── package.json
└── README.md
```

---

# ⚙ Installation

## Clone the repository

```bash
git clone https://github.com/yourusername/explorehub.git
```

Move into the project folder

```bash
cd explorehub
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
ATLASDB_URL=
SECRET=
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
MAP_TOKEN=
```

Start the server

```bash
npx nodemon
```

or

```bash
nodemon index.js
```

---

# 📷 Main Pages

- Home Page
- Explore Listings
- Listing Details
- Create Listing
- Edit Listing
- Login
- Register
- User Profile
- Reviews

---

# 🌎 How ExploreHub Helps People

ExploreHub makes travel planning simple and enjoyable by allowing users to:

- 🌍 Discover amazing destinations around the world.
- 🏡 Find unique accommodations such as villas, cottages, apartments, resorts, cabins, and homestays.
- 📍 Easily locate properties using integrated maps.
- ⭐ Read genuine reviews before booking.
- ✍ Share travel experiences with other users.
- 📸 Showcase rental properties with beautiful images.
- 🤝 Connect travelers with property owners.
- 💼 Help local hosts promote their accommodations online.
- 🧳 Make trip planning faster, safer, and more convenient.

Whether you're looking for a peaceful mountain retreat, a luxury beach villa, or a cozy city apartment, ExploreHub helps you discover the perfect stay.

---

# 🎯 Future Enhancements

- ❤️ Wishlist / Favorites
- 💳 Online Booking & Payments
- 📅 Availability Calendar
- 🔍 Advanced Search & Filters
- 💬 Real-time Chat
- 🔔 Notifications
- 📱 Progressive Web App (PWA)
- 🌐 Multi-language Support
- 🤖 AI-powered travel recommendations
- 📈 Host Dashboard & Analytics

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Sachin Kumar**

MERN Stack Developer

---

## ⭐ Support

If you like this project, don't forget to give it a **⭐ Star** on GitHub!

Happy Coding! 🚀