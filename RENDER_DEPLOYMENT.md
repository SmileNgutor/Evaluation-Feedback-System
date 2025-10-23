# Render Deployment Guide

This guide will help you deploy the AUN Evaluation System backend to Render.

## Prerequisites

- A Render account (sign up at https://render.com)
- A Supabase PostgreSQL database (already configured)
- Your GitHub repository pushed with the latest changes

## Step 1: Create a New Web Service on Render

1. Go to https://dashboard.render.com
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository: `SmileNgutor/Evaluation-Feedback-System`
4. Configure the service:
   - **Name**: `aun-evaluation-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `SDP`
   - **Runtime**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn backend.wsgi:application`
   - **Plan**: Free (or your preferred plan)

## Step 2: Configure Environment Variables

Add the following environment variables in Render Dashboard:

### Required Environment Variables

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `PYTHON_VERSION` | `3.13.5` | Python version |
| `DEBUG` | `False` | Disable debug mode in production |
| `SECRET_KEY` | *Generate a secure key* | Django secret key (use Render's auto-generate) |
| `ALLOWED_HOSTS` | `your-app.onrender.com` | Your Render app domain |
| `DB_NAME` | `postgres` | Supabase database name |
| `DB_USER` | `postgres.[YOUR_PROJECT_REF]` | Your Supabase username |
| `DB_PASSWORD` | `your_supabase_password` | Your Supabase database password |
| `DB_HOST` | `aws-0-us-east-1.pooler.supabase.com` | Your Supabase host |
| `DB_PORT` | `5432` | PostgreSQL port |

### Optional but Recommended

| Variable Name | Example Value | Description |
|--------------|---------------|-------------|
| `CORS_ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` | Comma-separated list of allowed frontend URLs |
| `CSRF_TRUSTED_ORIGINS` | `https://your-frontend.vercel.app,https://your-app.onrender.com` | Comma-separated trusted origins |

### Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on "Settings" → "Database"
3. Find "Connection string" and select "URI" mode
4. Copy the connection details:
   - Host: Usually `aws-0-[region].pooler.supabase.com`
   - Database: `postgres`
   - User: `postgres.[project-ref]`
   - Password: Your database password

## Step 3: Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Install dependencies from `requirements.txt`
   - Run the build script (`build.sh`)
   - Collect static files
   - Run database migrations
   - Start the application with Gunicorn

## Step 4: Verify Deployment

Once deployed, your backend will be available at:
```
https://your-app.onrender.com
```

### Test the deployment:

1. **Health Check**: Visit `https://your-app.onrender.com/admin/` - You should see the Django admin login
2. **API Documentation**: Visit `https://your-app.onrender.com/api/schema/swagger-ui/` for Swagger docs

## Step 5: Update Frontend Configuration

Once your backend is deployed, update your frontend's `VITE_API_BASE_URL` environment variable in Vercel:

```
VITE_API_BASE_URL=https://your-app.onrender.com
```

And update the CORS settings in Render to include your Vercel frontend URL.

## Important Notes

### Free Tier Limitations
- Render's free tier spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid tier for production use

### Security Recommendations
1. Generate a strong SECRET_KEY (use Render's auto-generate feature)
2. Never commit `.env` file to git
3. Set `DEBUG=False` in production
4. Update `ALLOWED_HOSTS` with your actual domain
5. Configure proper CORS settings with your frontend URL only

### Database Migrations
The build script automatically runs migrations. If you need to run migrations manually:
1. Go to Render Dashboard → Your Service → Shell
2. Run: `python manage.py migrate`

### Creating a Superuser
To create an admin user:
1. Go to Render Dashboard → Your Service → Shell
2. Run: `python manage.py createsuperuser`
3. Follow the prompts

## Troubleshooting

### Build Fails
- Check the build logs in Render Dashboard
- Verify `build.sh` has execute permissions (should be committed with +x)
- Ensure all requirements are in `requirements.txt`

### Database Connection Errors
- Verify Supabase credentials are correct
- Check that Supabase allows connections from Render's IP ranges
- Ensure `DB_HOST`, `DB_USER`, `DB_PASSWORD` are set correctly

### Static Files Not Loading
- Verify `whitenoise` is installed
- Check that `STATIC_ROOT` is set in settings
- Ensure `collectstatic` runs in build.sh

### CORS Errors
- Add your frontend URL to `CORS_ALLOWED_ORIGINS` environment variable
- Add both frontend and backend URLs to `CSRF_TRUSTED_ORIGINS`

## Updating Your Deployment

Render automatically redeploys when you push to the `main` branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Render will detect the push and start a new deployment.

## Monitoring

- **Logs**: Available in Render Dashboard → Your Service → Logs
- **Metrics**: Available in Render Dashboard → Your Service → Metrics
- **Events**: Track deployments in the Events tab

## Next Steps

1. Deploy your frontend to Vercel
2. Update environment variables with actual domain names
3. Test the full stack integration
4. Set up monitoring and alerts
5. Consider upgrading to paid tier for production

## Support

- Render Documentation: https://render.com/docs
- Django Deployment Checklist: https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/
