const authForm = document.getElementById('auth-form');
const authModeToggle = document.getElementById('toggle-auth-mode');
const authTitle = document.getElementById('auth-title');
const authButton = document.getElementById('auth-button');
const authMessage = document.getElementById('auth-message');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const STORAGE_KEY = 'zee-auth-users';
let authMode = 'login';

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (error) {
    return {};
  }
}

function saveStoredUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function showMessage(message, type = 'info') {
  if (!authMessage) return;
  authMessage.textContent = message;
  authMessage.className = `message ${type}`;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hashPassword(password) {
  return btoa(password);
}

function handleSignup(email, password) {
  const users = getStoredUsers();
  if (users[email]) {
    showMessage('This email is already registered. Try logging in.', 'error');
    return;
  }

  users[email] = { password: hashPassword(password) };
  saveStoredUsers(users);
  showMessage('Signup successful! Now you can log in.', 'success');
  setAuthMode('login');
}

function handleLogin(email, password) {
  const users = getStoredUsers();
  const storedUser = users[email];

  if (!storedUser) {
    showMessage('No account found with that email. Please sign up first.', 'error');
    return;
  }

  if (storedUser.password !== hashPassword(password)) {
    showMessage('Password is incorrect. Please try again.', 'error');
    return;
  }

  showMessage(`Welcome back, ${email}! Login successful.`, 'success');
}

function setAuthMode(mode) {
  authMode = mode;
  if (authTitle) authTitle.textContent = mode === 'signup' ? 'Sign Up' : 'Login';
  if (authButton) authButton.textContent = mode === 'signup' ? 'SIGN UP' : 'LOGIN';
  if (authModeToggle) authModeToggle.textContent = mode === 'signup' ? 'Log in' : 'Sign up';
}

if (authForm) {
  authForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = emailInput?.value.trim() || '';
    const password = passwordInput?.value || '';

    if (!validateEmail(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }

    if (password.length < 6) {
      showMessage('Password should be at least 6 characters long.', 'error');
      return;
    }

    if (authMode === 'signup') {
      handleSignup(email, password);
    } else {
      handleLogin(email, password);
    }
  });
}

if (authModeToggle) {
  authModeToggle.addEventListener('click', (event) => {
    event.preventDefault();
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    showMessage('', 'info');
  });
}

const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu ul');

if (hamburger && menu) {
  hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
  });
}
