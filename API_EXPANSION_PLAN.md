# API Expansion Plan for Babita's Kitchen

## 1. Current API Status

The app already has these endpoints:
- **GET /api/products** - List products (with filters)
- **GET /api/products/:id** - Get single product
- **GET /api/categories** - List categories
- **GET /api/orders** - List user orders (authenticated)
- **GET /api/orders/:id** - Get single order (authenticated)
- **POST /api/orders** - Create order (authenticated)
- **GET /api/addresses** - List user addresses (authenticated)
- **POST /api/addresses** - Create address (authenticated)

## 2. New Features to Add

### A. Reviews & Ratings System
- `POST /api/products/:id/reviews` - Add review to product
- `GET /api/products/:id/reviews` - Get product reviews
- `DELETE /api/reviews/:id` - Delete own review

### B. Wishlist/Favorites
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add product to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

### C. User Profile Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile/image` - Upload profile image

### D. Time Slots & Delivery
- `GET /api/time-slots` - Get available delivery time slots

## 3. External Access (Mobile App)

### Option A: ngrok (Quick)
- Install ngrok and run: `ngrok http 5000`
- Provides https URL for mobile app

### Option B: Deployment (Recommended for Production)
- Deploy to Vercel/Render/Railway
- Gets permanent URL

## 4. Files to Modify

1. `shared/routes.ts` - Add new route definitions
2. `shared/schema.ts` - Add reviews and wishlist tables
3. `server/storage.ts` - Add storage methods
4. `server/routes.ts` - Register new endpoints

## 5. Next Steps
- Confirm which features to implement
- Start implementation

