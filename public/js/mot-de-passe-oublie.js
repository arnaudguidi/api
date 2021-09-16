//<script>

const loginEmail = document.querySelector("#passwordEmail");
const submitButton = document.querySelector('#submitBouton');
const loginError = document.querySelector("#errorMessage");
const askForEmail = document.querySelector("#ask-for-email");
const confimrationBloc = document.querySelector("#confirmation");

confimrationBloc.style.display = 'none';
loginError.style.display = 'none';

// On lance le clic avec enter dans le champ email
loginEmail.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        submitButton.click();
    }
});



submitButton.addEventListener('click', event => {
  event.preventDefault();
  console.log('*** Envoi email ***');
  submitButton.style.display = 'none';
  loginError.style.display = 'none';
  const email = loginEmail.value;
  console.log('Email: ',email);

  auth.sendPasswordResetEmail(email).then(function() {
    console.log('Email envoyé');
    askForEmail.style.display = 'none';
    confimrationBloc.style.display = 'block';

  }).catch(function(error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log('Erreur: ',email);
    console.log('Error code: ' + errorCode);
    console.log('Error message: ' + errorMessage);
    submitButton.style.display = 'flex';
    loginError.innerText = errorMessage;
    loginError.style.display = 'block';
  });

});

//</script>