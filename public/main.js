const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");

const loginCheck = (user) => {
  if (user) {
    loggedInLinks.forEach((link) => (link.style.display = "block"));
    loggedOutLinks.forEach((link) => (link.style.display = "none"));
  } else {
    loggedInLinks.forEach((link) => (link.style.display = "none"));
    loggedOutLinks.forEach((link) => (link.style.display = "block"));
  }
};

// sign up
const signUpForm = document.querySelector("#form-signup");
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signUpForm["signup-email"].value;
    const password = signUpForm["signup-password"].value;
    auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            signUpForm.reset();
            modalSignup.style.display = "none"
        })
})

// log in
const signInForm = document.querySelector("#form-login");
signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signInForm["login-email"].value;
    const password = signInForm["login-password"].value;
    auth
        .signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            console.log('loged')
            signInForm.reset();
            modalLogin.style.display = "none"
        })
})

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    auth.signOut().then(() => {
        location.reload();
        console.log('signout')
    })
})

// posts
const postList = document.querySelector(".posts");
const setupPosts = (data) => {
    if (data.length) {
        let html = "";
        data.forEach((doc) => {
            const post = doc.data();
            const li = `
                <div class="border border-black p-5">
                    <h1 class="my-2 font-bold">${post.title}</h1>
                    <p>${post.description}</p>
                </div>
            `;
            html += li;
        })
        postList.innerHTML = html;
    }
}


// events 
// list for auth state changes
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("in");
        fs.collection("posts")
            .get()
            .then((snapshot) => {
                setupPosts(snapshot.docs)
                loginCheck(user)
            })
    } else {
        console.log('out')
        setupPosts([]);
        loginCheck(user)
    }
});

// google login
const googleButton = document.getElementById("login-google");
googleButton.addEventListener('click', (e) => {
    e.preventDefault();
    signInForm.reset();
    modalLogin.style.display = "none";

    const provider = new firebase.auth.GoogleAuthProvider();
    auth
        .signInWithPopup(provider)
        .then((result) => {
            console.log(result)
        })
        .catch(err => {
            console.log(err)
        })
})