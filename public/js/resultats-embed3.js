//<script>
function ready4(callback) {
    // in case the document is already rendered
    if (document.readyState != 'loading') callback();
    // modern browsers
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    // IE <= 8
    else document.attachEvent('onreadystatechange', function () {
        if (document.readyState == 'complete') callback();
    });
}
const findUserData = () => {
    console.log('***** findUserData ****')
    // Lancement de la recherche d'informations utilisateur
    var docRef = db.collection('users').doc(currentUserUID);
    docRef.get().then((doc) => {
        if (doc.exists) {
            userData = doc.data();
            if(userData.logo_b64){
                imglogo.src = userData.logo_b64;
            }
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

ready4(function () {

    go4 = function () {
        console.log('\n',"GO 4");

        // Logo
        const imglogo = document.querySelector("#imglogo");

        // *** En Savoir Plus SUITE***
        // Conteneurs en savoir plus
        
        EspLF = document.getElementById('espLF');
        EspIP = document.getElementById('espIP');
        EspIN = document.getElementById('espIN');
        
        cache(EspLF);
        cache(EspIP);
        cache(EspIN);

        // Fonction qui cache les csp
        const cacheCSP = (csp,element) => {
            //console.log('cacheCSP : ',csp,' - element : ',element);
            var cspPreCsp = element.querySelector('.esp-inde-pre-csp');
            var cspPre = element.querySelector('.esp-inde-pre');
            var cspRembCsp = element.querySelector('.esp-remb-pre-csp');
            var cspRemb = element.querySelector('.esp-remb-pre');
            var cspAreCsp = element.querySelector('.esp-remb-are-csp');
            var cspAre = element.querySelector('.esp-remb-are');
            
            if(csp == true){
                console.log('csp == TRUE');
                cspPre.style.display = 'none';
                cspRemb.style.display = 'none';
                cspAre.style.display = 'none';
            } else {
                console.log('csp == FALSE');
                cspPreCsp.style.display = 'none';
                cspRembCsp.style.display = 'none';
                cspAreCsp.style.display = 'none';
            }
        };

        // Fonction qui cache la contribution Pole emploi
        const cacheContPoleTableau = (csp,element) => {
            //console.log('cacheContPoleTableau : ',csp,' - element : ',element);
            let contPolEmp = element.querySelector('.cont-pol-emp');
            
            if(csp === true){
                console.log('csp == TRUE');
                contPolEmp.style.display = 'flex';
            } else {
                console.log('csp == FALSE');
                contPolEmp.style.display = 'none';
            }
        }

        // Fonction qui cache le congé de reclassement dans le tableau
        const cacheCongeReclassementTableau = (csp,element) => {
            //console.log('cacheCongeReclassementTableau : ',csp,' - element : ',element);
            let congReclass = element.querySelector('.conge-reclass'); 
            if(csp === true){
                console.log('cacheCongeReclassementTableau csp == TRUE');
                congReclass.style.display = 'flex';
            } else {
                console.log('cacheCongeReclassementTableau csp == FALSE');
                congReclass.style.display = 'none';
            }
        }

        // Fonction qui cache le 3e ARE
        const cacheAreThird = (element,are) => {
            //console.log('cacheAreThird : ',are,' - element : ',element);
            var areThird = element.querySelector('.are-res-3');
            var trueOrFalse = are[19];
            //console.log("trueOrFalse : ",trueOrFalse);
            if(trueOrFalse != null && trueOrFalse != ""){
                console.log('are third exists');
                areThird.style.display = 'flex';
            } else {
                console.log('are third NOT exists');
                areThird.style.display = 'none';
            }
        };

        //On update le csp
        cspLF = obJxt.ESP_LF.csp[0];
        cspIP = obJxt.ESP_IP.csp[0];
        cspIN = obJxt.ESP_IN.csp[0];

        // Rupture conventionnelles
        espLF = function (item) {
            console.log('\n',"** ESP LF **");
            cspLF = obJxt.ESP_LF.csp[0];
            remplissageCibles(EspLF, ciEspInLic, obJxt.ESP_LF.licenciement,0);
            remplissageCibles(EspLF, ciEspInCp, obJxt.ESP_LF.congés_payés,0);
            remplissageCibles(EspLF, ciEspInPrCSP, obJxt.ESP_LF.préavis,0);
            remplissageCibles(EspLF, ciEspInPr, obJxt.ESP_LF.préavis,0);
            remplissageCibles(EspLF, ciEspInCo, obJxt.ESP_LF.contribution_Pôle_Emploi,0);
            remplissageCibles(EspLF, ciEspInRe, obJxt.ESP_LF.reclassement,0);
            remplissageCibles(EspLF, ciEspRi, obJxt.ESP_LF.risque,2);
            remplissageCibles(EspLF, ciEspPr, obJxt.ESP_LF.indemnités_prudhomales,0);
            remplissageCibles(EspLF, ciEspReCpCSP, obJxt.ESP_LF.remboursement_préavis_CP,0);
            remplissageCibles(EspLF, ciEspReCp, obJxt.ESP_LF.remboursement_préavis_CP,0);
            remplissageCibles(EspLF, ciEspRiLi, obJxt.ESP_LF.risque_licenciement,0);
            remplissageCibles(EspLF, ciEspReArCSP, obJxt.ESP_LF.remboursement_ARE,0);
            remplissageCibles(EspLF, ciEspReAr, obJxt.ESP_LF.remboursement_ARE,0);
            remplissageCibles(EspLF, ciEspRaHs, obJxt.ESP_LF.remboursement_HS,0);
            remplissageCibles(EspLF, ciEspRp, obJxt.ESP_LF.remboursement_primes,0);
            remplissageCibles(EspLF, ciEspHyp, obJxt.ESP_LF.hypothèse,2);
            remplissageCibles(EspLF, ciEspAr, obJxt.ESP_LF.ARE,0);
            cacheCSP(cspLF,EspLF);
            cacheContPoleTableau(cspLF,LF_ind);
            cacheCongeReclassementTableau(cspLF,LF_ind);
            cacheAreThird(EspLF,obJxt.ESP_LF.ARE);
        }

        // Rupture conventionnelles
        espIP = function (item) {
            console.log('\n',"** ESP IP **");
            cspIP = obJxt.ESP_IP.csp[0];
            remplissageCibles(EspIP, ciEspInLic, obJxt.ESP_IP.licenciement,0);
            remplissageCibles(EspIP, ciEspInCp, obJxt.ESP_IP.congés_payés,0);
            remplissageCibles(EspIP, ciEspInPrCSP, obJxt.ESP_IP.préavis,0);
            remplissageCibles(EspIP, ciEspInPr, obJxt.ESP_IP.préavis,0);
            remplissageCibles(EspIP, ciEspInCo, obJxt.ESP_IP.contribution_Pôle_Emploi,0);
            remplissageCibles(EspIP, ciEspInRe, obJxt.ESP_IP.reclassement,0);
            remplissageCibles(EspIP, ciEspRi, obJxt.ESP_IP.risque,2);
            remplissageCibles(EspIP, ciEspPr, obJxt.ESP_IP.indemnités_prudhomales,0);
            remplissageCibles(EspIP, ciEspReCpCSP, obJxt.ESP_IP.remboursement_préavis_CP,0);
            remplissageCibles(EspIP, ciEspReCp, obJxt.ESP_IP.remboursement_préavis_CP,0);
            remplissageCibles(EspIP, ciEspRiLi, obJxt.ESP_IP.risque_licenciement,0);
            remplissageCibles(EspIP, ciEspReArCSP, obJxt.ESP_IP.remboursement_ARE,0);
            remplissageCibles(EspIP, ciEspReAr, obJxt.ESP_IP.remboursement_ARE,0);
            remplissageCibles(EspIP, ciEspRaHs, obJxt.ESP_IP.remboursement_HS,0);
            remplissageCibles(EspIP, ciEspRp, obJxt.ESP_IP.remboursement_primes,0);
            remplissageCibles(EspIP, ciEspHyp, obJxt.ESP_IP.hypothèse,2);
            remplissageCibles(EspIP, ciEspAr, obJxt.ESP_IP.ARE,0);
            cacheCSP(cspIP,EspIP);
            cacheContPoleTableau(cspIP,IP_ind);
            cacheCongeReclassementTableau(cspIP,IP_ind);
            cacheAreThird(EspIP,obJxt.ESP_IP.ARE);
        }

        // Rupture conventionnelles
        espIN = function (item) {
            console.log('\n',"** ESP IN **");
            cspIN = obJxt.ESP_IN.csp[0];
            remplissageCibles(EspIN, ciEspInLic, obJxt.ESP_IN.licenciement,0);
            remplissageCibles(EspIN, ciEspInCp, obJxt.ESP_IN.congés_payés,0);
            remplissageCibles(EspIN, ciEspInPrCSP, obJxt.ESP_IN.préavis,0);
            remplissageCibles(EspIN, ciEspInPr, obJxt.ESP_IN.préavis,0);
            remplissageCibles(EspIN, ciEspInCo, obJxt.ESP_IN.contribution_Pôle_Emploi,0);
            remplissageCibles(EspIN, ciEspInRe, obJxt.ESP_IN.reclassement,0);
            remplissageCibles(EspIN, ciEspRi, obJxt.ESP_IN.risque,2);
            remplissageCibles(EspIN, ciEspPr, obJxt.ESP_IN.indemnités_prudhomales,0);
            remplissageCibles(EspIN, ciEspReCpCSP, obJxt.ESP_IN.remboursement_préavis_CP,0);
            remplissageCibles(EspIN, ciEspReCp, obJxt.ESP_IN.remboursement_préavis_CP),0;
            remplissageCibles(EspIN, ciEspRiLi, obJxt.ESP_IN.risque_licenciement,0);
            remplissageCibles(EspIN, ciEspReArCSP, obJxt.ESP_IN.remboursement_ARE,0);
            remplissageCibles(EspIN, ciEspReAr, obJxt.ESP_IN.remboursement_ARE,0);
            remplissageCibles(EspIN, ciEspRaHs, obJxt.ESP_IN.remboursement_HS,0);
            remplissageCibles(EspIN, ciEspRp, obJxt.ESP_IN.remboursement_primes,0);
            remplissageCibles(EspIN, ciEspHyp, obJxt.ESP_IN.hypothèse,2);
            remplissageCibles(EspIN, ciEspAr, obJxt.ESP_IN.ARE,0);
            cacheCSP(cspIN,EspIN);
            cacheContPoleTableau(cspIN,IN_ind);
            cacheCongeReclassementTableau(cspIN,IN_ind);
            cacheAreThird(EspIN,obJxt.ESP_IN.ARE);
        }
        

        // Lancement remplissage du tableau
        toogleTable();
        // Lancement remplissage du recap
        remplissageInfos();
        // Remplissage des en savoir plus
        espLF();
        espIP();
        espIN();
         // GO5
        go5();
    }
});
//</script>