# Docker Setup for GST Invoices

This project includes Docker Compose configuration for PostgreSQL and pgAdmin.

## Services

### PostgreSQL
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Database**: gst_invoices
- **Username**: gst_user
- **Password**: gst_password

### pgAdmin
- **Image**: dpage/pgadmin4:latest
- **Port**: 5050
- **Email**: admin@gst-invoices.com
- **Password**: admin123

## Usage

1. **Start services**:
   ```bash
   docker-compose up -d
   ```

2. **Stop services**:
   ```bash
   docker-compose down
   ```

3. **View logs**:
   ```bash
   docker-compose logs -f
   ```

4. **Access pgAdmin**:
   - Open http://localhost:5050
   - Login with admin@gst-invoices.com / admin123
   - Add server with:
     - Host: postgres (or localhost)
     - Port: 5432
     - Username: gst_user
     - Password: gst_password

## Database Connection

For your Next.js application, use this connection string:
```
postgresql://gst_user:gst_password@localhost:5432/gst_invoices
```

## Environment Variables

Copy `.env.example` to `.env` and update the values as needed.

## Data Persistence

- PostgreSQL data is persisted in the `postgres_data` volume
- pgAdmin data is persisted in the `pgadmin_data` volume
- Data will persist between container restarts
