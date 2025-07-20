import { db } from './firebase.js';
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

console.log("✅ view.js loaded!");

const materialsList = document.getElementById('materialsList');

async function loadMaterials() {
  try {
    const querySnapshot = await getDocs(collection(db, "resources"));
    if (querySnapshot.empty) {
      materialsList.innerHTML = "No materials found.";
      return;
    }

    let html = "";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      html += `
        <div class="material-card">
          <strong>${data.courseTitle} - ${data.fileType}</strong><br>
          📄 ${data.fileName}<br>
          <a href="${data.fileUrl}" target="_blank">Download</a>
        </div>
      `;
    });

    materialsList.innerHTML = html;
  } catch (error) {
    console.error("❌ Error loading materials:", error);
    materialsList.innerHTML = "Failed to load materials.";
  }
}

loadMaterials();
