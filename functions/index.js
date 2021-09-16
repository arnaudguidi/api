
/* eslint-disable promise/no-nesting */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

var fonts = {
	Roboto: {
		normal: 'fonts/Roboto-Regular.ttf',
		medium: 'fonts/Roboto-Medium.ttf',
        bold: 'Roboto-Bold.ttf'
	},
    Montserrat: {
        thin: 'fonts/Montserrat-Thin.ttf',
        thinitalic: 'fonts/Montserrat-ThinItalic.ttf',
        light: 'fonts/Montserrat-Light.ttf',
        lightitalic: 'fonts/Montserrat-LightItalic.ttf',
		normal: 'fonts/Montserrat-Regular.ttf',
        italic: 'fonts/Montserrat-Italic.ttf',
		medium: 'fonts/Montserrat-Medium.ttf',
        mediumitalic: 'fonts/Montserrat-MediumItalic.ttf',
        bold: 'fonts/Montserrat-Bold.ttf',
        bolditalic: 'fonts/Montserrat-BoldItalic.ttf',
        black: 'fonts/Montserrat-Black.ttf',
        blackitalic :'Montserrat-BlackItalic.ttf'
	}
};

const fs = require('fs');

const {Storage} = require('@google-cloud/storage');
const BUCKET = 'gs://jobexit-pro.appspot.com'; //link found in Storage from Firebase console

admin.initializeApp();
const express = require('express');
const app = express();

const PdfPrinter = require('pdfmake/src/printer');
const printer = new PdfPrinter(fonts);


// Auth trigger (new user signup)
exports.newUserSignUp = functions.auth.user().onCreate(user => {

    const settings = admin.firestore().collection('settings').doc('settings_doc');
    let startSimul = 0;
    
    return settings.get().then(doc => {
        startSimul = doc.data().nb_simul_start;
        
        return admin.firestore().collection('users').doc(user.uid).set({
            email: user.email,
            nb_simul_start: startSimul,
            nb_simul_left: 0,
            nb_simul_done: 0,
            formule: 0,
            nom: "",
            prenom: "",
            entreprise: "",
            tel: "",
            siret: "",
            tva: "",
            logo_url: "",
        });
    });
})


// Auth trigger (user deleted)
exports.userDeleted = functions.auth.user().onDelete(user => {
    const userUID = user.uid;
    const doc = admin.firestore().collection('users').doc(userUID);
    return doc.delete().then(user => {
        const docsubs = admin.firestore().collection('simulations').doc(userUID);
        return docsubs.delete();
    }
    );
})


// https callable function (adding data to the user)
exports.updateUserInfos = functions.https.onCall((data, context) => {
    if(!context.auth){
        throw new functions.https.HttpsError(
        'unauthenticated',
        'Only authenticated users can access this'    
        );
    }
    const user = admin.firestore().collection('users').doc(context.auth.uid);
    let newObj = {
        uid: data.uid,
        nom: data.nom,
        prenom: data.prenom,
        entreprise: data.entreprise,
        tel: data.tel,
        siret: data.siret,
        tva: data.tva,
    }
    if(data.logo_url){
        newObj.logo_url = data.logo_url,
        newObj.logo_b64 = data.logo_b64
    }
    console.log("infos to update");
    for (const property in newObj) {
        console.log(`${property}: ${newObj[property]}`);
    }
    return user.get().then(doc => {
        return user.update(newObj);
    }).catch((error) => {
        console.error("Error writing document: ", error);
    });
});


// Changement de formule
exports.changeFormule = functions.https.onCall((data, context) => {
    if(!context.auth){
        throw new functions.https.HttpsError(
        'unauthenticated',
        'Only authenticated users can access this'    
        );
    }
    var previousFormule = null;
    var userChoice = data.formule;
    var userNbSimulLeft = null;
    var getFormulesData = null;
    var newNbSimulLeft = null;
    // USER
    const user = admin.firestore().collection('users').doc(context.auth.uid);
    return user.get()
    .then(doc => {
        console.log('doc.data().nb_simul_left : ',doc.data().nb_simul_left);
        userNbSimulLeft = doc.data().nb_simul_left;
        previousFormule = doc.data().formule;
        console.log('*** userChoice *** : ',userChoice,' - userNbSimulLeft : ',userNbSimulLeft);
        return userNbSimulLeft;
    })
    // SETTINGS
    .then( userNbSimulLeft => {
        console.log('*** settings ***');
        const formdocRef = admin.firestore().collection('settings').doc('settings_doc');
        return formdocRef.get()
            .then(doc => {
                getFormulesData = doc.data();
                console.log('* getFormulesData * 1: ',getFormulesData.formule1.Nb_simul,' - 2: ',getFormulesData.formule2.Nb_simul,' - 3: ',getFormulesData.formule3.Nb_simul,' - 4: ',getFormulesData.formule4.Nb_simul);
                return getFormulesData;
            });
        }
    )
    .then( getFormulesData => {
        var formuleValue = null;
        console.log('** getFormulesData ** 1: ',getFormulesData.formule1.Nb_simul,' - 2: ',getFormulesData.formule2.Nb_simul,' - 3: ',getFormulesData.formule3.Nb_simul,' - 4: ',getFormulesData.formule4.Nb_simul);
        if(userChoice === 1){
            formuleValue = getFormulesData.formule1.Nb_simul;
            newNbSimulLeft = formuleValue+userNbSimulLeft;}
        else if(userChoice === 2){
            formuleValue = getFormulesData.formule2.Nb_simul;
            newNbSimulLeft = formuleValue+userNbSimulLeft;}
        else if(userChoice === 3){
            formuleValue = getFormulesData.formule3.Nb_simul;
            newNbSimulLeft = formuleValue+userNbSimulLeft;}
        else if(userChoice === 4){
            formuleValue = getFormulesData.formule4.Nb_simul;
            newNbSimulLeft = formuleValue;}

        if(previousFormule === 4){
            newNbSimulLeft = formuleValue;
        }

        console.log('formuleValue : ',formuleValue);
        // Calcul du total des simulations
        console.log(' newNbSimulLeft',newNbSimulLeft);
        return newNbSimulLeft;
    } )
    .then(doc => {
        console.log('END : userChoice : ',userChoice,' - ',newNbSimulLeft);
        return user.update({
            formule: userChoice,
            nb_simul_left: newNbSimulLeft, 
        });
    });
});



// On update les valeurs
const updateSimulations = (data,context) => {
    console.log("updateSimulations");
    // Infos a mettre a jour
    var newObject = {
        date: data.date,
        jobexitId: data.jobexitId,
        json: data.json
    };
    var nBSimulDone = null;

    if(data.nom){
        newObject.nom = data.nom
    } 

    if(newObject){
        // On décrémente le nombre de simulations restantes
        const user = admin.firestore().collection('users').doc(context.auth.uid);
        return user.get()

        .then( (doc) => {
            var numToDecrement = null;
            // Si il reste des simul gratuite on tape dans celles-là
            if(doc.data().nb_simul_start > 0){
                numToDecrement = doc.data().nb_simul_start;
                console.log(context.auth.uid," -> Numero à decrementer sur les promo : ",numToDecrement);
                
                const decrement = admin.firestore.FieldValue.increment(-1);
                user.update({
                    nb_simul_start: decrement
                });
            }
            // Si on a plus de simuls gratuites
            if(doc.data().nb_simul_start === 0){
                console.log("On a plus de simul gratuites");
                numToDecrement = doc.data().nb_simul_left;

                if(numToDecrement > 0 || numToDecrement === -1){
                    console.log(context.auth.uid," -> Numero à decrementer sur les payants : ",numToDecrement);
                    if(numToDecrement>1){
                        const decrement = admin.firestore.FieldValue.increment(-1);
                        user.update({
                            nb_simul_left: decrement
                        });
                    }
                    if(numToDecrement === 1){
                        user.update({
                            nb_simul_left: 0,
                            formule: 0
                        });
                        console.log('utilisateur à 1, passe a 0');
                    }
                    if(numToDecrement === 0){
                        user.update({
                            formule: 0,
                            nb_simul_left: 0
                        });
                        console.log('utilisateur à 0, il reste a 0');
                    }
                    if(numToDecrement === -1){
                        console.log('utilisateur à -1, il reste -1');
                    }
                } else {
                    return
                }
            }
            // Calcul du nombre de simulations réalisées jusqu'à présent
            nBSimulDone = doc.data().nb_simul_done;
            console.log("Nombre de simulations réalisées jusqu'à présent : ",nBSimulDone);
            nBSimulDone += 1;
            console.log("Si on rajoute celle-ci on est à ",nBSimulDone);

            return
        })
        .then( (docname) => {
            // On ajoute le resultat dans simulations dans un doc au nom du user / document simuls
            //var date = new Date
            const simulUser = admin.firestore().collection('simulations').doc(context.auth.uid);
            console.log("Json rajouté aux simulations en Array : ");//,simulUser);
            return simulUser.set(
                {
                    simuls: admin.firestore.FieldValue.arrayUnion(newObject),
                    nb_simul_done : nBSimulDone
                }, { merge: true }
            )
            }
        )
        .then( numToDecrement => {
            // On ajoute le resultat dans simulations dans un doc au nom du user / collection historique / Numero de simul
            console.log("Json rajouté a l'historique : ",nBSimulDone," - user : ",context.auth.uid);
            var ordreTypeTableau = nBSimulDone-1;
            newObject.simul_order = ordreTypeTableau;
            newObject.userID = context.auth.uid;
            var docname = ordreTypeTableau.toString();
            admin.firestore().collection('simulations').doc(context.auth.uid).collection('historique').doc(docname).set(newObject);
            return admin.firestore().collection('simulations').doc(context.auth.uid).update({
                "nb_simul_done": nBSimulDone,
            })
            }
        )
        .then( simulUser => {
            // Mise à jour du nombre de simulations réalisée dans le document du user dans Users
            const userWrite = admin.firestore().collection('users').doc(context.auth.uid);
            console.log("Nombre de simulations totales mis à jour : ",nBSimulDone);
            return userWrite.update({nb_simul_done : nBSimulDone});
        })
        .catch((error) => {
            console.log("Error : ", error);
        });
    } 
    return simulUser;
};
// On va chercher les simulations déjà effectuées et on voit si il y en a une qui a le meme jobexitId. Si oui on décrémente rien. Si non on décrémente
const getSimulationsDone = (data,context) => {
    console.log("getSimulationsDone for user ",context.auth.uid," with this ÌD : ",data.jobexitId);
    var alreadyHere = 0;
    var museums = admin.firestore().collection('simulations').doc(context.auth.uid).collection('historique');
    return museums.get()
    .then((querySnapshot) => {
        return querySnapshot.forEach((doc) => {
            console.log("getSimulationsDone ",doc.id, ' - jobexitId ', doc.data().jobexitId,' - order ', doc.data().simul_order,' - nom ', doc.data().nom,' - date ', doc.data().date);
            if(doc.data().jobexitId === data.jobexitId){
                alreadyHere += 1;
            }
            return alreadyHere;
        });
    }).then((querySnapshot) => {
        if(alreadyHere === 0){
            console.log("** NO MATCH ** -> decrement",alreadyHere)
            updateSimulations(data,context);
        } else {
            console.log("** MATCH ** -> Déjà là no decrement",alreadyHere)
        }
        return alreadyHere;
        }
    )
    .catch((error) => {
        console.log("Error : ", error);
    });
}
// Mise à jour des simulations
exports.addSimulUser = functions.https.onCall((data, context) => {
    if(!context.auth){
        throw new functions.https.HttpsError(
        'unauthenticated',
        'Only authenticated users can access this'    
        );
    }
    console.log("User : ",context.auth.uid);
    //
    getSimulationsDone(data, context);
});



// STRIPE One payment using checkout

exports.createStripeCheckOut = functions.https.onCall( async (data, context) => {

    console.log('*** createStripeCheckOut ***');
    let formuleName = "Formule "+data.name;
    let formulePrice = data.prix;
    let stripePrice = formulePrice;
    let formuleNum = data.formuleNum;
    let userEmail = data.email;
    console.log("userEmail : ",userEmail);
    console.log('Formule Name :',formuleName);
    console.log('Formule Price :',formulePrice);
    // Stripe init
    const stripe = require('stripe')(functions.config().stripe.secret_key);
    const session = await stripe.checkout.sessions.create({
        client_reference_id: context.auth.uid,
        customer_email : userEmail,
        metadata : {
            nom : data.nom,
            prenom : data.prenom,
            entreprise : data.entreprise,
            telephone : data.tel,
            siret : data.siret,
            tva : data.tva,
            email : data.email
        },
        payment_method_types: ['card'],
        line_items: [
            {
            price_data: {
                currency: 'eur',
                product_data: {
                name: formuleName,
                },
                unit_amount: stripePrice,
            },
            quantity: 1,
            //tax_rates: ['txr_1IXuT6Iak1vgL0JKeljGBJpm']
            },
        ],
        mode: 'payment',
        success_url: 'https://www.jobexit.fr/employeur/espace-employeur/formule-success?formule='+formuleNum,
        cancel_url: 'https://www.jobexit.fr/employeur/espace-employeur/mon-compte',
    });
    return {
        id : session.id
    }
});

// Stripe subscription
exports.createStripeSubscription = functions.https.onCall( async (data, context) => {

    console.log('*** createStripeSubscription ***');
    let formuleName = "Formule "+data.name;
    let formulePrice = data.prix;
    let formuleNum = data.formuleNum;
    let priceId = data.priceId;
    let userEmail = data.email;
    console.log('Formule Name :',formuleName);
    console.log('Formule Price :',formulePrice);
    // Stripe init
    const stripe = require('stripe')(functions.config().stripe.secret_key);
    const session = await stripe.checkout.sessions.create({
        client_reference_id: context.auth.uid,
        customer_email : userEmail,
        metadata : {
            nom : data.nom,
            prenom : data.prenom,
            entreprise : data.entreprise,
            telephone : data.tel,
            siret : data.siret,
            tva : data.tva,
            email : data.email
        },
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                // For metered billing, do not pass quantity
                quantity: 1,
                //tax_rates: ['txr_1IXuT6Iak1vgL0JKeljGBJpm']
            },
        ],
        mode: 'subscription',
        success_url: 'https://www.jobexit.fr/employeur/espace-employeur/formule-success?formule='+formuleNum,
        cancel_url: 'https://www.jobexit.fr/employeur/espace-employeur/mon-compte',
    });
    return {
        id : session.id
    }
});

// Stripe : add customer data to stripe
exports.addCustomerData = functions.https.onCall( async (data, context) => {
    if(!context.auth){
        throw new functions.https.HttpsError(
        'unauthenticated',
        'Only authenticated users can access this'    
        );
    }
    const stripe = require('stripe')(functions.config().stripe.secret_key);
    const customer = await stripe.customers.update(
        data.customer,
        {   address: {
                line1 : data.entreprise,
                line2 : data.line2,
                city : data.city,
                postal_code : data.postal_code

            },
            email: data.email,
            name: data.nom+" "+data.prenom,
            metadata: {
                email : data.email,
                tva : data.tva,
                nom : data.nom,
                prenom : data.prenom,
                line1 : data.entreprise,
                line2 : data.line2,
                city : data.city,
                postal_code : data.postal_code,
                siret : data.siret
            }
        }
    );
    const invoiceItem = await stripe.invoiceItems.create({
        customer: data.customer,
        price: 'price_1IW7L6Iak1vgL0JKcQBHgUgL',
    });
    const invoice = await stripe.invoices.create({
        customer: data.customer,
        custom_fields : [
            {name : "entreprise", value : data.entreprise},
            //{name : "adresse", value : data.adresse},
            {name : "siret", value : data.siret},
            {name : "tva", value : data.tva}
        ],
        auto_advance: true, // auto-finalize this draft after ~1 hour
    });
    return console.log("addCustomerData : ", data.customer," - ",data, " to UID :",context.auth.uid);
});
