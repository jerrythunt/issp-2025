import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, firestore } from "../firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const uploadMP3 = (
  file: File,
  genre: string,
  onProgress?: (p: number) => void
) => {
  return new Promise(async (resolve, reject) => {
    try {
        if (!file) return reject("No file provided");
        if (!file.name.endsWith(".mp3")) return reject("Only MP3 files allowed");
        if (!genre) return reject("Please select a genre");

        const id = uuidv4();
        const filePath = `songs/${id}_${file.name}`;
        const fileRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
            const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            if (onProgress) onProgress(progress);
            },

            (error) => reject(error),
            async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const docRef = doc(firestore, "songs", id);

            // Store metadata
            await setDoc(docRef, {
                id: id,
                name: file.name,
                url: downloadURL,
                path: filePath,
                size: file.size,
                genre,
                uploadedAt: serverTimestamp(),
            });

            resolve({ id, url: downloadURL });
            }
        );
        } catch (err) {
        reject(err);
        }
    });
};
