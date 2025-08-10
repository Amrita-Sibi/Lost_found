// Simple hardcoded login credentials
const validUsername = "admin";
const validPassword = "password123";

const loginSection = document.getElementById("loginSection");
const lostFoundApp = document.getElementById("lostFoundApp");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");

// On page load, check if logged in
document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("loggedIn") === "true") {
    showApp();
    loadPosts();
  } else {
    showLogin();
  }
});

loginForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === validUsername && password === validPassword) {
    sessionStorage.setItem("loggedIn", "true");
    showApp();
    loadPosts();
    loginError.style.display = "none";
    loginForm.reset();
  } else {
    loginError.style.display = "block";
  }
});

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("loggedIn");
  showLogin();
});

function showLogin() {
  loginSection.style.display = "block";
  lostFoundApp.style.display = "none";
}

function showApp() {
  loginSection.style.display = "none";
  lostFoundApp.style.display = "block";
}

// Lost & Found app logic:

document.getElementById("lostForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let name = document.getElementById("name").value;
  let dept = document.getElementById("department").value;
  let details = document.getElementById("details").value;
  let photoFile = document.getElementById("photo").files[0];
  let photoURL = "";

  if (photoFile) {
    let reader = new FileReader();
    reader.onload = function(event) {
      photoURL = event.target.result;
      savePost(name, dept, details, photoURL);
    };
    reader.readAsDataURL(photoFile);
  } else {
    savePost(name, dept, details, "");
  }

  this.reset();
});

function savePost(name, dept, details, photoURL) {
  let posts = JSON.parse(localStorage.getItem("lostPosts")) || [];
  posts.push({ name, dept, details, photoURL, replies: [] });
  localStorage.setItem("lostPosts", JSON.stringify(posts));
  loadPosts();
}

function loadPosts() {
  let postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = "";
  let posts = JSON.parse(localStorage.getItem("lostPosts")) || [];

  posts.forEach((post, index) => {
    let postDiv = document.createElement("div");
    postDiv.classList.add("post");

    postDiv.innerHTML = `
      <h3>${post.name} (${post.dept})</h3>
      <p>${post.details}</p>
      ${post.photoURL ? `<img src="${post.photoURL}" alt="Lost item photo">` : ""}
      <h4>Replies:</h4>
      <div id="replies-${index}">
        ${post.replies.map(r => `<div class="reply"><b>${r.finder}</b>: ${r.message}</div>`).join("")}
      </div>
      <form onsubmit="addReply(event, ${index})">
        <input type="text" placeholder="Your Name" id="finder-${index}" required>
        <input type="text" placeholder="Reply (e.g. I found it near...)" id="message-${index}" required>
        <button type="submit">Reply</button>
      </form>
    `;

    postsContainer.appendChild(postDiv);
  });
}

function addReply(event, index) {
  event.preventDefault();
  let finder = document.getElementById(`finder-${index}`).value;
  let message = document.getElementById(`message-${index}`).value;

  let posts = JSON.parse(localStorage.getItem("lostPosts")) || [];
  posts[index].replies.push({ finder, message });

  localStorage.setItem("lostPosts", JSON.stringify(posts));
  loadPosts();
}
