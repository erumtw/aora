import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PLATFORM,
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_USERS_COLLECTION_ID,
  APPWRITE_VIDEOS_COLLECTION_ID,
  APPWRITE_STORAGE_ID,
} from "@env";

// // Init your react-native SDK
const client = new Client();

client
  .setEndpoint(APPWRITE_ENDPOINT) // Your Appwrite Endpoint
  .setProject(APPWRITE_PROJECT_ID) // Your project ID
  .setPlatform(APPWRITE_PLATFORM); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_USERS_COLLECTION_ID,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avartar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_USERS_COLLECTION_ID,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_VIDEOS_COLLECTION_ID,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    throw Error(error);
  }
};

export const getLastestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_VIDEOS_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw Error(error);
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_VIDEOS_COLLECTION_ID,
      [Query.search("title", query)]
    );

    return posts.documents;
  } catch (error) {
    throw Error(error);
  }
};

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_VIDEOS_COLLECTION_ID,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    throw Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw Error(error);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(APPWRITE_STORAGE_ID, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        APPWRITE_STORAGE_ID,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw Error("invalid file type");
    }

    if (!fileUrl) {
      throw Error(error);
    }

    return fileUrl;
  } catch (error) {
    throw Error(error);
  }
};
export const uploadFile = async (file, type) => {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadFile = await storage.createFile(
      APPWRITE_STORAGE_ID,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw Error(error);
  }
};

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnailUrl, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_USERS_COLLECTION_ID,
      ID.unique(),
      {
        title: form.title,
        video: videoUrl,
        prompt: form.prompt,
        thumbnail: thumbnailUrl,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw Error(error);
  }
};
