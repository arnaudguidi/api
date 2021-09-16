//<!-- signup function -->
//<script>
    const signupButton = document.querySelector("#submitBouton");
    const signupError = document.querySelector("#errorMessage");
    const signupEmail = document.querySelector("#Email");
    const signupPassword = document.querySelector("#Password");
    const checkBloc = document.querySelector('.w-checkbox-input')
    const inscriptionBloc = document.querySelector('#bloc-inscription');
    const messageBloc = document.querySelector('#message');
    messageBloc.style.display = 'none';
    const emailMessage = document.querySelector('.email-sent');

    // OPTIN avant inscription
    checkOrNot = function(){
        var classes = checkBloc.classList;
        var result = classes.contains("w--redirected-checked");
        if(result) {
            return true;
        } else {
            return false;
        }
    }

    // Check email
    const ValidateEmail = (inputText)=>{
        console.log("** ValidateEmail ** : ",inputText);
        var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(inputText.match(mailformat)){
            console.log("Valid email address!");
            // Filter
            console.log("** filterEmail **");
            //const substrings = ["@gmail.com", "@yahoo.com", "@yahoo.fr", "@hotmail.fr", "@hotmail.com", "@outlook.fr", "@outlook.com", "@orange.fr", "@free.fr", "@sfr.fr", "@icloud.com", "@laposte.net", "@live.fr", "@live.com", "@yopmail.com","@aol.fr","@aol.com","@msn.com","@wanadoo.fr","@gmx.fr"];
            const substrings = ["@yahoo.com", "@yahoo.fr", "@hotmail.fr", "@hotmail.com", "@outlook.fr", "@outlook.com", "@orange.fr", "@free.fr", "@sfr.fr", "@icloud.com", "@laposte.net", "@live.fr", "@live.com", "@yopmail.com","@aol.fr","@aol.com","@msn.com","@wanadoo.fr","@gmx.fr"];
            let str = inputText;

            if (substrings.some(v => str.includes(v))) {
                console.log("Match using '" + str + "'");
                return false;
            } else {
                console.log("No match using '" + str + "'");
                return true;
            }
        }
        else{
            console.log("You have entered an invalid email address!");
            return false;
        }
    };
        
    // On lance le clic avec enter dans le champ email
    signupEmail.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            signupButton.click();
        }
    });
    // On lance le clic avec enter dans le champ password
    signupPassword.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            signupButton.click();
        }
    });

    // Ajout des paramètres généraux
    let nbSimul = 0;
    let actionCodeSettings = {};
    const generalSettings = () => {
        console.log('generalSettings');
        var docRef = db.collection("settings").doc("settings_doc");
        docRef.get().then((doc) => {
            if (doc.exists) {
                nbSimul = doc.data().nb_simul_start;
            } else {
                nbSimul = 0;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
    const urlToGo = () => {
        let newurl = window.location.protocol + '//' + location.host + verificationPage;
        console.log('newurl : ',newurl);
        return newurl;
    };
    
   const sendSignInLinkToEmail = (email) => {
       console.log("On envoi un email au user")
        var user = firebase.auth().currentUser;

        user.sendEmailVerification().then(function() {
            // Email sent.
            console.log("Email envoyé")
            emailMessage.innerHTML = email;
            messageBloc.style.display = 'block';
            inscriptionBloc.style.display = 'none';
        }).catch(function(error) {
            console.log('error sending the email',error);
            // An error happened.
        });
    }


    // Creation de l'utilisateur
    const createUser = () => {
        console.log("createUser");
        let testCheck = checkOrNot();
        let checkEmail = ValidateEmail(signupEmail.value);
        if(checkEmail){      
            if(testCheck){
                signupButton.style.display = 'none';
                signupError.style.display = 'none';
                const email = signupEmail.value;
                const password = signupPassword.value;

                auth.createUserWithEmailAndPassword(email, password)
                    .then( user => {
                        console.log('registered', user);
                        currentUser = user;
                        generalSettings();
                    })
                    .catch( error => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log('Error code: ' + errorCode);
                        console.log('Error message: ' + errorMessage);
                        signupButton.style.display = 'flex';
                        signupError.innerText = errorMessage;
                        signupError.style.display = 'block';
                    }).then(() => {
                        sendSignInLinkToEmail(email);
                        // ici on peut rajouter des choses à faire quand la creation du compte est terminée
                        //window.location.replace(accountpage);
                    });
            } else{
                signupError.innerText = "Veuillez accepter les conditions d'utilisation";
                signupError.style.display = 'block';
            }
        } else {
            signupError.innerHTML = "Veuillez renseigner votre email professionnel pour utiliser Jobexit Employeur. Si vous souhaitez utiliser Jobexit en tant que salarié, veuillez <a href='https://www.jobexit.fr/' style='color:#db1111;text-decoration: underline'>cliquer ici</a>";
            signupError.style.display = 'block';
        }
    };

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        signupError.style.display = 'none';
        createUser();
    });


//</script>