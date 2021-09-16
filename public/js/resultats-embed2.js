//<script>
function ready3(callback) {
    // in case the document is already rendered
    if (document.readyState != 'loading') callback();
    // modern browsers
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    // IE <= 8
    else document.attachEvent('onreadystatechange', function () {
        if (document.readyState == 'complete') callback();
    });
}

ready3(function () {
    go3 = function () {
        console.log('\n',"GO 3");
        // *** En Savoir Plus ***
        // Conteneurs en savoir plus
        EspDE = document.getElementById('espDE');
        EspRC = document.getElementById('espRC');
        EspLE = document.getElementById('espLE');
        EspLI = document.getElementById('espLI');
        // On cache les esp qui ne sont pas affichés
        cache(EspDE);
        cache(EspRC);
        cache(EspLE);
        cache(EspLI);

        // Fonction qui cache les csp
        const cacheCSP = (csp,element) => {
            //console.log('cacheCSP : ',csp,' - element : ',element);
            var cspPreCsp = element.querySelector('.esp-inde-pre-csp');
            var cspPre = element.querySelector('.esp-inde-pre');
            var cspRembCsp = element.querySelector('.esp-remb-pre-csp');
            var cspRemb = element.querySelector('.esp-remb-pre');
            var cspAreCsp = element.querySelector('.esp-remb-are-csp');
            var cspAre = element.querySelector('.esp-remb-are');
            
            if(csp === true){
                console.log('cacheCSP csp == TRUE');
                cspPre.style.display = 'none';
                cspRemb.style.display = 'none';
                cspAre.style.display = 'none';
            } else {
                console.log('cacheCSP csp == FALSE');
                cspPreCsp.style.display = 'none';
                cspRembCsp.style.display = 'none';
                cspAreCsp.style.display = 'none';
            }
        };

        // Fonction qui cache la contribution Pole emploi dans le tableau
        const cacheContPoleTableau = (csp,element) => {
            //console.log('cacheContPoleTableau : ',csp,' - element : ',element);
            let contPolEmp = element.querySelector('.cont-pol-emp'); 
            if(csp === true){
                console.log('cacheContPoleTableau csp == TRUE');
                contPolEmp.style.display = 'flex';
            } else {
                console.log('cacheContPoleTableau csp == FALSE');
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

        // Fonction qui cache le 3e bloc dans l'ARE de l'ESP
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

        // Fonction qui cache la zone indemnite licenciement démission dans l'ESP
        const cacheDem = (element,indem) => {
            //console.log('cacheDem : ',indem,' - element : ',element);
            var demNoContentBloc = element.querySelector('.esp-inde-lic-no');
            var demHasContentBloc = element.querySelector('.esp-inde-lic');
            var demContent = indem[0];
            //console.log("demContent : ",demContent);
            if(demContent === null){
                console.log('DEM licenciement NO content');
                demNoContentBloc.style.display = 'block';
                demHasContentBloc.style.display = 'none';
            } else {
                console.log('DEM licenciement has content');
                demNoContentBloc.style.display = 'none';
                demHasContentBloc.style.display = 'block';
            }
        };

        //On update le csp
        cspDE = obJxt.ESP_DE.csp[0];
        cspRC = obJxt.ESP_RC.csp[0];
        cspLE = obJxt.ESP_LE.csp[0];
        cspLI = obJxt.ESP_LI.csp[0];

        // Démission
        espDE = function (item) {
            console.log('\n',"** ESP DEM **");
            remplissageCibles(EspDE, ciEspInLic, obJxt.ESP_DE.licenciement,0);
            remplissageCibles(EspDE, ciEspInCp, obJxt.ESP_DE.congés_payés,0);
            remplissageCibles(EspDE, ciEspInPrCSP, obJxt.ESP_DE.préavis,0);
            remplissageCibles(EspDE, ciEspInPr, obJxt.ESP_DE.préavis,0);
            remplissageCibles(EspDE, ciEspInCo, obJxt.ESP_DE.contribution_Pôle_Emploi,0);
            remplissageCibles(EspDE, ciEspInRe, obJxt.ESP_DE.reclassement,0);
            remplissageCibles(EspDE, ciEspRi, obJxt.ESP_DE.risque,2);
            remplissageCibles(EspDE, ciEspPr, obJxt.ESP_DE.indemnités_prudhomales,0);
            remplissageCibles(EspDE, ciEspReCpCSP, obJxt.ESP_DE.remboursement_préavis_CP,0);
            remplissageCibles(EspDE, ciEspReCp, obJxt.ESP_DE.remboursement_préavis_CP,0);
            remplissageCibles(EspDE, ciEspRiLi, obJxt.ESP_DE.risque_licenciement,0);
            remplissageCibles(EspDE, ciEspReArCSP, obJxt.ESP_DE.remboursement_ARE,0);
            remplissageCibles(EspDE, ciEspReAr, obJxt.ESP_DE.remboursement_ARE,0);
            remplissageCibles(EspDE, ciEspRaHs, obJxt.ESP_DE.remboursement_HS,0);
            remplissageCibles(EspDE, ciEspRp, obJxt.ESP_DE.remboursement_primes,0);
            remplissageCibles(EspDE, ciEspHyp, obJxt.ESP_DE.hypothèse,2);
            remplissageCibles(EspDE, ciEspAr, obJxt.ESP_DE.ARE,0);
            cacheCSP(cspDE,EspDE);
            cacheContPoleTableau(cspDE,DE_ind);
            cacheCongeReclassementTableau(cspDE,DE_ind);
            cacheAreThird(EspDE,obJxt.ESP_DE.ARE);
            cacheDem(EspDE,obJxt.ESP_DE.licenciement)
        }
        
        // Rupture conventionnelle
        espRC = function (item) {
            console.log('\n',"** ESP RC **");
            cspRC = obJxt.ESP_RC.csp[0];
            remplissageCibles(EspRC, ciEspInLic, obJxt.ESP_RC.licenciement,0);
            remplissageCibles(EspRC, ciEspInCp, obJxt.ESP_RC.congés_payés,0);
            remplissageCibles(EspRC, ciEspInPrCSP, obJxt.ESP_RC.préavis,0);
            remplissageCibles(EspRC, ciEspInPr, obJxt.ESP_RC.préavis,0);
            remplissageCibles(EspRC, ciEspInCo, obJxt.ESP_RC.contribution_Pôle_Emploi,0);
            remplissageCibles(EspRC, ciEspInRe, obJxt.ESP_RC.reclassement,0);
            remplissageCibles(EspRC, ciEspRi, obJxt.ESP_RC.risque,2);
            remplissageCibles(EspRC, ciEspPr, obJxt.ESP_RC.indemnités_prudhomales,0);
            remplissageCibles(EspRC, ciEspReCpCSP, obJxt.ESP_RC.remboursement_préavis_CP,0);
            remplissageCibles(EspRC, ciEspReCp, obJxt.ESP_RC.remboursement_préavis_CP,0);
            remplissageCibles(EspRC, ciEspRiLi, obJxt.ESP_RC.risque_licenciement,0);
            remplissageCibles(EspRC, ciEspReArCSP, obJxt.ESP_RC.remboursement_ARE,0);
            remplissageCibles(EspRC, ciEspReAr, obJxt.ESP_RC.remboursement_ARE,0);
            remplissageCibles(EspRC, ciEspRaHs, obJxt.ESP_RC.remboursement_HS,0);
            remplissageCibles(EspRC, ciEspRp, obJxt.ESP_RC.remboursement_primes,0);
            remplissageCibles(EspRC, ciEspHyp, obJxt.ESP_RC.hypothèse,2);
            remplissageCibles(EspRC, ciEspAr, obJxt.ESP_RC.ARE,0);
            cacheCSP(cspRC,EspRC);
            cacheContPoleTableau(cspRC,RC_ind);
            cacheCongeReclassementTableau(cspRC,RC_ind);
            cacheAreThird(EspRC,obJxt.ESP_RC.ARE);
        }

        // Rupture conventionnelles
        espLE = function (item) {
            console.log('\n',"** ESP LE **");
            cspLE = obJxt.ESP_LE.csp[0];
            remplissageCibles(EspLE, ciEspInLic, obJxt.ESP_LE.licenciement,0);
            remplissageCibles(EspLE, ciEspInCp, obJxt.ESP_LE.congés_payés,0);
            remplissageCibles(EspLE, ciEspInPrCSP, obJxt.ESP_LE.préavis,0);
            remplissageCibles(EspLE, ciEspInPr, obJxt.ESP_LE.préavis,0);
            remplissageCibles(EspLE, ciEspInCo, obJxt.ESP_LE.contribution_Pôle_Emploi,0);
            remplissageCibles(EspLE, ciEspInRe, obJxt.ESP_LE.reclassement,0);
            remplissageCibles(EspLE, ciEspRi, obJxt.ESP_LE.risque,2);
            remplissageCibles(EspLE, ciEspPr, obJxt.ESP_LE.indemnités_prudhomales,0);
            remplissageCibles(EspLE, ciEspReCpCSP, obJxt.ESP_LE.remboursement_préavis_CP,0);
            remplissageCibles(EspLE, ciEspReCp, obJxt.ESP_LE.remboursement_préavis_CP,0);
            remplissageCibles(EspLE, ciEspRiLi, obJxt.ESP_LE.risque_licenciement,0);
            remplissageCibles(EspLE, ciEspReArCSP, obJxt.ESP_LE.remboursement_ARE,0);
            remplissageCibles(EspLE, ciEspReAr, obJxt.ESP_LE.remboursement_ARE,0);
            remplissageCibles(EspLE, ciEspRaHs, obJxt.ESP_LE.remboursement_HS,0);
            remplissageCibles(EspLE, ciEspRp, obJxt.ESP_LE.remboursement_primes,0);
            remplissageCibles(EspLE, ciEspHyp, obJxt.ESP_LE.hypothèse,2);
            remplissageCibles(EspLE, ciEspAr, obJxt.ESP_LE.ARE,0);
            cacheCSP(cspLE,EspLE);
            cacheContPoleTableau(cspLE,LE_ind);
            cacheCongeReclassementTableau(cspLE,LE_ind);
            cacheAreThird(EspLE,obJxt.ESP_LE.ARE);
        }

        // Rupture conventionnelles
        espLI = function (item) {
            console.log('\n',"** ESP LI **");
            cspLI = obJxt.ESP_LI.csp[0];
            remplissageCibles(EspLI, ciEspInLic, obJxt.ESP_LI.licenciement,0);
            remplissageCibles(EspLI, ciEspInCp, obJxt.ESP_LI.congés_payés,0);
            remplissageCibles(EspLI, ciEspInPrCSP, obJxt.ESP_LI.préavis,0);
            remplissageCibles(EspLI, ciEspInPr, obJxt.ESP_LI.préavis,0);
            remplissageCibles(EspLI, ciEspInCo, obJxt.ESP_LI.contribution_Pôle_Emploi,0);
            remplissageCibles(EspLI, ciEspInRe, obJxt.ESP_LI.reclassement,0);
            remplissageCibles(EspLI, ciEspRi, obJxt.ESP_LI.risque,2);
            remplissageCibles(EspLI, ciEspPr, obJxt.ESP_LI.indemnités_prudhomales,0);
            remplissageCibles(EspLI, ciEspReCpCSP, obJxt.ESP_LI.remboursement_préavis_CP,0);
            remplissageCibles(EspLI, ciEspReCp, obJxt.ESP_LI.remboursement_préavis_CP,0);
            remplissageCibles(EspLI, ciEspRiLi, obJxt.ESP_LI.risque_licenciement,0);
            remplissageCibles(EspLI, ciEspReArCSP, obJxt.ESP_LI.remboursement_ARE,0);
            remplissageCibles(EspLI, ciEspReAr, obJxt.ESP_LI.remboursement_ARE,0);
            remplissageCibles(EspLI, ciEspRaHs, obJxt.ESP_LI.remboursement_HS,0);
            remplissageCibles(EspLI, ciEspRp, obJxt.ESP_LI.remboursement_primes,0);
            remplissageCibles(EspLI, ciEspHyp, obJxt.ESP_LI.hypothèse,2);
            remplissageCibles(EspLI, ciEspAr, obJxt.ESP_LI.ARE,0);
            cacheCSP(cspLI,EspLI);
            cacheContPoleTableau(cspLI,LI_ind);
            cacheCongeReclassementTableau(cspLI,LI_ind);
            cacheAreThird(EspLI,obJxt.ESP_LI.ARE);
        }
        
        // Remplissage des en savoir plus
        espDE();
        espRC();
        espLE();
        espLI();
        
        // GO4
        go4();
    }

});
//</script>