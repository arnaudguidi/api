//<script src="https://js.stripe.com/v3/"></script>
//<!-- formules function -->
//<script>

const butForm_1 = document.querySelector('#butForm_1');
const butForm_2 = document.querySelector('#butForm_2');
const butForm_3 = document.querySelector('#butForm_3');
const butForm_4 = document.querySelector('#butForm_4');
const errorMessg = document.querySelector("#errorMessage");
errorMessg.innerHTML = "";

const changeFormule = firebase.functions().httpsCallable('changeFormule');
const createStripeCheckOut = firebase.functions().httpsCallable('createStripeCheckOut');
const createStripeSubscription = firebase.functions().httpsCallable('createStripeSubscription');


// !!!!!!!!!! A REMPLACER PAR LA CLE LIVE !!!!!!!!! //
var stripe = Stripe("");

// Produits
var Produit1 = {
    Prod1NameDoc : 'prod_J8BPZm4IkX9PRj',
    Prod1PriceDoc : 'price_1IVv2EIak1vgL0JKzKHhistn',
    Prod1Id : "price_1IW7JPIak1vgL0JK4mr4tvNl",
}

var Produit2 = {
    Prod2NameDoc : 'prod_J8BPa87YR5jQ9e',
    Prod2PriceDoc : 'price_1IVv2xIak1vgL0JKjcJ5i7Tl',
    Prod2Id : "price_1IW7KOIak1vgL0JK4y4s1Pu8",
}

var Produit3 = {
    Prod3NameDoc : 'prod_J8BQ3j3mhkOP5q',
    Prod3PriceDoc : 'price_1IVv3oIak1vgL0JKXavx4fDs',
    Prod3Id : "price_1IW7L6Iak1vgL0JKcQBHgUgL"
};

var Produit4 = {
    Prod4NameDoc : 'prod_J8BRBrZfhtyCaJ',
    Prod4PriceDoc : 'price_1IVv4UIak1vgL0JKEUognfM4',
    Prod4Id : "price_1IW7LdIak1vgL0JK6x2hPGet"
};

// Load Formules settings
let formule1Data = null;
let formule2Data = null;
let formule3Data = null;
let formule4Data = null;

const formulesSettings = () => {
    console.log('*** settings ***');
    const formdocRef = db.collection('settings').doc('settings_doc');

    formdocRef.get()
    .then(doc => {
        formule1Data = doc.data().formule1;
        formule2Data = doc.data().formule2;
        formule3Data = doc.data().formule3;
        formule4Data = doc.data().formule4;
        return doc;
    })
};

// On va chercher les infos du produit
const productDataRetriever = () => {
    const ProdRef = db.collection('products');
    let nomProduit = "";
    let prixProduit = null;

    ProdRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            if(doc.id === Produit1.Prod1NameDoc){
                console.log("On est dans le produit 1 : ",doc.data().name);
                Produit1.nom = doc.data().name;
            }
            if(doc.id === Produit2.Prod2NameDoc){
                console.log("On est dans le produit 2 : ",doc.data().name);
                Produit2.nom = doc.data().name;
            }
            if(doc.id === Produit3.Prod3NameDoc){
                console.log("On est dans le produit 3 : ",doc.data().name);
                Produit3.nom = doc.data().name;
            }
            if(doc.id === Produit4.Prod4NameDoc){
                console.log("On est dans le produit 4 : ",doc.data().name);
                Produit4.nom = doc.data().name;
            }
        });
    });

    // Prix
    ProdRef.doc(Produit1.Prod1NameDoc).collection('prices').doc(Produit1.Prod1PriceDoc).get().then((doc) => {
        if (doc.exists) {
            var prixProduit = doc.data().unit_amount;
            Produit1.prix = prixProduit;
            console.log("prixProduit 1 : ",prixProduit);
        }
    });
    ProdRef.doc(Produit2.Prod2NameDoc).collection('prices').doc(Produit2.Prod2PriceDoc).get().then((doc) => {
        if (doc.exists) {
            var prixProduit = doc.data().unit_amount;
            Produit2.prix = prixProduit;
            console.log("prixProduit 2 : ",prixProduit);
        }
    });
    ProdRef.doc(Produit3.Prod3NameDoc).collection('prices').doc(Produit3.Prod3PriceDoc).get().then((doc) => {
        if (doc.exists) {
            var prixProduit = doc.data().unit_amount;
            Produit3.prix = prixProduit;
            console.log("prixProduit 3 : ",prixProduit);
        }
    });
    ProdRef.doc(Produit4.Prod4NameDoc).collection('prices').doc(Produit4.Prod4PriceDoc).get().then((doc) => {
        if (doc.exists) {
            var prixProduit = doc.data().unit_amount;
            Produit4.prix = prixProduit;
            console.log("prixProduit 4 : ",prixProduit);
        }
    });    
};

var paymentInfos = {};
const affichagePropObjet = (obj) => {
    for (const property in obj) {
        console.log("affichagePropObjet : ",`${property}: ${obj[property]}`);
      }
}
// On affiche ou cache les boutons en fonction de la formule qu'on a déjà
const checkAndHide = () => {
    console.log('***** checkAndHide ****')
    // Lancement de la recherche d'informations utilisateur
    var docRef = db.collection('users').doc(currentUserUID);
    docRef.get().then((doc) => {
        if (doc.exists) {
            let currentFormule = doc.data().formule;
            paymentInfos.nom = doc.data().nom;
            paymentInfos.prenom = doc.data().prenom;
            paymentInfos.entreprise = doc.data().entreprise;
            paymentInfos.tel = doc.data().tel;
            paymentInfos.siret = doc.data().siret;
            paymentInfos.tva = doc.data().tva;
            paymentInfos.email = doc.data().email;
            affichagePropObjet(paymentInfos);
            console.log("currentFormule : ",currentFormule);
            if(currentFormule === 4){
                butForm_4.style.display = 'none';
            }
            formulesSettings();
            productDataRetriever();
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
};

// Affichage du loader si besoin
const loaderStart = () => {
    const contentToHide = document.querySelector('.page-contents');
    const loader = document.querySelector('.loader');
    contentToHide.style.opacity = '0';
    loader.style.opacity = '1';
}

// Check if fields are all completed before paying
let errorCheckMessg = "";
const checkCompleted = (elements) => {
    console.log("checkCompleted");
    if(!paymentInfos.nom){
        errorCheckMessg += "Nom manquant. Veuillez compléter les informations nécéssaires dans votre compte Jobexit.<br>"
        console.log("nom manquant");
    }
    if(!paymentInfos.prenom){
        errorCheckMessg += "Prénom manquant. Veuillez compléter les informations nécéssaires dans votre compte Jobexit.<br>"
        console.log("prenom manquant");
    }
    if(!paymentInfos.entreprise){
        errorCheckMessg += "Entreprise manquante. Veuillez compléter les informations nécéssaires dans votre compte Jobexit.<br>"
        console.log("entreprise manquant");
    }
    if(!paymentInfos.tel){
        errorCheckMessg += "Numéro de téléphone manquant. Veuillez compléter les informations nécéssaires dans votre compte Jobexit.<br>"
        console.log("tel manquant");
    }
    if(!paymentInfos.siret){
        errorCheckMessg += "Numéro de siret manquant. Veuillez compléter les informations nécéssaires dans votre compte Jobexit.<br>"
        console.log("siret manquant");
    }
    if(!paymentInfos.tva){
        errorCheckMessg += "Numéro de TVA intracommunautaire manquant. Veuillez compléter les informations nécéssaires dans votre compte Jobexit.<br>"
        console.log("tva manquant");
    }
    if(!paymentInfos.email){
        errorCheckMessg += "Email manquant. Veuillez compléter les informations nécéssaires dans votre compte Jobexit.<br>"
        console.log("email manquant");
    }
    if(paymentInfos.nom && paymentInfos.prenom && paymentInfos.entreprise && paymentInfos.tel && paymentInfos.siret && paymentInfos.tva && paymentInfos.email){
        console.log("Toutes les infos sont bonnes on peut payer");
        errorCheckMessg = "";

        var objectToSend = {};
        // On rajoute les éléments de paiement
        for(var k in elements) {
            objectToSend[k]=elements[k];
        }
        // On rajoute les éléments de facturation
        objectToSend.nom = paymentInfos.nom;
        objectToSend.prenom = paymentInfos.prenom;
        objectToSend.entreprise = paymentInfos.entreprise;
        objectToSend.tel = paymentInfos.tel;
        objectToSend.siret = paymentInfos.siret;
        objectToSend.tva = paymentInfos.tva;

        // On lance la paiement
        loaderStart();
        console.log("objectToSend => ");
        affichagePropObjet(objectToSend);
        createStripeCheckOut(objectToSend)
        .then( response => {
            const sessionId = response.data.id;
            stripe.redirectToCheckout({ sessionId: sessionId})
        })
    }
    errorMessg.innerHTML = errorCheckMessg;
}

// Actions sur les boutons
butForm_1.addEventListener('click', (e) => {
    e.preventDefault();
    checkCompleted({ name : Produit1.nom, prix: Produit1.prix, formuleNum : 1, email:currentUser.email});
});

butForm_2.addEventListener('click', (e) => {
    e.preventDefault();
    loaderStart();
    checkCompleted({ name : Produit2.nom, prix: Produit2.prix, formuleNum : 2, email:currentUser.email });
});

butForm_3.addEventListener('click', (e) => {
    e.preventDefault();
    loaderStart();
    checkCompleted({ name : Produit3.nom, prix: Produit3.prix, formuleNum : 3, email:currentUser.email });
});

butForm_4.addEventListener('click', (e) => {
    e.preventDefault();
    loaderStart();
    checkCompleted({ name : Produit4.nom, prix: Produit4.prix, formuleNum : 4 , priceId : Prod4Id, email:currentUser.email});
});

auth.onAuthStateChanged( user => {
    if (user) {
        // User is signed in
        if(!emailVerified){
                console.log("Utilisateur n'a pas encore vérifié son email");
                auth.signOut();
        } else {
            console.log("Page formule");
            document.addEventListener('DOMContentLoaded', checkAndHide());   
        }
    } else {
        auth.signOut();
    }
});



//</script>