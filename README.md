# Project Setup Guide (macOS)

Follow these steps to get the project running locally with PostgreSQL and an Express server.

---

## 1) Clone the Repository

**HTTPS**

```bash
git clone https://github.com/akuttetira/NaehasMockAPI/
cd NaehasMockAPI
```


---

## 2) Install Dependencies

```bash
npm install
```

---

## 3) Install PostgreSQL (macOS)

Choose one of the following methods.

### Option A — Homebrew (recommended)

```bash
# If you don’t have Homebrew: https://brew.sh
brew update
brew install postgresql@16

# Add psql to your PATH (Apple Silicon default path)
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile

# Start the PostgreSQL background service
brew services start postgresql@16
```

### Option B — Official PostgreSQL Installer (EnterpriseDB)

1. Download and install from [https://www.postgresql.org/download/macosx/](https://www.postgresql.org/download/macosx/).
2. After installing, add `psql` to your PATH (adjust version if different):

   ```bash
   echo 'export PATH="/Library/PostgreSQL/16/bin:$PATH"' >> ~/.zprofile
   source ~/.zprofile
   ```

Verify installation:

```bash
psql --version
```

---

## 4) Create Database and User

Use either the `psql` shell or one-shot commands.

### Option A — Using psql

```bash
# Connect as the default postgres superuser
psql -U postgres
```

Then run the following inside the psql prompt:

```sql
-- Create an application user (change the password if you wish)
CREATE ROLE api_user WITH LOGIN PASSWORD 'Naehas';
-- Create the application database and set ownership to the app user
CREATE DATABASE productdirectory OWNER api_user;
-- (Optional) Grant privileges explicitly
GRANT ALL PRIVILEGES ON DATABASE productdirectory TO api_user;
```

Exit psql with `\q`.

### Option B — One-liners

```bash
# Create role
psql -U postgres -c "CREATE ROLE api_user WITH LOGIN PASSWORD 'Naehas';"
# Create database owned by api_user
psql -U postgres -c "CREATE DATABASE productdirectory OWNER api_user;"
```

---

## 5) Create `.env` File

Create a `.env` file in the project root with the following contents (adjust values if needed):

```dotenv
PGPORT=5432
PGUSER='api_user'
PGHOST='localhost'
PGDATABASE='productdirectory'
PGPASSWORD='Naehas'
PORT=3000
```

---

## 6) Run Migrations

```bash
npm run migrate up
```

> This should create the necessary tables/schemas in the `productdirectory` database.

---

## 7) Start the App (Development)

```bash
npm run dev
```

The server will start (commonly at `http://localhost:3000` unless configured otherwise).

---

## 8) Testing

Test endpoints using curl or postman.  They should all be available on your local machine and on devices on your local network.  

* If you prefer a different Postgres version, update paths and service names accordingly.
* Replace the sample password `'Naehas'` with your own secret in real environments.
