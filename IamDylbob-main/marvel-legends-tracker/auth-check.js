// Simple auth check - runs first
const authData = localStorage.getItem('marvelLegendsAuth');
if (!authData && !window.location.href.includes('auth.html')) {
    window.location.replace('auth.html');
}