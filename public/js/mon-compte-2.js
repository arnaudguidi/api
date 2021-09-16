//<script>

var imgUrl = "";

// Historique
const historiqueFiller = () => {
    console.log('******* historiqueFiller ********** ');
    if(historiqueData.length > 0){
        console.log("Historique pas vide");
        historiqueContainer.style.display = "block";
        var alternate = 1;
        for (var i = 0; i < historiqueData.length; i++) {
            // Date
            var newDate = formattedDate(historiqueData[i].date);
            // Style
            var classToPut = "historique-simul-bloc";
            // alternate
            if(alternate === 0){
                alternate = 1
            } else {
                classToPut += " alt";
                alternate = 0
            };
            
            if(i === historiqueData.length-1){
                classToPut += " last";
            };
            // Nom simul
            var nomSimul = "";
            var jbxID = historiqueData[i].jobexitId;
            if(historiqueData[i].hasOwnProperty("nom")){
                console.log("Il y a un nom à cette simulation");
                nomSimul = historiqueData[i].nom;
            } else {
                console.log("Cette simulation n'a pas de nom");
                nomSimul = "Simulation n°"+(i+1);
            }
            console.log("newDate : ",newDate);
            historiqueBloc.innerHTML += `<div class="${[classToPut]}">
                                            <div class="w-layout-grid grid-14">
                                                <div class="historique-simul-nom">${[nomSimul]}</div>
                                                <div class="historique-simul-date">${[newDate]}</div>
                                                <a onclick="historiqueLancher('${[jbxID]}')" id="navsimul" href="#" class="historique-simul-bouton w-button">Voir</a>
                                            </div>
                                        </div>`;
        }
    } else {
        console.log("Historique Vide");
        historiqueContainer.style.display = "none";
    }
}

// Update des infos utilisateur
const updateUserInformations = () =>{
    // Si le bouton est actif
    if (!updateButton.hasAttribute('disabled')) {
        console.log('**** updateButton ****', currentUser, currentUserUID);
        // On lance l'animation
        loaderStart();

        // On va voir si on a une image sélectionnée
        var image = document.querySelector("#fileToUpload").files[0];
        if (image) {
            // On a une image a uploader
            var fileSize = parseFloat(image.size / 1024).toFixed(2);
            console.log(fileSize + " KB.");

            if(fileSize < 2000){
                var imageName = image.name;
                var storageRef = firebase.storage().ref('users/' + currentUserUID + '/' + imageName);

                var uploadTask = storageRef.put(image);

                uploadTask.on('state_changed', function (snapshot) {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("upload is " + progress + " done");
                    }, function (error) {
                    console.log(error.message);
                    }, function () {
                        uploadTask.snapshot.ref.getDownloadURL().then(function (downlaodURL) {
                            //get your upload image url here...
                            imgUrl = downlaodURL;
                            console.log(imgUrl);
                            infosConverter();
                        });
                });
            } else {
                console.log("Fichier trop lourd")
                errorField.innerHTML = "Le poids de votre fichier doit être inférieur à 2Mo";
                return;
            }
        } 
        // On a pas d'image a uploader
        else {
            infosConverter();
        }
    }
};

// Mise en forme des infos à uploader
const infosConverter = (image) => {
    // Infos qui se trouvent dans les champs dans un nouvel objet
    var infosToUpload = {
        uid: currentUserUID,
        nom: nomField.value,
        prenom: prenomlField.value,
        entreprise: entrepriseField.value,
        tel: telField.value,
        siret: siretField.value,
        tva: tvaField.value
    }
    // On a une image a mettre
    if(imgUrl != ""){
        infosToUpload.logo_url = imgUrl ;
        infosToUpload.logo_b64 = logo_b64;
    }
    // On fusionne les anicennes données avec les nouvelles
    var finalObjToupload = Object.assign({}, userData,infosToUpload);
    //
    console.log("finalObjToupload");
    for (const property in finalObjToupload) {
        console.log(`${property}: ${finalObjToupload[property]}`);
    }
    // On lance l'update
    const updateUserInfos = firebase.functions().httpsCallable('updateUserInfos');
    updateUserInfos(finalObjToupload)
    .then(() => {
        document.location.reload();
    })
    .catch(err => {
        errorField.innerHTML = err.message;
    })
};

// Date
const formattedDate = (d)=> {
    console.log("formattedDate");
    let datetoconvert = new Date(d);
    let month = String(datetoconvert.getMonth() + 1);
    let day = String(datetoconvert.getDate());
    const year = String(datetoconvert.getFullYear());
    
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    
    return `${day}/${month}/${year}`;
}

// Historique on lance la page resultat
var historiqueData = [];

// Collection historique
const historiqueGet = () => {
    console.log('******* historiqueGet ********** ',currentUserUID);
    db.collection("simulations/" + currentUserUID + "/historique").orderBy("date", "desc").get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            //console.log("doc.id : ",doc.id);
            historiqueData.push(doc.data());
        });
        //const sortedHistorique = historiqueData.sort((a, b) => new Date(b.date) - new Date(a.date));
        historiqueFiller();
    })
    .catch((error) => {
            console.log("Error getting documents: ", error);
            console.log("Historique Vide");
            historiqueContainer.style.display = "none";
    });
}

const historiqueLancher = (numero) => {
    console.log('******* historiqueLancher : ',numero,' ********** ');
    if(numero){
        var newPage = resultatPage+"?historique="+numero;
        console.log('newPage : ',newPage);
        loaderStart();
        window.location.replace(newPage);
    }
}


//</script>