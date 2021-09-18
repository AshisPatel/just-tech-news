async function editFormHandler(event) {
    event.preventDefault();

    const id = window.location.toString().split('/')[window.location.toString().split('/').length-1];
    const title = document.querySelector('[name="post-title"]').value.trim();

    const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            post_id: id,
            title: title
        }),
        headers: {
            'Content-type': 'application/json'
        }
    });

    if(response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText); 
    }
}


document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);