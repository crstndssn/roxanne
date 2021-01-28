class Post {

    createPost(uid, emailUser, title, description, imagenLink) {
        return firebase.firestore()
            .collection('posts')
            .add({
                uid: uid,
                autor: emailUser,
                title: title,
                description: description,
                imagenLink: imagenLink,
                date: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(refDoc => {
                console.log(`Id del post => ${refDoc.id}`);
            })
            .catch(error => {
                console.log(`Error creando el post ${error}`)
            })
    }

    getPosts() {
        firebase.firestore()
            .collection('posts')
            .onSnapshot(querySnapshot => {
                console.log(`los posts: ${querySnapshot}`)
                getPostView.innerHTML = '';
                querySnapshot.forEach(post => {
                    let postHtml = this.getPostTemplate(
                        post.data().autor,
                        post.data().title,
                        post.data().description,
                        post.data().imagenLink,
                        Utility.getDate(post.data().date.toDate())
                    )
                    getPostView.innerHTML += postHtml
                })
            })
    }

    getPostsUser() {
        firebase.firestore()
            .collection('posts')
            .where('autor', '==', emailUser)
            .onSnapshot(querySnapshot => {
                getPostUserView.innerHTML = '';
                querySnapshot.forEach(post => {
                    let postHtml = this.getPostTemplate(
                        post.data().autor,
                        post.data().title,
                        post.data().description,
                        post.data().imagenLink,
                        Utility.getDate(post.data().date.toDate())
                    )
                    getPostUserView.innerHTML += postHtml
                })
            })
    }


    getPostTemplate(
        autor,
        title,
        description,
        imagenLink,
        date
    ) {
        return `
            <div class="grid-item rounded-lg border border-black mb-8 cursor-pointer">
                <div class=cursor-pointer">
                    <div class="imagen-container w-full h-48 overflow-auto"><img class="object-cover" src="${imagenLink}"></div>
                    <div class="px-6 py-4">
                        <h2 class="masonry-title font-medium text-xl my-1">${title}</h2>
                        <p class="masonry-description text-sm font-normal text-gray-400">${date}</p>
                        <p class="masonry-description text-sm font-normal text-gray-400 my-1">por ${autor}</p>
                    </div>
                </div>
            </div>
        `;
    }

    addImagenPost(file, uid) {
        const refStorage = firebase.storage().ref(`imgsPosts/${uid}/${file.name}`);
        const task = refStorage.put(file)

        task.on(
            'state_changed',
            snapshot => {
                const porcentaje = (snapshot.bytesTransferred / snapshot.totalBytes * 100)
                console.log(porcentaje)
                document.querySelector('.upload-image').style.width = `${porcentaje}%`
            },
            err => {
                console.log(err)
            },
            () => {
                task.snapshot.ref
                    .getDownloadURL()
                    .then(url => {
                        console.log(url)
                        sessionStorage.setItem('imgNewPost', url)
                    })
                    .catch(err => {
                        console.log(`Error obteniendo el downloadURL ${err}`)
                    })
            }
        )
    }



}