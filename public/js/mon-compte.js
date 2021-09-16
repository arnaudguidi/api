//<script>
    const updateHitorique = firebase.functions().httpsCallable('updateHitorique');  
    // On stock les infos de l'utilisateur
    var userData = {};
    var formulesData = {};
    var maxTry = 0;
    // Zones de remplissages des infos de l'utilisateur
    const simulField = document.querySelector('#nbsimulations');
    const simulFieldIllimite = document.querySelector('#nbsimulations-illimite');
    const simulFieldPromo = document.querySelector('#nbsimulations-promo');
    const updateButton = document.querySelector('#updatebutton');
    
    const simulOk = document.querySelector('#simul-ok');
    const simulIllim = document.querySelector('#simul-illim');
    const navSimul = document.querySelector('#navsimul');
    const btnSimul = document.querySelector("#btn-simul-go");

    const nomField = document.querySelector('#nom');
    const prenomlField = document.querySelector('#prenom');
    const entrepriseField = document.querySelector('#entreprise');
    const telField = document.querySelector('#tel');
    const siretField = document.querySelector('#siret');
    const tvaField = document.querySelector('#tva');
    const uploadField = document.querySelector('#upload');
    const emailField = document.querySelector('#email');
    const passwordField = document.querySelector('#mot-de-passe');
    
    const formuleNom = document.querySelector('#formuleNom');
    const formuleNbSimul = document.querySelector('#formuleNbSimul');
    const formulePrix = document.querySelector('#formulePrix');

    const formuleNone = document.querySelector('#formule-none');
    const formuleBlocPrix = document.querySelector('#formule-bloc-prix');

    const historiqueContainer = document.querySelector('#historique-container');
    const historiqueBloc = document.querySelector('#historique-liste');
    historiqueContainer.style.display = "none";

    const warning = document.querySelector("#warningprofil");
    warning.style.display = 'none';

    const errorField = document.querySelector('#errorMessage');

    // champs input
    const inputNom = document.querySelector('#nom');
    inputNom.setAttribute('onchange', 'inputChange()');
    const inputPrenom = document.querySelector('#prenom');
    inputPrenom.setAttribute('onchange', 'inputChange()');
    const inputEntreprise = document.querySelector('#entreprise');
    inputEntreprise.setAttribute('onchange', 'inputChange()');
    const inputTel = document.querySelector('#tel');
    inputTel.setAttribute('onchange', 'inputChange()');
    const inputSiret = document.querySelector('#siret');
    inputSiret.setAttribute('onchange', 'inputChange()');
    const inputTva = document.querySelector('#tva');
    inputTva.setAttribute('onchange', 'inputChange()');
    const inputLogo = document.querySelector('#fileToUpload');
    inputLogo.setAttribute('onchange', 'inputChange(1)');

    // Bouton abonnement
    const btnAbonnement = document.querySelector('#btnabonnement');
    btnAbonnement.style.display = 'none';

    // Logo
    const imglogo = document.querySelector("#imglogo");
    var logo_b64 = "";

    // Loader
    const contentToHide = document.querySelector('.page-contents');
    const loader = document.querySelector('.loader');
    const loaderStart = () => {
        contentToHide.style.opacity = '0';
        loader.style.opacity = '1';
    }
    const loaderStop = () => {
        contentToHide.style.opacity = '1';
        loader.style.opacity = '0';
    }

    // Script d'initialisation après confirmation de l'auth
    var initDone = false;
    const initMoncompte = () => {
        console.log("**** initMoncompte ****");
        emailField.disabled = true;
        passwordField.disabled = true;
        formuleNone.style.display = 'none';
        simulIllim.style.display = 'none';
        //simulOk.style.display = 'none';
        navSimul.style.display = 'none';
        formuleBlocPrix.style.display = 'none';
        errorField.innerHTML = "";
        updateButton.classList.add('disabled');
        updateButton.setAttribute('disabled', '');
        initDone = true;
        findGeneralSettings();
    }
    // On va chercher les settings des formules dans la base
    const findGeneralSettings = () => {

        // Lancement de la recherche d'informations des formules
        console.log('***** findGeneralSettings ****');
        var formdocRef = db.collection('settings').doc('settings_doc');
        formdocRef.get().then((doc) => {
            if (doc.exists) {
                formulesData = doc.data();
                console.log('formulesData : ',formulesData);
                findUserData();
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
    // On va chercher les infos utilisateur
    const findUserData = () => {
        console.log('***** findUserData ****')
        // Lancement de la recherche d'informations utilisateur
        var docRef = db.collection('users').doc(currentUserUID);
        docRef.get().then((doc) => {
            if (doc.exists) {
                userData = doc.data();
                console.log("userData : ",userData);
                formulesUpdate();
            } else {
                console.log("No such document!");
                maxTry += 1;
                if(maxTry < 10){
                   setTimeout('findUserData()', 500) ;
                }
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    // Ecriture de la donnée dans le champ si elle existe
    const writeIfExists = (valeur,cible) => {
        if(valeur && valeur != ""){
            cible.value = valeur;
        } else {
            return;
        }
    }

    // Remplissage des infos utilisateur dans la zone infos
    const fillUserData = () => {
        console.log("**** fillUserData ****");
        
        writeIfExists(userData.nom,nomField);
        writeIfExists(userData.prenom,prenomlField);
        writeIfExists(userData.entreprise,entrepriseField);
        writeIfExists(userData.tel,telField);
        writeIfExists(userData.siret,siretField);
        writeIfExists(userData.tva,tvaField);
        writeIfExists(userData.email,emailField);
        if(userData.logo_url != ''){
            imglogo.src = userData.logo_url;
        }

        if(!userData.nom || !userData.prenom || !userData.entreprise || !userData.siret || !userData.tva){
            console.log("Un des champs requis est manquant");
            warning.style.display = 'block';
        }

        return null;
    }

    // Remplissage des blocs simulations
    const simulsUpdate = () => {
        console.log("**** simulsUpdate ****");
        var simulPromoValue = userData.nb_simul_start;
        var simulValue = userData.nb_simul_left;
        var totalSimul = null;
        if(simulValue !== -1){totalSimul = simulPromoValue+simulValue;};
        if (simulValue === -1){totalSimul = simulPromoValue;};
        
        console.log("Nombre de simulations promotionnelles restantes : ",simulPromoValue);
        console.log("Nombre de simulations restantes : ",simulValue);
        console.log("Nombre total de simulations : ",totalSimul);

        var DontTantGratuites = "";
        var simulMot = "";
        // Si il reste des simulations en promo
        if(simulPromoValue > 0){
            simulOk.style.display = 'block';
            navSimul.style.display = 'block';
            if(simulPromoValue > 1){
                simulMot = " simulations";
                DontTantGratuites = " dont "+simulPromoValue+" gratuites";
            }
            if (simulPromoValue == 1){
                simulPromoValue = "";
                simulMot = " simulation";
                DontTantGratuites = " dont 1 gratuite";
            }
            //simulField.innerHTML = simulPromoValue+simulMot;
            console.log("Il reste des simulations promotionnelles ",simulPromoValue);
        } else {
            
        }

        // Si on a des simulations payantes (ou non)
        if(simulValue === 0){
            console.log("Il n'y a aucune simulation restante ",simulValue);
            simulMot = " simulation";
            //simulOk.style.display = 'none';
        } 
        if(simulValue === -1){
            navSimul.style.display = 'block';
            simulIllim.style.display = 'block';
            simulOk.style.display = 'none';
            console.log("Nombre de simulations illimité ",simulValue);
        } 
        if(simulValue >= 1){
            simulOk.style.display = 'block';
            navSimul.style.display = 'block';
            if(simulValue > 1){
                simulMot = " simulations";
            }
            if (simulValue == 1){
                simulValue = "";
                simulMot = " simulation";
            }
            console.log("Il reste 1 ou plusieurs simulations payantes ",simulValue);
        }
        if(totalSimul > 0){
            simulMot = " simulations";
        }
        simulField.innerHTML = totalSimul+simulMot+DontTantGratuites;

        if(simulValue === 0 && simulPromoValue === 0){
            console.log('Il ne reste aucune simul en promo ou payante');
            btnSimul.style.display = 'none';
            simulField.innerHTML = "Vous n'avez plus de simulation";
        }
        //
        historiqueGet();
        fillUserData();
    }
    
    // Remplissage des formules
    const formulesUpdate = () => {
        console.log("**** formulesUpdate ****");     
        var formuleValue = userData.formule;
        console.log("Type de formule : ",formuleValue);
        if(formuleValue === 0){
            console.log("Gratuit Promo",formuleValue);
            formuleNone.style.display = 'block';
            formuleBlocPrix.style.display = 'none';
        } else if(formuleValue === 1){
            console.log("Payant 1",formuleValue,' - ',formulesData.formule1.Nom);
            formuleNone.style.display = 'none';
            formuleBlocPrix.style.display = 'block';
            formuleNom.innerHTML = formulesData.formule1.Nom;
            formuleNbSimul.innerHTML = formulesData.formule1.Texte_simul;
            formulePrix.innerHTML = formulesData.formule1.Prix;
        } else if(formuleValue === 2){
            console.log("Payant 2",formuleValue,' - ',formulesData.formule2.Nom);
            formuleNone.style.display = 'none';
            formuleBlocPrix.style.display = 'block';
            formuleNom.innerHTML = formulesData.formule2.Nom;
            formuleNbSimul.innerHTML = formulesData.formule2.Texte_simul;
            formulePrix.innerHTML = formulesData.formule2.Prix;
        } else if(formuleValue === 3){
            console.log("Payant 3",formuleValue,' - ',formulesData.formule3.Nom);
            formuleNone.style.display = 'none';
            formuleBlocPrix.style.display = 'block';
            formuleNom.innerHTML = formulesData.formule3.Nom;
            formuleNbSimul.innerHTML = formulesData.formule3.Texte_simul;
            formulePrix.innerHTML = formulesData.formule3.Prix;
        } else if(formuleValue === 4){
            console.log("Payant 4",formuleValue,' - ',formulesData.formule4.Nom);
            formuleNone.style.display = 'none';
            formuleBlocPrix.style.display = 'block';
            formuleNom.innerHTML = formulesData.formule4.Nom;
            formuleNbSimul.innerHTML = formulesData.formule4.Texte_simul;
            formulePrix.innerHTML = formulesData.formule4.Prix;
            btnAbonnement.style.display = 'flex';
        }
        simulsUpdate();   
    }

    
    // Quand on modifie le formulaire on fait apparaitre le bouton et on lance la conversion si image
    function inputChange(imgSelect) {
        console.log('** inputchange');

        // Selecteur d'image
        if(imgSelect === 1){
            var selectedFile = inputLogo.files[0];

            var reader  = new FileReader();
        
            reader.onloadend = function () {
                imglogo.src = reader.result;
            }
            
            if (selectedFile) {
                reader.readAsDataURL(selectedFile);
                selectedFile.convertToBase64(function(base64){
                    logo_b64 = base64;
                });
            } else {
                imglogo.src = "";
            }
        }   
        updateButton.removeAttribute('disabled');
        updateButton.classList.remove('disabled');

    }
    // Convertisseur en base64
    File.prototype.convertToBase64 = function(callback){
        var reader = new FileReader();
        reader.onloadend = function (e) {
            callback(e.target.result, e.target.error);
        };   
        reader.readAsDataURL(this);
    };

    // Update des infos utilisateur
    updateButton.addEventListener('click', (e) => {
        e.preventDefault();
        updateUserInformations();
    });

    // Affichage de la gestion de son abonnement si c'est le cas
    const sendToCustomerPortal = async () => {
        const functionRef = firebase
        .app()
        .functions('europe-west1')
        .httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');
        const { data } = await functionRef({ returnUrl: window.location.origin });
        window.location.assign(data.url);
    };

    // Bouton gestion abonnement
    btnAbonnement.addEventListener('click', (e) => {
        e.preventDefault();
        contentToHide.style.opacity = '0';
        loader.style.opacity = '1';
        sendToCustomerPortal();
    });
    

    // Stripe Addcustomer
    const addCustomerData = functions.httpsCallable('addCustomerData');
    //const BtnTest = document.querySelector("#btn-test");
    const dataToCustomer = {
        email : "arnaud.guidi@gmail.com",
        entreprise : "Guidiz",
        tva : "0000000000",
        line2 : "175 rue Breteuil",
        city : "Marseille",
        postal_code : "13006",
        siret : "111111111",
        nom : "Guidi",
        prenom : "Arnaud",
        customer : "cus_JIQOddFPnXWp4N",
    };
    // BtnTest.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     addCustomerData(dataToCustomer);
    // });

//</script>