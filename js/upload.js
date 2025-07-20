import { db, storage } from './firebase.js';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

console.log("✅ upload.js is loaded!");

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const department = document.getElementById('department').value;
  const semester = document.getElementById('semester').value;
  const subject = document.getElementById('subject').value.trim().toUpperCase();

  const fileType = document.getElementById('fileType').value;
  const file = document.getElementById('file').files[0];

  if (!department || !semester || !subject || !fileType || !file) {
    alert("All fields are required!");
    return;
  }

  try {
    const filePath = `materials/${department}/sem${semester}/${subject}/${file.name}`;
    const fileRef = ref(storage, filePath);
    await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);

    await addDoc(collection(db, "resources"), {
      department,
      semester,
      subject,
      fileType,
      fileName: file.name,
      fileUrl,
      storagePath: filePath,
      uploadedAt: new Date()
    });

    alert("✅ File uploaded!");
    document.getElementById('uploadForm').reset();
    loadUploads(); // refresh list after upload
  } catch (error) {
    console.error("❌ Upload failed:", error);
    alert("Upload failed. Check console.");
  }
});

// ✅ Load uploaded files and show Delete option
async function loadUploads() {
  const uploadsList = document.getElementById('uploadsList');
  uploadsList.innerHTML = "<p>Loading...</p>";

  try {
    const q = query(collection(db, "resources"), orderBy("uploadedAt", "desc"));
    const snapshot = await getDocs(q);
    uploadsList.innerHTML = "";

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const fileId = docSnap.id;

      const item = document.createElement('div');
      item.innerHTML = `
        <p>
          <strong>${data.subject}</strong> [${data.fileType}]<br>
          ${data.fileName} <br>
          <a href="${data.fileUrl}" target="_blank">📄 View</a> |
          <button data-id="${fileId}" data-path="${data.storagePath}">🗑 Delete</button>
        </p>
        <hr>
      `;

      // Attach delete event
      item.querySelector("button").addEventListener('click', async () => {
        if (confirm("Are you sure you want to delete this file?")) {
          try {
            // Delete from Storage
            if (data.storagePath) {
               await deleteObject(ref(storage, data.storagePath));
              }

            // Delete from Firestore
            await deleteDoc(doc(db, "resources", fileId));
            alert("✅ File deleted");
            loadUploads();
          } catch (err) {
            console.error("❌ Delete failed:", err);
            alert("Error deleting file.");
          }
        }
      });

      uploadsList.appendChild(item);
    });

    if (snapshot.empty) {
      uploadsList.innerHTML = "<p>No uploads found.</p>";
    }

  } catch (error) {
    console.error("❌ Error loading uploads:", error);
    uploadsList.innerHTML = "<p>Error loading uploads.</p>";
  }
}

// 🚀 Load on page load
loadUploads();
