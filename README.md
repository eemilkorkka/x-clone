
# X-clone

A fully responsive full-stack clone of X (formerly known as Twitter) built using technologies like Next.js, tailwindcss, Radix UI, MySQL, Appwrite Storage for storing videos & images and NextAuth for authentication. 

I decided to build this project to learn about more about Next.js and full-stack web development. 


## Screenshots 📸

![Login / Signup page](https://github.com/eemilkorkka/x-clone/blob/main/public/Screenshot%202025-07-30%20205529.png)
![Home page](https://github.com/eemilkorkka/x-clone/blob/main/public/Screenshot%202025-07-30%20205312.png)
![Profile page](https://github.com/eemilkorkka/x-clone/blob/main/public/Screenshot%202025-07-30%20205345.png)


## Features 🖌️

- The ability to make posts, which can include photos and/or videos.
- The ability to like, retweet, bookmark and reply to posts.
- The ability to delete posts.
- The ability to follow and unfollow others.
- The ability to edit your profile and change your username.
- Authentication with Auth.js. Supported authentication methods are credentials and Google Account.

Features such as being able to pin tweets, darkmode/lightmode toggle and seeing the list of people who follow you haven't been implemented yet, but are planned 🚧




## Installation locally 💻

You may install the apllication locally by cloning the repository:

```bash
git clone https://github.com/eemilkorkka/x-clone.git
   ```

Install the required dependencies:

```bash
npm i
   ```

Set up a .env file; see .env.example for more information.

Make sure you have MySQL installed and generate the database from the Prisma Schema by typing this into the terminal: 

```bash
npx prisma migrate dev
   ```

Finally, run the app:

```bash
npm run dev
   ```

You should then be able to access the website at http://localhost:3000
## Contributing

Contributions are always welcome!

Have an idea of how to improve something? Or a new feature that you'd like to be implemented? Open a pull request with your changes.

