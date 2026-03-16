# X-Clone

A fully responsive full-stack clone of X (formerly known as Twitter) built using technologies like Next.js 16, tailwindcss, Shadcn UI, PostgreSQL, Appwrite Storage for storing videos & images and BetterAuth for authentication. 

## Screenshots 📸

| Login / Signup | Home Page | Profile Page |
|---------------|------------|--------------|
| ![Login / Signup page](./screenshots/Screenshot%202026-03-14%20152609.png) | ![Home page](./screenshots/Screenshot%202026-03-14%20174400.png) | ![Profile page](./screenshots/Screenshot%202026-03-14%20174537.png) |

## Features 🖌️

- The ability to make posts, which can include photos and/or videos.
- The ability to like, retweet, bookmark and reply to posts.
- Theme switching
- The ability to follow and unfollow others.
- The ability to edit your profile and change your username.

## Installation locally 💻

You may install the application locally by cloning the repository:

```bash
git clone https://github.com/eemilkorkka/x-clone.git
   ```

Install the required dependencies:

```bash
pnpm i
   ```

Set up a .env file; see .env.example for more information.

Set up a PostgreSQL database in Supabase or run one locally and generate the database from the Prisma Schema by typing this into the terminal: 

```bash
pnpx prisma migrate dev
   ```

Finally, run the app:

```bash
pnpm run dev
   ```

You should then be able to access the website at http://localhost:3000
## Contributing

Contributions are always welcome!

Open a pull request with your changes/improvements.

