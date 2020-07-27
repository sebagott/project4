const username = JSON.parse(document.getElementById('username').textContent);

export async function create_post(body){
    const new_post = await fetch(`/post/create`, {
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify({
            body: body
        }),
        headers: {
            "X-CSRFToken": get_crsf_token(),
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
    })
    .then( response  => {
        if(response.status === 201) {
            return response.json();
        }
    })
    .catch( error => {
        console.log(error);
    })
    return new_post;
}


export async function toggle_following(profile_username){
    const user_counts = await fetch(`/profile/${profile_username}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
            "X-CSRFToken": get_crsf_token(),
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
    })
    .then( response  => {
        if(response.status === 201) {
            return response.json();
        }
    })
    .catch( error => {
        console.log(error);
    })
    return user_counts;
}

function get_crsf_token(){
   return document.querySelector("[name=csrfmiddlewaretoken]").value;
}

export async function get_all_posts(){
    const posts = await fetch(`/posts/all`)
    .then( response  => response.json())
    .catch( error => {
        console.log(error);
    })
    return posts;
}
export async function get_following_posts(){
    const posts = await fetch(`/posts/following`)
    .then( response  => response.json())
    .catch( error => {
        console.log(error);
    })
    return posts;
}

export async function get_user_posts(username){
    const posts = await fetch(`/posts/${username}`)
    .then( response  => response.json())
    .catch( error => {
        console.log(error);
    })
    return posts;
}

export function render_html(post){
    let div = document.createElement('div');
    div.className ="post mb-3";
    const liked_by_user = post.likers.includes(username) ? "liked" : "unliked";
    div.innerHTML = `<div data-postid="${post.id}">
                        <a href="/profile/${post.user}">@<b>${post.user}</b></a><label class="timestamp">${post.timestamp}</label>
                        <pre>${post.body}</pre>
                        <div class="container">
                            <div class="row justify-content-between">
                                <span class="col like-btn ${liked_by_user}"></span>
                                <span class="col likes-count-span align-self-end"><label class="likes-count">${post.likes}</label> <b>likes</b></span>
                            </div>
                        </div>                         
                    </div>`
    return div;
}

export async function toggle_like(post_id){
    const like_count = await fetch(`/post/${post_id}/like`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
            "X-CSRFToken": get_crsf_token(),
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
    })
    .then( response  => {
        if(response.status === 201) {
            return response.json();
        }
    })
    .catch( error => {
        console.log(error);
    })
    return like_count;
}
export function set_likes() {
    document.querySelectorAll('.like-btn').forEach(span => {
        span.addEventListener('click', () => {
            const post_id = span.parentNode.parentNode.parentNode.dataset.postid;
            if(span.classList.contains('liked'))
                toggle_like(post_id).then(result => {
                    span.className = 'col like-btn unliked';
                    span.parentNode.querySelector('.likes-count').innerHTML = result.likes;
                })
            else
                toggle_like(post_id).then(result => {
                    span.className = 'col like-btn liked';
                    span.parentNode.querySelector('.likes-count').innerHTML = result.likes;
                })
        })
    });

}