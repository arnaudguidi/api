//<script>
// LOCAL MODE
const localMode = false;
//const localMode = true;
//
var historyMode = false;
var historyName = "";
var historyDate = "";
//
const init = () =>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    jobexitID = urlParams.get('id');
    historiqueID = urlParams.get('historique');
    var xmlhttp = new XMLHttpRequest();
    console.log("INIT jobexitID : " + jobexitID);
    console.log("INIT historiqueID : " + historiqueID);
    var url = "";
    if(jobexitID){
        console.log("****** SIMULATION MODE **********")
        var url = "https://hook.integromat.com/ojwk613d949a66hhyfmctc2rf4tw8zrw?id="+jobexitID+"&uid="+currentUserUID;
        // Récupération des données
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if(this.responseText){
                    webHookResponse = this.responseText;
                    obJxt = JSON.parse(this.responseText);
                    go();
                } else {
                    console.log('JSON ERROR');
                    document.querySelector("#erreur-display").style.display = "block";
                    document.querySelector(".wait").style.display = "none";
                    document.querySelector("#page-contents").style.display = "none";
                }
            }
            if(this.readyState == 4 && this.status == 403){
                console.log('ERROR from integromat');
                document.querySelector("#erreur-display").style.display = "block";
                document.querySelector(".wait").style.display = "none";
                document.querySelector("#page-contents").style.display = "none";
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
    //
    if(historiqueID){
        console.log("****** HISTORIQUE MODE ********** : ",historiqueID);
        historyMode = true;
        var limitToOne = 0;
        var simuldocRef = db.collection('simulations').doc(currentUserUID).collection("historique");
        simuldocRef.where("jobexitId", "==", historiqueID).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                limitToOne += 1;
                console.log("historiqueID MODE ",doc.id, ' - jobexitId ', doc.data().jobexitId,' - order ', doc.data().simul_order,' - nom ', doc.data().nom,' - date ', doc.data().date);
                if(limitToOne === 1){
                    historyName = doc.data().nom;
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
                    historyDate = formattedDate(doc.data().date);;
                    var histoData = doc.data().json;
                    obJxt = JSON.parse(histoData);
                    go();
                }
            });
        })
        .catch((error) => {
            console.log("Error getting document:", error);
            document.querySelector("#erreur-display").style.display = "block";
            document.querySelector(".wait").style.display = "none";
            document.querySelector("#page-contents").style.display = "none";
        });
    }

    // 
    if(localMode){
        console.log("****** LOCAL MODE **********")
        // Récupération des données
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                webHookResponse = this.responseText;
                obJxt = JSON.parse(this.responseText);
                go();
            }
        };
        xmlhttp.open("GET", "..././js/integromat.json", true);
        xmlhttp.send();
    }
};

$(document).ready(function () {
    //Show et hide
    cache = function (cible) {
        $(cible).hide();
    };
    montre = function (cible) {
        $(cible).show();
    };

    // Fonction GO quand on a bien reçu les éléments
    go = function () {
        console.log("GO");
        // -- TABLEAU
        // On liste les div conteneurs des champs à remplir
        
        // Infos recap
        IN_recap = document.getElementById('INFOS-recap');
        
        // Tableau
        DE_ind = document.getElementById('DE-ind');
        DE_risk = document.getElementById('DE-risk');
        DE_hyp = document.getElementById('DE-hyp');
        DE_are = document.getElementById('DE-are');

        RC_ind = document.getElementById('RC-ind');
        RC_risk = document.getElementById('RC-risk');
        RC_hyp = document.getElementById('RC-hyp');
        RC_are = document.getElementById('RC-are');

        LE_ind = document.getElementById('LE-ind');
        LE_risk = document.getElementById('LE-risk');
        LE_hyp = document.getElementById('LE-hyp');
        LE_are = document.getElementById('LE-are');

        LI_ind = document.getElementById('LI-ind');
        LI_risk = document.getElementById('LI-risk');
        LI_hyp = document.getElementById('LI-hyp');
        LI_are = document.getElementById('LI-are');

        LF_ind = document.getElementById('LF-ind');
        LF_risk = document.getElementById('LF-risk');
        LF_hyp = document.getElementById('LF-hyp');
        LF_are = document.getElementById('LF-are');

        IP_ind = document.getElementById('IP-ind');
        IP_risk = document.getElementById('IP-risk');
        IP_hyp = document.getElementById('IP-hyp');
        IP_are = document.getElementById('IP-are');

        IN_ind = document.getElementById('IN-ind');
        IN_risk = document.getElementById('IN-risk');
        IN_hyp = document.getElementById('IN-hyp');
        IN_are = document.getElementById('IN-are');

        // Fonctions de lancement du remplissage du tableau
        // DE
        rempDE = function () {
            console.log("** DEM **");
            remplissageCibles(DE_ind, ciIN, obJxt.Tableau_DE.indemnités,2);
            remplissageCibles(DE_risk, ciRI, obJxt.Tableau_DE.risque,2);
            remplissageCibles(DE_hyp, ciHY, obJxt.Tableau_DE.hypothèse,2);
            remplissageCibles(DE_are, ciAR, obJxt.Tableau_DE.are,2);
        }
        // RC
        rempRC = function () {
            console.log("** RC **");
            remplissageCibles(RC_ind, ciIN, obJxt.Tableau_RC.indemnités,2);
            remplissageCibles(RC_risk, ciRI, obJxt.Tableau_RC.risque,2);
            remplissageCibles(RC_hyp, ciHY, obJxt.Tableau_RC.hypothèse,2);
            remplissageCibles(RC_are, ciAR, obJxt.Tableau_RC.are,2);
        }
        // LE
        rempLE = function () {
            console.log("** LE **");
            remplissageCibles(LE_ind, ciIN, obJxt.Tableau_LE.indemnités,2);
            remplissageCibles(LE_risk, ciRI, obJxt.Tableau_LE.risque,2);
            remplissageCibles(LE_hyp, ciHY, obJxt.Tableau_LE.hypothèse,2);
            remplissageCibles(LE_are, ciAR, obJxt.Tableau_LE.are,2);
        }
        // LI
        rempLI = function () {
            console.log("** LI **");
            remplissageCibles(LI_ind, ciIN, obJxt.Tableau_LI.indemnités,2);
            remplissageCibles(LI_risk, ciRI, obJxt.Tableau_LI.risque,2);
            remplissageCibles(LI_hyp, ciHY, obJxt.Tableau_LI.hypothèse,2);
            remplissageCibles(LI_are, ciAR, obJxt.Tableau_LI.are,2);
        }
        // LF
        rempLF = function () {
            console.log("** LF **");
            remplissageCibles(LF_ind, ciIN, obJxt.Tableau_LF.indemnités,2);
            remplissageCibles(LF_risk, ciRI, obJxt.Tableau_LF.risque,2);
            remplissageCibles(LF_hyp, ciHY, obJxt.Tableau_LF.hypothèse,2);
            remplissageCibles(LF_are, ciAR, obJxt.Tableau_LF.are,2);
        }
        // IP
        rempIP = function () {
            console.log("** IP **");
            remplissageCibles(IP_ind, ciIN, obJxt.Tableau_IP.indemnités,2);
            remplissageCibles(IP_risk, ciRI, obJxt.Tableau_IP.risque,2);
            remplissageCibles(IP_hyp, ciHY, obJxt.Tableau_IP.hypothèse,2);
            remplissageCibles(IP_are, ciAR, obJxt.Tableau_IP.are,2);
        }
        // IN
        rempIN = function () {
            console.log("** IN **");
            remplissageCibles(IN_ind, ciIN, obJxt.Tableau_IN.indemnités,2);
            remplissageCibles(IN_risk, ciRI, obJxt.Tableau_IN.risque,2);
            remplissageCibles(IN_hyp, ciHY, obJxt.Tableau_IN.hypothèse,2);
            remplissageCibles(IN_are, ciAR, obJxt.Tableau_IN.are,2);
        }
        // Infos
        remplissageInfos = function () {
            console.log("** INFOS **");
            remplissageCibles(IN_recap, ciInfosSal, obJxt.recap_infos.infos_salaries,0);
            remplissageCibles(IN_recap, ciInfosEnt, obJxt.recap_infos.infos_entreprise,0);
            remplissageCibles(IN_recap, ciInfosRup, obJxt.recap_infos.infos_rupture,0);
        }

        
        // Lancement fonction 2 embed webflow
        go2();
        
    
    }
});

// A EFFACER
//init();

//</script>