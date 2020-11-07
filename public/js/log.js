const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container1');

signUpButton.addEventListener('click', () => {
	container1.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container1.classList.remove("right-panel-active");
});