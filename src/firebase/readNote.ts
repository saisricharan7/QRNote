import {doc, getDoc} from "firebase/firestore";
import { db } from "./config";

export const getNoteById = async (noteId:string) => {
    const docRef = doc(db, "notes", noteId);
    const docSnap =  await getDoc(docRef);

    if(!docSnap.exists()) {
        throw new Error("Note not found");
    }

    return docSnap.data();
}