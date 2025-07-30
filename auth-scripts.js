document.addEventListener('DOMContentLoaded', () => {

    const loginTabBtn = document.querySelector('.auth-tab-btn[data-tab="login"]');
    const signupTabBtn = document.querySelector('.auth-tab-btn[data-tab="signup"]');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const messageBox = document.getElementById('messageBox');

    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginBtn = document.getElementById('loginBtn');

    const signupEmailInput = document.getElementById('signupEmail');
    const signupPasswordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const signupBtn = document.getElementById('signupBtn');

    function showForm(formToShow, tabBtnToActivate) {
        if (!loginForm || !signupForm) return; 

        loginForm.classList.remove('active');
        signupForm.classList.remove('active');

        loginTabBtn.classList.remove('active');
        signupTabBtn.classList.remove('active');

        formToShow.classList.add('active');

        tabBtnToActivate.classList.add('active');

        hideMessage();
    }

    if (loginTabBtn && signupTabBtn) {
        loginTabBtn.addEventListener('click', () => showForm(loginForm, loginTabBtn));
        signupTabBtn.addEventListener('click', () => showForm(signupForm, signupTabBtn));
    }

    function showMessage(boxElement, message, type = 'error') {
        if (!boxElement) return; 
        boxElement.textContent = message;
        boxElement.className = 'message-box show'; 
        if (type === 'success') {
            boxElement.style.borderColor = 'var(--primary-cyan)';
            boxElement.style.color = 'var(--primary-cyan)';
            boxElement.style.background = 'rgba(0, 255, 255, 0.1)';
        } else if (type === 'info') {
            boxElement.style.borderColor = 'var(--primary-purple)';
            boxElement.style.color = 'var(--primary-purple)';
            boxElement.style.background = 'rgba(124, 58, 237, 0.1)';
        } else { 
            boxElement.style.borderColor = 'var(--primary-orange)';
            boxElement.style.color = 'var(--primary-orange)';
            boxElement.style.background = 'rgba(255, 255, 0, 0.1)';
        }

    }

    function hideMessage() {
        if (messageBox) {
            messageBox.textContent = '';
            messageBox.classList.remove('show');
        }
    }

    function getUsers() {
        const users = localStorage.getItem('genai_users');
        return users ? JSON.parse(users) : [];
    }

    function saveUsers(users) {
        localStorage.setItem('genai_users', JSON.stringify(users));
    }

    function setLoggedInUser(email) {
        localStorage.setItem('genai_loggedInUser', email);
    }

    function getLoggedInUser() {
        return localStorage.getItem('genai_loggedInUser');
    }

    function clearLoggedInUser() {
        localStorage.removeItem('genai_loggedInUser');
    }

    window.getLoggedInUser = getLoggedInUser;
    window.clearLoggedInUser = clearLoggedInUser;

    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault(); 

            hideMessage(); 

            const email = signupEmailInput.value.trim();
            const password = signupPasswordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();

            if (!email || !password || !confirmPassword) {
                showMessage(messageBox, 'All fields are required for signup.');
                return;
            }

            if (password.length < 6) {
                showMessage(messageBox, 'Password must be at least 6 characters long.');
                return;
            }

            if (password !== confirmPassword) {
                showMessage(messageBox, 'Passwords do not match.');
                return;
            }

            let users = getUsers();

            if (users.some(user => user.email === email)) {
                showMessage(messageBox, 'User with this email already exists. Please login.');
                return;
            }

            users.push({ email: email, password: password });
            saveUsers(users);

            showMessage(messageBox, 'Signup successful! Redirecting to login...', 'success');

            setTimeout(() => {
                showForm(loginForm, loginTabBtn);
                loginEmailInput.value = email; 
                signupEmailInput.value = ''; 
                signupPasswordInput.value = '';
                confirmPasswordInput.value = '';
                hideMessage(); 
            }, 1500);
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault(); 

            hideMessage(); 

            const email = loginEmailInput.value.trim();
            const password = loginPasswordInput.value.trim();

            if (!email || !password) {
                showMessage(messageBox, 'Both email and password are required for login.');
                return;
            }

            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password); 

            if (user) {
                setLoggedInUser(email); 
                showMessage(messageBox, 'Login successful! Redirecting...', 'success');

                setTimeout(() => {
                    window.location.href = 'ai-playground.html'; 
                }, 1500);
            } else {
                showMessage(messageBox, 'Invalid email or password.');
            }
        });
    }

    const currentPage = window.location.pathname.split('/').pop(); 

    if (getLoggedInUser()) {

        if (currentPage === 'login.html') {
            window.location.href = 'ai-playground.html';
            return; 
        }
    } else {

        if (currentPage === 'login.html') {
            if (loginForm && loginTabBtn) {
                showForm(loginForm, loginTabBtn);
            }
        }
    }
});