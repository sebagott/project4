import * as api from './api_calls.js'

const profile_username = JSON.parse(document.getElementById('profile_username').textContent);
const username = JSON.parse(document.getElementById('username').textContent);

document.addEventListener('DOMContentLoaded', function() {

    // Get user's posts
    api.get_user_posts(profile_username)
        .then(
        posts => {
            posts.forEach(p => {
                document.querySelector("#posts-list").append(api.render_li(p));
            })
        });

    document.querySelector('#follow-btn').addEventListener('click', () => {
        api.toggle_following(profile_username,username)
            .then(result => {
                console.log(result.message); // TODO: Display message
                const follow_btn = document.querySelector('#follow-btn');
                follow_btn.innerHTML = follow_btn.innerHTML === 'Follow' ? 'Unfollow' : 'Follow';
                document.querySelector('#followers-count').innerHTML = result["followers"];
                document.querySelector('#following-count').innerHTML = result["following"];
            });
    });
});