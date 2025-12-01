# Render Deployment Guide

## Prerequisites
1. Create a [Render account](https://render.com)
2. Have your MongoDB Atlas connection string ready
3. Have your Gmail App Password ready (for email functionality)

## Deployment Steps

### Option 1: Deploy using Blueprint (Recommended)

1. **Fork/Push your repository to GitHub** ✅ (Already done)

2. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New" → "Blueprint"

3. **Connect your GitHub repository**
   - Select `One-Calender` repository
   - Render will automatically detect the `render.yaml` file

4. **Configure Environment Variables**
   
   You'll need to set these environment variables for the **backend service**:
   
   - `MONGO_URI`: Your MongoDB connection string
     ```
     mongodb+srv://username:password@cluster.mongodb.net/digital-calendar
     ```
   
   - `SMTP_USER`: Your Gmail address
     ```
     your-email@gmail.com
     ```
   
   - `SMTP_PASS`: Your Gmail App Password
     ```
     xxxx xxxx xxxx xxxx
     ```

5. **Deploy**
   - Click "Apply" to deploy both services
   - Wait for deployment to complete (5-10 minutes)

### Option 2: Manual Deployment

#### Deploy Backend:
1. Go to Render Dashboard → "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `one-calendar-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

4. Add Environment Variables (see list above)

#### Deploy Frontend:
1. Go to Render Dashboard → "New" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `one-calendar-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Instance Type**: Free

4. Add Environment Variable:
   - `VITE_API_URL`: Your backend URL (e.g., `https://one-calendar-backend.onrender.com/api`)

## MongoDB Setup

If you don't have MongoDB Atlas:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for Render
5. Get your connection string and add it to `MONGO_URI`

## Gmail App Password Setup

1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Go to "App passwords"
4. Generate a new app password for "Mail"
5. Use this password in `SMTP_PASS`

## After Deployment

1. **Backend URL**: `https://one-calendar-backend.onrender.com`
2. **Frontend URL**: `https://one-calendar-frontend.onrender.com`

### Test Your Deployment:
- Visit the frontend URL
- Sign up with a new account
- Verify OTP email is received
- Create an event with a reminder
- Check if reminder email is sent

## Important Notes

⚠️ **Free Tier Limitations**:
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 50+ seconds
- Limited to 750 hours/month per service

💡 **Tips**:
- Backend and frontend will have separate URLs
- Update CORS settings if needed
- Check Render logs if issues occur

## Troubleshooting

- **500 Error**: Check backend logs for MongoDB connection
- **CORS Error**: Verify API URL in frontend environment variables
- **Emails not sending**: Verify Gmail App Password is correct
- **Slow first load**: Free tier services spin down when inactive

## Custom Domain (Optional)

1. Go to your service settings
2. Click "Custom Domain"
3. Add your domain and follow DNS instructions
