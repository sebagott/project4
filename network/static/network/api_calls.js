
export async function toggle_following(profile_username, follower_username){
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

export function render_li(post){
    let li = document.createElement('li');
    li.innerHTML = `${post.body}`
    //TODO: fancy it.
    return li;
}

