async function upvoteClickHandler(event) {
    event.preventDefault();
    // Grab user_id from the session and the post_id from the request url 

    // url is .../post/id 
    // split returns [...,post,id] => grabbing the length is 3, then grabbing length -1 gives us the last item which is the id. 
    const id = window.location.toString().split('/')[window.location.toString().split('/').length - 1];

    const response = await fetch('/api/posts/upvote', {
        // can be capital method or lowercase 
        method: 'PUT',
        body: JSON.stringify({
            post_id: id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(response.ok) {
        document.location.reload();
    } else {
        alert(response.statusText); 
    }
   
}

document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);