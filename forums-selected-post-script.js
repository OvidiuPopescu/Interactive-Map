let openPost = document.getElementById('post-details');  
let commentButton = document.getElementById('leave-comment');
let comments = document.getElementById('comment-list');  
let commentEditor = document.getElementById('comment-editor');
let writeComment = document.getElementById('write-comment');
let addComment = document.getElementById('add-comment');
let content = localStorage.getItem('selected-post');        /*get content of open post*/
let replies = '';
let commentAuthors = '';

openPost.innerText = content;                               /*display it*/

if (localStorage.getItem('replies') != null  && localStorage.getItem('commentAuthors') != null ) {              /*don't lose replies on reload*/
    replies = localStorage.getItem('replies');
    commentAuthors = localStorage.getItem('commentAuthors');
    repliesArray = replies.split('r/r/wcv/');
    authorsArray = commentAuthors.split('ca/ca/cai/');

    for (i = 0; i < repliesArray.length-1; i++) {
        let newDiv = document.createElement('div');
        newDiv.innerText = repliesArray[i];
        newDiv.classList.add('comment');

        let commentAuthor = document.createElement('div');      /*add Author name to comment*/
        commentAuthor.innerText = authorsArray[i];
        commentAuthor.classList.add('comment-author');
        newDiv.prepend(commentAuthor);

        comments.append(newDiv);
    }
};

addComment.addEventListener('click', function(){            /*this adds new replies*/
    let newDiv = document.createElement('div');
    newDiv.innerText = writeComment.value;

    let commentAuthor = document.createElement('div');      /*add Author name to comment*/
    let loggedInUser = localStorage.getItem('user');
    commentAuthor.innerText = loggedInUser;
    commentAuthor.classList.add('comment-author');
    newDiv.prepend(commentAuthor);

    comments.append(newDiv);

    console.log('comment posted')

    replies = replies + writeComment.value + 'r/r/wcv/';
    localStorage.setItem('replies', replies);

    commentAuthors = commentAuthors + commentAuthor.innerText + 'ca/ca/cai/'
    localStorage.setItem('commentAuthors', commentAuthors);
})