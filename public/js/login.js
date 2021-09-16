//<!-- login function -->
//<script>
    const loginBouton = document.querySelector("#loginBouton");
    const loginError = document.querySelector("#errorMessage");
    const loginEmail = document.querySelector("#loginEmail");
    const loginPassword = document.querySelector("#loginPassword");
    loginError.innerText = "";
    
    // On lance le clic avec enter dans le champ email
    loginEmail.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            loginBouton.click();
        }
    });
    // On lance le clic avec enter dans le champ password
    loginPassword.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            loginBouton.click();
        }
    });

    loginBouton.addEventListener('click', event => {
        event.preventDefault();
        console.log('*** Login ***');
      loginBouton.style.display = 'none';
      loginError.style.display = 'none';
      const email = loginEmail.value;
      const password = loginPassword.value;
      console.log('Values: ',email,' - ',password);
        
      auth.signInWithEmailAndPassword(email, password)
          .then( cred => {
              console.log('alors ?',email,password);
              window.location.replace(accountpage);
          })
          .catch( error => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log('Erreur: ',email,password);
              console.log('Error code: ' + errorCode);
              console.log('Error message: ' + errorMessage);
              loginBouton.style.display = 'flex';
              loginError.innerText = errorMessage;
              loginError.style.display = 'block';
          });
    });

//</script>