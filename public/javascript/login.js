const signupFormHandler = async function(event) {
    event.preventDefault();
    // Grab signup values required to make user in model 
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    // Check all inputs present
    if(username && email && password) {
        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            // Use this because we're posting JSON data 
            headers: { 'Content-Type': 'application/json' }
        });

        // check if fetch request went well
        if(response.ok) {
            console.log('success');
        } else {
            alert(response.statusText);
        }


    }
};

const loginFormHandler = async function(event) {
    event.preventDefault();

    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if(email && password) {
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email, 
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        if(response.ok) {
            document.location.replace('/');
        } else {
            alert(response.statusText); 
        }
    }

     
}


document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
document.querySelector('.login-form').addEventListener('submit', loginFormHandler); 