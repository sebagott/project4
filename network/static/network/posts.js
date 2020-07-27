import * as api from "./api_calls.js";


document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#newpost-form').onsubmit = () => {
        const new_post = api.create_post(document.querySelector('#newpost-body').value)
            .then(result => {
                document.querySelector("#posts-list").prepend(api.render_html(result["post"]));
            });
        return false;
    };

    const following_view = JSON.parse(document.getElementById('following').textContent);
    if(following_view){
        const username = JSON.parse(document.getElementById('username').textContent);
        posts_view('following');
    }
    else{
        posts_view('allposts');
    }

});

function posts_view(view) {

  // Reset the list
  document.querySelector('#posts-list').innerHTML = '';
  if(view === "allposts") {
      document.querySelector('#allposts-btn').className ="nav-link active";
      document.querySelector('#following-btn').className ="nav-link";
      document.querySelector('#posts-title').innerHTML = 'All Posts';
      // Get ALL posts
      api.get_all_posts()
          .then(posts => {
              posts.forEach(p => {
                  document.querySelector("#posts-list").append(api.render_html(p));
              })
              api.set_likes();
      });
  }
  if(view === 'following') {
      document.querySelector('#allposts-btn').className ="nav-link";
      document.querySelector('#following-btn').className ="nav-link active";
      document.querySelector('#posts-title').innerHTML = 'Following';
      // Get ALL posts
      api.get_following_posts()
          .then(posts => {
              posts.forEach(p => {
                  document.querySelector("#posts-list").append(api.render_html(p));
          })
          api.set_likes();
      });
  }

}

