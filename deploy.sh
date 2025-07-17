#!/bin/bash

# ListBud Production Deployment Script
# This script handles the deployment of ListBud to production

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="listbud"
DEPLOYMENT_ENV=${1:-production}
GITHUB_REPO="your-username/listbud"  # Update with your repo

echo -e "${BLUE}🚀 Starting ListBud ${DEPLOYMENT_ENV} deployment...${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required environment variables are set
check_env_vars() {
    print_info "Checking environment variables..."

    required_vars=("DATABASE_URL" "JWT_SECRET" "CORS_ORIGIN")
    missing_vars=()

    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done

    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        exit 1
    fi

    print_status "All required environment variables are set"
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."

    # Server dependencies
    cd server
    npm ci --only=production
    print_status "Server dependencies installed"

    # Client dependencies
    cd ../client
    npm ci --only=production
    print_status "Client dependencies installed"

    cd ..
}

# Build the application
build_application() {
    print_info "Building application..."

    # Build server
    cd server
    npm run build
    print_status "Server built successfully"

    # Build client
    cd ../client
    npm run build
    print_status "Client built successfully"

    cd ..
}

# Run database migrations
run_migrations() {
    print_info "Running database migrations..."

    cd server
    npm run migrate:prod
    print_status "Database migrations completed"

    cd ..
}

# Deploy to Railway
deploy_to_railway() {
    print_info "Deploying to Railway..."

    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        print_error "Railway CLI is not installed. Please install it first:"
        echo "npm install -g @railway/cli"
        exit 1
    fi

    # Deploy server
    cd server
    railway up
    print_status "Server deployed to Railway"

    cd ..
}

# Deploy to Vercel
deploy_to_vercel() {
    print_info "Deploying frontend to Vercel..."

    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed. Please install it first:"
        echo "npm install -g vercel"
        exit 1
    fi

    # Deploy client
    cd client
    vercel --prod
    print_status "Frontend deployed to Vercel"

    cd ..
}

# Health check
health_check() {
    print_info "Performing health check..."

    # Wait for deployment to be ready
    sleep 30

    # Check server health
    if [ -n "$SERVER_URL" ]; then
        if curl -f "$SERVER_URL/health" > /dev/null 2>&1; then
            print_status "Server health check passed"
        else
            print_error "Server health check failed"
            exit 1
        fi
    fi

    # Check client
    if [ -n "$CLIENT_URL" ]; then
        if curl -f "$CLIENT_URL" > /dev/null 2>&1; then
            print_status "Client health check passed"
        else
            print_error "Client health check failed"
            exit 1
        fi
    fi
}

# Main deployment flow
main() {
    echo -e "${BLUE}📋 Deployment Configuration:${NC}"
    echo "  Environment: $DEPLOYMENT_ENV"
    echo "  Project: $PROJECT_NAME"
    echo "  Date: $(date)"
    echo ""

    # Check prerequisites
    check_env_vars

    # Install dependencies
    install_dependencies

    # Build application
    build_application

    # Run migrations
    run_migrations

    # Deploy based on environment
    case $DEPLOYMENT_ENV in
        production)
            deploy_to_railway
            deploy_to_vercel
            ;;
        staging)
            deploy_to_railway
            deploy_to_vercel
            ;;
        *)
            print_error "Unknown deployment environment: $DEPLOYMENT_ENV"
            exit 1
            ;;
    esac

    # Health check
    health_check

    print_status "Deployment completed successfully! 🎉"
    echo ""
    echo -e "${GREEN}🌐 Your application is now live:${NC}"
    [ -n "$CLIENT_URL" ] && echo "  Frontend: $CLIENT_URL"
    [ -n "$SERVER_URL" ] && echo "  API: $SERVER_URL"
    echo ""
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo "  1. Test the application thoroughly"
    echo "  2. Monitor logs for any issues"
    echo "  3. Set up monitoring and alerting"
    echo "  4. Update DNS records if needed"
}

# Run the deployment
main "$@"
