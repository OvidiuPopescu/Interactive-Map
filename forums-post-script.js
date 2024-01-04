let postMaker = document.getElementById('post-maker');
let newPostTile = document.getElementById('post-title');
let newPostContent = document.getElementById('post-content');
let postCommit = document.getElementById('post-commit');
let postRedirect = document.getElementById('post-redirect');

let postTitles = '';
let postContents = '';

if (localStorage.getItem('Post Titles') != null) {
  postTitles = localStorage.getItem('Post Titles');
};

if (localStorage.getItem('Post Contents') != null) {
  postContents = localStorage.getItem('Post Contents');
};

postCommit.addEventListener('click', function() {                       /*commit post to post section*/

    postTitles = postTitles + newPostTile.value + 'pt/pt/npt';          /*we added giberish that will be used to split the string on forums page*/
    postContents = postContents + newPostContent.value + 'pc/pc/npc';
    localStorage.setItem('Post Titles', postTitles);
    localStorage.setItem('Post Contents', postContents);

    console.log(postTitles);
    console.log(postContents);

    if (newPostContent.value != '' && newPostTile.value != '') {      /*redirect to posts only if you filed the title and content*/
      location.assign('forums.html');
      console.log('Valid post')
    } else {
      console.log('Invalid post')
    }

  
})