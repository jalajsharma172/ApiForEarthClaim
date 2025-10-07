# Token API

A REST API built with Node.js and Express that accepts token data (recipient, tokenURI, tokenId) and stores it in a Supabase database.

## Features

- ✅ RESTful API with Express.js
- ✅ Supabase database integration
- ✅ Input validation with express-validator
- ✅ CORS support
- ✅ Environment configuration
- ✅ Error handling
- ✅ Request logging

## Project Structure

```
.
├── config/
│   └── supabase.js          # Supabase client configuration
├── database/
│   └── schema.sql           # Database schema definition
├── middleware/
│   └── validation.js        # Request validation middleware
├── routes/
│   └── tokenRoutes.js       # API route definitions
├── services/
│   └── tokenService.js      # Database operations
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies
├── server.js               # Main server file
└── README.md               # This file
```

## Setup Instructions

### 1. Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

### 2. Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

### 3. Environment Configuration

1. Copy the environment template:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` file with your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=3000
   NODE_ENV=development
   ```

### 4. Database Setup

1. In your Supabase dashboard, go to the SQL Editor
2. Run the SQL commands from `database/schema.sql` to create the required table:
   ```sql
   CREATE TABLE IF NOT EXISTS tokens (
       id SERIAL PRIMARY KEY,
       recipient VARCHAR(255) NOT NULL,
       token_uri TEXT NOT NULL,
       token_id VARCHAR(255) NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );
   ```

### 5. Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### 1. Health Check
- **GET** `/`
- **Description**: Check if the API is running
- **Response**:
  ```json
  {
    "success": true,
    "message": "Token API is running",
    "timestamp": "2025-10-07T10:30:00.000Z",
    "endpoints": {
      "POST /api/tokens": "Create a new token record",
      "GET /api/tokens": "Get all token records",
      "GET /api/tokens/:id": "Get a specific token record"
    }
  }
  ```

### 2. Create Token Record
- **POST** `/api/tokens`
- **Description**: Store new token data in the database
- **Request Body**:
  ```json
  {
    "recipient": "0x1234567890abcdef1234567890abcdef12345678",
    "tokenURI": "https://example.com/token/metadata.json",
    "tokenId": "12345"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "success": true,
    "message": "Token data inserted successfully",
    "data": {
      "id": 1,
      "recipient": "0x1234567890abcdef1234567890abcdef12345678",
      "token_uri": "https://example.com/token/metadata.json",
      "token_id": "12345",
      "created_at": "2025-10-07T10:30:00.000Z",
      "updated_at": "2025-10-07T10:30:00.000Z"
    }
  }
  ```
- **Error Response** (400):
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": [
      {
        "msg": "Recipient is required",
        "param": "recipient",
        "location": "body"
      }
    ]
  }
  ```

### 3. Get All Tokens
- **GET** `/api/tokens`
- **Description**: Retrieve all token records
- **Response**:
  ```json
  {
    "success": true,
    "message": "Tokens retrieved successfully",
    "data": [
      {
        "id": 1,
        "recipient": "0x1234567890abcdef1234567890abcdef12345678",
        "token_uri": "https://example.com/token/metadata.json",
        "token_id": "12345",
        "created_at": "2025-10-07T10:30:00.000Z",
        "updated_at": "2025-10-07T10:30:00.000Z"
      }
    ],
    "count": 1
  }
  ```

### 4. Get Token by ID
- **GET** `/api/tokens/:id`
- **Description**: Retrieve a specific token record
- **Response**:
  ```json
  {
    "success": true,
    "message": "Token retrieved successfully",
    "data": {
      "id": 1,
      "recipient": "0x1234567890abcdef1234567890abcdef12345678",
      "token_uri": "https://example.com/token/metadata.json",
      "token_id": "12345",
      "created_at": "2025-10-07T10:30:00.000Z",
      "updated_at": "2025-10-07T10:30:00.000Z"
    }
  }
  ```

## Request Validation

All POST requests are validated:

- **recipient**: Required, string (1-255 characters)
- **tokenURI**: Required, valid URL with http/https protocol
- **tokenId**: Required, string (1-255 characters)

## Testing with cURL

### Create a token record:
```bash
curl -X POST http://localhost:3000/api/tokens \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "0x1234567890abcdef1234567890abcdef12345678",
    "tokenURI": "https://example.com/token/metadata.json",
    "tokenId": "12345"
  }'
```

### Get all tokens:
```bash
curl http://localhost:3000/api/tokens
```

### Get specific token:
```bash
curl http://localhost:3000/api/tokens/1
```

## Error Handling

The API includes comprehensive error handling:

- **400**: Bad Request (validation errors)
- **404**: Not Found (invalid routes or missing records)
- **500**: Internal Server Error (database/server errors)

All errors return JSON with this structure:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Security Considerations

- Input validation prevents malicious data
- CORS is enabled for cross-origin requests
- Environment variables protect sensitive credentials
- Request size limits prevent oversized payloads

## Development

### Available Scripts

- `npm start`: Run in production mode
- `npm run dev`: Run in development mode with auto-reload
- `npm test`: Run tests (placeholder)

### Dependencies

- **express**: Web framework
- **@supabase/supabase-js**: Supabase client
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **express-validator**: Request validation
- **nodemon**: Development auto-reload (dev dependency)

## Deployment

1. Set environment variables on your hosting platform
2. Ensure your Supabase database is accessible
3. Run `npm start` to start the production server

## Support

If you encounter any issues:

1. Check that all environment variables are set correctly
2. Verify your Supabase credentials and table exists
3. Check the server logs for detailed error messages
4. Ensure all dependencies are installed with `npm install`