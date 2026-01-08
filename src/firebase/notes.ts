import {addDoc, collection, Timestamp} from "firebase/firestore";
import { db } from "./config";
import {auth} from "./config";

type CreateNotePayload = {
    text:string;
    imageUrls?:string[];
    expiryhours:number;
};

export const createNote = async ({
    text,
    imageUrls,
    expiryhours,
}:CreateNotePayload) => {
    if(!auth.currentUser) {
        throw new Error("User not authenticated");
    }

    const now = Timestamp.now();
    const expiresAt = Timestamp.fromDate(
        new Date(Date.now() + expiryhours * 60 * 60 * 1000)
    );

    const docRef = await addDoc(collection(db, "notes"), {
        text,
        imageUrls: imageUrls || null,
        createdAt: now,
        expiresAt,
        uid: auth.currentUser.uid,
    });

    return docRef.id;
}
