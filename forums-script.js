
let postArea = document.getElementById('main-forums');
let postButton = document.getElementById('post-button');
let postsSection = document.getElementById('posts-section');
let postTitleData = localStorage.getItem('Post Titles');
let postContentData = localStorage.getItem('Post Contents');
let pTitleArray = postTitleData.split('pt/pt/npt');                      /*separate the string with all post titles and contents*/                    
let pContentArray = postContentData.split('pc/pc/npc');
let rememberPost = localStorage.getItem('postNumber');                   /*remember post that was opened in forums-selected-post*/
let replies = localStorage.getItem('replies');
let replyAuthors = localStorage.getItem('commentAuthors');
let userArea = document.getElementById('user-area');
let userName = document.getElementById('username');
let loggInInputs = document.getElementById('loggin-inputs');
let userPassword = document.getElementById('password');
let signUpButton = document.getElementById('sign-up-button');
let logInButton = document.getElementById('log-in-button');
let loggedUser = document.getElementById('logged-user');
let loggedInUser = localStorage.getItem('user');
let loggedInState = false;
let userCount = localStorage.getItem('userCount');


class post {
  constructor(title, content, number, replies, replyAuthors) {
    this.title = title;
    this.content = content;

    this.number = number;
    this.replies = replies;
    this.replyAuthors = replyAuthors;
  }
}
let allPosts = [];

function buildPosts() {                                                 /*create post objects from local storage data*/
  for (i = 0; i < pTitleArray.length-1; i++) {
    let createdPost = new post(pTitleArray[i], pContentArray[i], i);
    allPosts.push(createdPost);
  }
}
buildPosts();

for (i = 0; i < allPosts.length; i++) {                          /*loop trough all post objects*/
  
  let desiredRepliesKey = 'Post ' + [i+1] + 'replies';                                                            /*find the coreponding saved replies for every post*/  
  let desiredReplyAuthorsKey = 'Post' + [i+1] + 'replyAuthors';                                                   /*also for post authors*/
  if (localStorage.getItem(desiredRepliesKey) != null && localStorage.getItem(desiredReplyAuthorsKey) != null) {
    allPosts[i].replies = localStorage.getItem(desiredRepliesKey);                                                /*to add to the objects on every page load*/
    allPosts[i].replyAuthors = localStorage.getItem(desiredReplyAuthorsKey);
  }
  console.log(allPosts[i].replies);

  if (allPosts[i].number == rememberPost) {                     /*find the last opened post*/
    
    let repliesKey = 'Post ' + [i+1] + 'replies';               /*save its updated replies to storage*/
    localStorage.setItem(repliesKey, replies);    
    let replyAuthorsKey = 'Post' + [i+1] + 'replyAuthors';      /*also for reply authors*/
    localStorage.setItem(replyAuthorsKey, replyAuthors);              
    allPosts[i].replies = replies;                              /*and update for current session*/
    allPosts[i].replyAuthors = replyAuthors;
  }
}

for (i = 0; i < allPosts.length; i++) {                       /*for every post object create a post element on page*/
  let post = document.createElement('div');
  post.innerText = allPosts[i].title;
  post.classList.add('post');
  postsSection.appendChild(post);

  let corespondingContent = allPosts[i].content  
  
  let postNumber = allPosts[i].number;                           /*remember post number to save it in local storage*/
  let postReplies = allPosts[i].replies;                         /*same for replies*/
  let postReplyAuthors = allPosts[i].replyAuthors;

  console.log(postReplyAuthors);

  post.addEventListener('click', function() {                    /*event to display post content*/

    localStorage.setItem('selected-post',corespondingContent);   /*save post content*/
    location.assign('forums-selected-post.html');                /*to open it in a new page*/

    
    localStorage.setItem('postNumber', postNumber);              /*save post number in local storage*/

    if(postReplies != undefined) {
      localStorage.setItem('replies', postReplies);
    } else {
      localStorage.setItem('replies', '');
    }

    if(postReplyAuthors != undefined) {
      localStorage.setItem('commentAuthors', postReplyAuthors);
    } else {
      localStorage.setItem('commentAuthors', '');
    }
  })
}

class user {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

let allUsers = [];

signUpButton.addEventListener('click', function() {
  if(userName.value != '' && userPassword.value != '') {
    console.log('created user');
    function createUser() {
      let newUser = new user(userName.value,userPassword.value);
      allUsers.push(newUser);

      console.log(allUsers);

      localStorage.setItem('user', userName.value);
      localStorage.setItem('password', userPassword.value);
      loggedInState = true;

      loggInInputs.style.display = 'none';
      loggedUser.style.display = 'block';
      signUpButton.style.display = 'none';                           
      logInButton.innerText = 'Log-Out';
      userArea.style.width = '180px';
      loggedInUser = localStorage.getItem('user');
      loggedUser.innerText = 'Logged in as ' +  loggedInUser;
    }

    createUser();

    for(i = 0; i < allUsers.length; i++) {                                  /*add new user data to local storage*/
      localStorage.setItem('user' + i + 'name', allUsers[i].username);
      localStorage.setItem('user' + i + 'password', allUsers[i].password);
      localStorage.setItem('userCount', i + 1);                             /*remember how manny users exist*/
    }
  }
})

for(i = 0; i < userCount; i++) {                                                  /*get users from local storage*/
      let getName = localStorage.getItem('user' + i + 'name');
      let getPassword = localStorage.getItem('user' + i + 'password');

      if(getName != null) {
        let getUser = new user(getName,getPassword);
        allUsers.push(getUser);
      }

      console.log(allUsers);
    }

if(loggedInUser != '') {                                        /*log-in user account on page load*/
  loggInInputs.style.display = 'none';
  loggedUser.style.display = 'block';
  loggedUser.innerText = 'Logged in as ' +  loggedInUser;

  signUpButton.style.display = 'none';                           /*hide signUp button when logged in*/
  logInButton.innerText = 'Log-Out';                             /*change log-in text to match new functionality*/
  loggedInState = true;
  userArea.style.width = '180px';
}

logInButton.addEventListener('click', function(){                
  if(logInButton.innerText == 'Log-Out') {                       /*logg-out and...*/
    loggInInputs.style.display = 'block';
    loggedUser.style.display = 'none';
    signUpButton.style.display = 'inline-block';  

    localStorage.setItem('user', '');                            /*...forget data used to log-in again on reload*/
    localStorage.setItem('password', '');
    logInButton.innerText = 'Log-In';  
    loggedInState = false;
    userArea.style.width = '354px';
  } else {

    for(i = 0; i < allUsers.length; i++) {
      if (userName.value == allUsers[i].username) {
        console.log(allUsers[i].username);

      localStorage.setItem('user', userName.value);
      localStorage.setItem('password', userPassword.value);
      loggedInUser = localStorage.getItem('user');
      loggedInState = true;

      loggInInputs.style.display = 'none';
      loggedUser.style.display = 'block';
      loggedUser.innerText = 'Logged in as ' +  loggedInUser;
      signUpButton.style.display = 'none';                           
      logInButton.innerText = 'Log-Out';
      userArea.style.width = '180px';
      }
    }
  }
})

postButton.addEventListener('click', function(){    /*only looged in users can create posts*/
  if(loggedInState == true) {
  location.assign('forums-post.html');
  }
})


