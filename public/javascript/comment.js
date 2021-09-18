async function commentFormHandler(event) {
    event.preventDefault();

    const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();

    // once again grabbing the id from the last element in the url if the url is split using the '/'
    const post_id = window.location.toString().split('/')[window.location.toString().split('/').length - 1];

    // validate that there is actual text in the comment_text variable
    if(comment_text) {
        const response = await fetch('/api/comments', {
            method: 'POST', 
            body: JSON.stringify({
                post_id, 
                comment_text
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(response.ok) {
            // once post goes through, refresh page!
            document.location.reload();
        } else {
            alert(response.statusText); 
        }
    }
}

document.querySelector('.comment-form').addEventListener('submit', commentFormHandler); 