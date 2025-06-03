const pswdBtn = document.getElementById('pswdBtn');
pswdBtn.addEventListener('click', () => {
    const password = document.getElementById('account_password');
    const type = password.getAttribute('type');
    if (type === 'password') {
        password.setAttribute('type', 'text');
        password.innerHTML = 'Hide password';
    } else {
        password.setAttribute('type', 'password');
        password.innerHTML = 'Show password';
    }
});