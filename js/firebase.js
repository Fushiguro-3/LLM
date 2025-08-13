import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyA1aq38GDBVNmv2jj083Nt9R-G1jD5GyG8",
  authDomain: "sdmcet-lms-project.firebaseapp.com",
  projectId: "sdmcet-lms-project",
  storageBucket: "sdmcet-lms-project.firebasestorage.app",
  messagingSenderId: "1066985843411",
  appId: "1:1066985843411:web:88af8e11119288eb14c226"
};

// ✅ Export this so you can import it in signup.html
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
