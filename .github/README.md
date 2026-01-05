# Frontend CI/CD Setup Guide

This guide explains how to set up and use the CI/CD pipeline for the Styler frontend.

## GitHub Actions Workflows

### 1. CI Workflow (`ci.yml`)
- **Triggers:** Push/PR to `main` or `develop` branches
- **Purpose:** Lint code and verify builds
- **Steps:**
  - Install dependencies
  - Run ESLint
  - Build production bundle

### 2. Deploy Workflow (`deploy.yml`)
- **Triggers:** Push to `main` branch, or manual dispatch
- **Purpose:** Deploy to AWS S3 + CloudFront
- **Steps:**
  - Build production bundle
  - Upload to S3
  - Invalidate CloudFront cache

## Required GitHub Secrets

Add these secrets in **Settings → Secrets and variables → Actions**:

### AWS Credentials
- `AWS_ACCESS_KEY_ID` - IAM user access key
- `AWS_SECRET_ACCESS_KEY` - IAM user secret key
- `AWS_REGION` - AWS region (e.g., `ap-south-2`)
- `AWS_S3_BUCKET` - S3 bucket name (e.g., `styler-frontend-prod`)
- `AWS_CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution ID

### Environment Variables
- `VITE_API_URL` - Backend API URL (e.g., `https://api.styler.com/api/v1`)
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key (optional)

## AWS Infrastructure Setup

### 1. Create S3 Bucket
```bash
aws s3 mb s3://styler-frontend-prod --region ap-south-2
```

Enable static website hosting:
```bash
aws s3 website s3://styler-frontend-prod --index-document index.html --error-document index.html
```

### 2. Create CloudFront Distribution
- Origin: S3 bucket website endpoint
- Default root object: `index.html`
- Custom error response: 404 → /index.html (for SPA routing)
- HTTPS certificate: Request via ACM or use CloudFront default

### 3. Create IAM User for Deployment
Required permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::styler-frontend-prod",
        "arn:aws:s3:::styler-frontend-prod/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "*"
    }
  ]
}
```

## Manual Deployment

To trigger a manual deployment:
1. Go to **Actions** tab
2. Select **Deploy to Production**
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow**

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Verify all dependencies are in `package.json`
- Review build logs for specific errors

### Deployment Fails
- Verify AWS credentials are correct
- Check S3 bucket exists and is accessible
- Ensure IAM user has required permissions

### Site Not Updating
- Check CloudFront invalidation completed
- CloudFront cache may take 5-15 minutes to clear
- Try hard refresh in browser (Ctrl+Shift+R)

## Rollback

To rollback to a previous version:
1. Find the previous successful deployment commit
2. Manually trigger deployment workflow for that commit
3. Or restore previous S3 bucket version if versioning is enabled
