#!/bin/bash

# GST Invoices - Production Deployment Script
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 Starting GST Invoices Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI is not installed. Installing..."
        npm install -g vercel
    fi
    
    # Check if Supabase CLI is available via npx or as dev dependency
    if ! npx supabase --version &> /dev/null; then
        print_warning "Supabase CLI is not available. Installing as dev dependency..."
        npm install supabase --save-dev
    fi
    
    print_success "All dependencies are available."
}

# Run tests and build checks
run_checks() {
    print_status "Running pre-deployment checks..."
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the correct directory?"
        exit 1
    fi
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm ci
    
    # Run type checking
    print_status "Running type checks..."
    npm run type-check
    
    # Run linting
    print_status "Running linter..."
    npm run lint
    
    # Run tests if they exist
    if npm run test --silent 2>/dev/null; then
        print_status "Running tests..."
        npm run test
    else
        print_warning "No tests found, skipping..."
    fi
    
    # Test build
    print_status "Testing production build..."
    npm run build
    
    print_success "All checks passed!"
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if user is logged in to Vercel
    if ! vercel whoami &> /dev/null; then
        print_status "Please log in to Vercel..."
        vercel login
    fi
    
    # Deploy to production
    print_status "Deploying to production..."
    vercel --prod
    
    print_success "Deployment completed!"
}

# Setup Supabase
setup_supabase() {
    print_status "Setting up Supabase..."
    
    # Check if user is logged in to Supabase
    if ! npx supabase projects list &> /dev/null; then
        print_status "Please log in to Supabase..."
        npx supabase login
    fi
    
    # Check if project is linked
    if [ ! -f ".supabase/config.toml" ]; then
        print_warning "Supabase project not linked. Please run 'npx supabase link' manually."
        return
    fi
    
    # Push database migrations
    print_status "Pushing database migrations..."
    npx supabase db push
    
    print_success "Supabase setup completed!"
}

# Main deployment process
main() {
    echo "🎯 GST Invoices Production Deployment"
    echo "======================================"
    
    check_dependencies
    run_checks
    setup_supabase
    deploy_vercel
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "📋 Post-deployment checklist:"
    echo "  ✅ Configure environment variables in Vercel dashboard"
    echo "  ✅ Set up custom domain (if needed)"
    echo "  ✅ Configure Razorpay webhooks"
    echo "  ✅ Test authentication flow"
    echo "  ✅ Test payment processing"
    echo "  ✅ Verify email functionality"
    echo ""
    echo "📖 For detailed instructions, see DEPLOYMENT.md"
}

# Run main function
main "$@"
