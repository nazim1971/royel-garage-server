# Royal Garage API

## Live Link
- [Royal Garage Live API](https://royelgarage.vercel.app)

## Features
- **Bike Management**: CRUD operations for managing bikes (create, read, update, delete).
- **Order Management**: CRUD operations for managing orders, including total revenue tracking.
- **Error Handling**: Global error handling for validation errors, missing data, and insufficient stock.
- **API Documentation**: Easy-to-follow API structure and response format.

## API Routes

### Bike Routes
- `POST /api/products`: Create a new bike.
- `GET /api/products`: Get all bikes.
- `GET /api/products/:bikeId`: Get a single bike by ID.
- `PUT /api/products/:bikeId`: Update a single bike by ID.
- `DELETE /api/products/:bikeId`: Delete a single bike by ID.

### Order Routes
- `POST /api/orders`: Create a new order.
- `GET /api/orders`: Get all orders.
- `GET /api/orders/revenue`: Get total revenue from all orders.

## Setup Instructions (Local Development)

### Step 1: Clone the Repository
```bash
git clone https://github.com/nazim1971/Royel-Garage.git
```

### Step 2: Create `.env` File
At the root of your project, create a `.env` file with the following variables:
```
PORT=5000  # Your desired port number (optional, default is 5000)
DATABASE_URI=your_mongo_db_connection_uri  # MongoDB Atlas URI
```

### Step 3: Install Dependencies
Navigate to your project directory and install the necessary dependencies:
```bash
cd your-project-folder
npm install
```

### Step 4: Run the Application
Start your server:
```bash
npm start
```
This will start the application locally, typically on [http://localhost:5000](http://localhost:5000).

### Step 5: Test the API
You can test the API using Postman or any other API testing software. Here’s how you can use Postman to test the API:

1. **Create Bike**:
   - Method: `POST`
   - URL: `http://localhost:5000/api/products`
   - Body: Raw JSON (example):
     ```json
     {
       "name": "Mountain Bike",
       "brand": "Royal",
       "price": 500,
       "category": "Mountain",
       "description": "A high-performance mountain bike",
       "quantity": 10,
       "isStock": true
     }
     ```

2. **Get All Bikes**:
   - Method: `GET`
   - URL: `http://localhost:5000/api/products`

3. **Get Single Bike**:
   - Method: `GET`
   - URL: `http://localhost:5000/api/products/:bikeId`

4. **Update Bike**:
   - Method: `PUT`
   - URL: `http://localhost:5000/api/products/:bikeId`
   - Body: Raw JSON

5. **Delete Bike**:
   - Method: `DELETE`
   - URL: `http://localhost:5000/api/products/:bikeId`

6. **Create Order**:
   - Method: `POST`
   - URL: `http://localhost:5000/api/orders`
   - Body: Raw JSON (example):
     ```json
     {
       "bikeId": "bike_id_here",
       "quantity": 2,
       "totalPrice": 1000
     }
     ```

7. **Get All Orders**:
   - Method: `GET`
   - URL: `http://localhost:5000/api/orders`

8. **Get Revenue**:
   - Method: `GET`
   - URL: `http://localhost:5000/api/orders/revenue`

## Error Handling
The application handles errors in the following scenarios:
- **404 Not Found**: If a resource (bike/order) is not found, a `404 Not Found` response is returned with a clear message.
- **400 Bad Request**: If any required field is missing or invalid (such as incorrect data types or insufficient stock), the request will return a `400 Bad Request` with specific error messages.

## For any help, contact: 
- Email: [nazimmuddin10@gmail.com](mailto:nazimmuddin10@gmail.com)

## Author
- **MD. Nazim Uddin**
