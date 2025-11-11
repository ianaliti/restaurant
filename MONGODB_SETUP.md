# MongoDB Setup Guide

## Step 1: Create Free MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account (no credit card needed)
3. Create a free cluster (M0 - Free tier)

## Step 2: Get Your Connection String

1. In MongoDB Atlas, click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `resto-digital`

## Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/resto-digital?retryWrites=true&w=majority"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-string-here"
```

To generate NEXTAUTH_SECRET, run:
```bash
openssl rand -base64 32
```

## Step 4: Generate Prisma Client

```bash
npx prisma generate
```

## Step 5: Push Schema to Database

```bash
npx prisma db push
```

This will create all tables in your MongoDB database.

## Step 6: (Optional) Create First Admin User

You can use Prisma Studio to manually create an admin user:
```bash
npx prisma studio
```

Or create a seed script (we can add this later).

## Your Database is Ready! 🎉

Now you can:
- Use `prisma.user.findMany()` to query users
- Use `prisma.restaurant.create()` to create restaurants
- Everything is typed and ready to go!



