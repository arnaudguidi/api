//<script>
$(document).ready(function(){
// Remplace les styles de la popin
	$('.popin').css({
      "position": "fixed","left": "auto","top": "0px","right": "0px","bottom": "0px","z-index": "899",
      "display": "block","width": "100%","height": "100vh","justify-content": "flex-end"
    });

	$('.popin').css({
		"position": "fixed",
		"left": "0%",
		"top": "0%",
		"right": "0%",
		"bottom": "0%",
		"z-index": "899",
		"display": "block",
		"width": "100%",
		"height": "100vh",
		"justify-content": "flex-end"
	});

	$('.esp-modal-wrapper').css({
		"position": "absolute",
		"left": "0%",
		"top": "0%",
		"right": "0%",
		"bottom": "0%",
		"z-index": "901",
	});

	$('.esp-modal-content').css({
		"overflow": "scroll",
		"overflow-x": "hidden",
		"height": "100%",
	});
	
	$('.popin-back').css({
		"display": "block",
	});
  });
//</script>
// <!-- FIREBASE -->
/* <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-functions.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-storage.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-analytics.js"></script> */
//<script>
    // Configuration
    var firebaseConfig = {
        apiKey: "AIzaSyBPwKb2eguMQBwDqn_s9X8jJv0g_OoFF0Q",
        authDomain: "jobexit-pro.firebaseapp.com",
        projectId: "jobexit-pro",
        storageBucket: "jobexit-pro.appspot.com",
        messagingSenderId: "680083687593",
        appId: "1:680083687593:web:9f4d6785baba969e7b01b8"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    const auth = firebase.auth();
    const db = firebase.firestore();
    const functions = firebase.functions();
    const storage = firebase.storage();

    if (location.hostname === "localhost") {
        auth.useEmulator("http://localhost:9099");
        db.useEmulator("localhost", 8080);
        functions.useEmulator("localhost", 5001);
        storage.useEmulator("localhost", 9199);
    }
    
    
//</script>

//<!-- Auth state function -->
//<script>
    // Pages privées a remettre pour la mise en ligne
    // const privatePages = [
    //     '/employeur/espace-employeur/mon-compte',
    //     '/employeur/espace-employeur/formule',
    //     '/employeur/espace-employeur/formule-success',
    //     '/employeur/espace-employeur/formule-error',
    //     '/employeur/espace-employeur/simulateur-employeur',
    //     '/employeur/espace-employeur/resultat-employeur',
    //     '/employeur/espace-employeur/resultat-api',
    //     '/employeur/espace-employeur/modifier-mot-de-passe'
    // ];
    const privatePages = [
        '/employeur/espace-employeur/mon-compte.html',
        '/employeur/espace-employeur/formule.html',
        '/employeur/espace-employeur/formule-success.html',
        '/employeur/espace-employeur/formule-error.html',
        '/employeur/espace-employeur/simulateur-employeur.html',
        '/employeur/espace-employeur/resultat-employeur.html',
        '/employeur/espace-employeur/resultat-api.html',
        '/employeur/espace-employeur/modifier-mot-depasse.html'
    ];
    
    const loginPage = '/employeur/connexion.html';
    const accountpage = '/employeur/espace-employeur/mon-compte.html';
    const formulePage = '/employeur/espace-employeur/formule.html';
    const formuleSuccess = '/employeur/espace-employeur/formule-success.html';
    const formuleError = '/employeur/espace-employeur/formule-error.html';
    const simulationPage = '/employeur/espace-employeur/simulateur-employeur.html';
    const resultatPage = '/employeur/espace-employeur/resultat-employeur.html';
    const resultatPageApi = '/employeur/espace-employeur/resultat-api.html';
    const verificationPage = '/employeur/verification.html';
    const motDePasseOublie = '/employeur/mot-de-passe-oublie.html';
    const modifierMotDePasse = '/employeur/espace-employeur/modifier-mot-depasse.html';

    //const loginPage = '/employeur/connexion';
    //const accountpage = '/employeur/espace-employeur/mon-compte';
    //const formulePage = '/employeur/espace-employeur/formule';
    //const formuleSuccess = '/employeur/espace-employeur/formule-success';
    //const formuleError = '/employeur/espace-employeur/formule-error';
    //const simulationPage = '/employeur/espace-employeur/simulateur-employeur';
    //const resultatPage = '/employeur/espace-employeur/resultat-employeur';
    //const resultatPageApi = '/employeur/espace-employeur/resultat-api';
    //const verificationPage = '/employeur/verification';
    //const motDePasseOublie = '/employeur/mot-de-passe-oublie';
    //const modifierMotDePasse = '/employeur/espace-employeur/modifier-mot-de-passe';
    
    const signupLink = document.querySelector("#signupLink");
    const loginLink = document.querySelector("#loginLink");
    const accountLink = document.querySelector('#accountLink');

    // Logout function
    const logoutLink = document.querySelector('#logout');
    if(logoutLink){
	    logoutLink.addEventListener('click', (e) => {
  		    e.preventDefault();
              console.log("Logout");
  		    auth.signOut();
        });
    }

    var currentUser = {};
    var currentUserUID = '';
    var emailVerified = null;

    auth.onAuthStateChanged( user => {
        let currentPath = window.location.pathname;
        console.log("currentPath : "+currentPath);
        if (user) {
            // User is signed in.
            console.log('user logged in', user," & email is verified : ",emailVerified);
            console.log('Email: ' + user.email + ' - UID: ' + user.uid);
            currentUser = user;
            currentUserUID = user.uid;
            emailVerified = user.emailVerified;
            
            console.log('emailVerified : ',emailVerified);

            /*
            if(!emailVerified){
                    console.log("Utilisateur n'a pas encore vérifié son email");



                    //!\ à remettre  !!!!!!!!!!
                    //auth.signOut();

            } else {
            
            */
            
                if(currentPath == accountpage){
                    console.log("Page compte");
                    document.addEventListener('DOMContentLoaded', initMoncompte());
                } else if(currentPath == formulePage){
                    console.log("Page formule");
                    //document.addEventListener('DOMContentLoaded', checkAndHide());
                } else if(currentPath == simulationPage){
                    document.addEventListener('DOMContentLoaded', checkUser());
                } else if(currentPath == resultatPage){
                    document.addEventListener('DOMContentLoaded', init());
                } else if(currentPath == resultatPageApi){
                    document.addEventListener('DOMContentLoaded', init());
                }
                else {
                    if(signupLink){
                        console.log("signupLink Exist => None");
                        signupLink.style.display = 'none';
                    }
                    if(loginLink){
                        console.log("loginLink Exist => None");
                        loginLink.style.display = 'none';
                    }
                    if(accountLink){
                        console.log("accountLink Exist => Flex");
                        accountLink.style.display = 'flex';
                    }
                }
            /*    
            }
            */
        } else {
            // User is signed out.
            console.log('user is signed out');
            if (privatePages.includes(currentPath)) {
                console.log("Redirection vers connexion");
                window.location.replace(loginPage);

            } 
            
            if(accountLink){
                console.log("There is an accountLink => Hide it");
                accountLink.style.display = 'none';
            }
            
        }
    });




//</script>