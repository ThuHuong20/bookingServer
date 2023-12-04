import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// thay config thành config của bạn
const firebaseConfig = {
    apiKey: "AIzaSyDGTcKKpzrp3DaGBW1_d_D1yo8hK9-JlIc",
    authDomain: "bookingsalon-7691b.firebaseapp.com",
    projectId: "bookingsalon-7691b",
    storageBucket: "bookingsalon-7691b.appspot.com",
    messagingSenderId: "712981041032",
    appId: "1:712981041032:web:379a1018c425afb266743d",
    measurementId: "G-P8FN8RZS82"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFileToStorage(file: any, folderName: any, bufferData: any = undefined) {
    // nếu file là null thì không làm gì hết
    if (!file) {
        return false
    }

    let fileRef;
    let metadata;
    if (!bufferData) {
        // tên file trên file base
        fileRef = ref(storage, `${folderName}/` + file.originalname);
    } else {
        // tên file trên file base
        fileRef = ref(storage, `${folderName}/` + file.originalname);
        metadata = {
            contentType: (file as any).mimetype,
        };
    }
    let url;
    if (bufferData) {
        // upload file lên fire storage
        url = await uploadBytes(fileRef, bufferData, metadata).then(async res => {
            // khi up thành công thì tìm URL
            return await getDownloadURL(res.ref)
                .then(url => url)
                .catch(er => false)
        })
    } else {
        // upload file lên fire storage
        url = await uploadBytes(fileRef, file).then(async res => {
            // khi up thành công thì tìm URL
            return await getDownloadURL(res.ref)
                .then(url => url)
                .catch(er => false)
        })
    }


    return url
}