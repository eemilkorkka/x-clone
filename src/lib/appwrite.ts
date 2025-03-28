import { Client, Storage } from 'appwrite';

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID!); 

const storage = new Storage(client);

export { client, storage };