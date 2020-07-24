import * as api from "./api_calls.js";


document.addEventListener('DOMContentLoaded', function() {
    const following_view = JSON.parse(document.getElementById('following').textContent);
    if(following_view){
        const username = JSON.parse(document.getElementById('username').textContent);
        console.log('Loading content: Following');
        posts_view('following');
    }
    else{
        console.log('Loading content: All Posts');
        posts_view('allposts');
    }

});

function posts_view(view) {

  // Reset the list
  document.querySelector('#posts-list').innerHTML = '';
  if(view === "allposts") {
      document.querySelector('#posts-title').innerHTML = 'All Posts';
      // Get ALL posts
      api.get_all_posts().then(
          posts => {
              posts.forEach(p => {
                  document.querySelector("#posts-list").append(api.render_li(p));
          })
      });
  }
  if(view === 'following') {
      document.querySelector('#posts-title').innerHTML = 'Following';
      // Get ALL posts
      api.get_following_posts().then(
          posts => {
              posts.forEach(p => {
                  document.querySelector("#posts-list").append(api.render_li(p));
          })
      });
  }
}

