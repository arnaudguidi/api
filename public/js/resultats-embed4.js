//<script>
function ready5(callback) {
    // in case the document is already rendered
    if (document.readyState != 'loading') callback();
    // modern browsers
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    // IE <= 8
    else document.attachEvent('onreadystatechange', function () {
        if (document.readyState == 'complete') callback();
    });
}

ready5(function () {

    go5 = function () {
        console.log('\n',"GO 5");
        // Popin cache
		const poPin = document.querySelector('.popin');
        const popinCloseBtn = document.querySelector('.popin-close');
        const popinCloseBack = document.querySelector('.popin-back');
		const modalWrapper = document.querySelector('.modal-wrapper');
        const pageContents = document.querySelector('.page-contents');
        const historyBloc = document.querySelector("#history-bloc");
        historyBloc.style.display = "none";
        // Popin
        // Ouvre le volet
		openPopin = function(e){
			console.log('openPopin');
            poPin.style.display = 'block';
            //modalWrapper.css('overflow-x', 'hidden');
            //pageContents.css('overflow-x', 'hidden');
			//pageContents.css('overflow','hidden');
		}
		// Ferme le volet
		closePopin = function(){
            console.log('close');
            poPin.style.display = 'none';
		}   

        popinCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('click');
            closePopin();
        });
        popinCloseBack.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('back');
            closePopin();
        });
        //Nom et date de l'historique
        const historyNameFiller = () => {
            // Si historique => nom et date
            console.log("historyNameFiller");
            const historyNameBloc = document.querySelector("#history-name");
            const historyDateBloc = document.querySelector("#history-date");
            if(historyMode){
                historyBloc.style.display = "block";
                historyDateBloc.innerHTML = historyDate;
                //console.log("Date de la simul : ",historyDate);
                if(historyName == undefined || historyName == ""){
                    //console.log("Le nom est undefined => on cache");
                    historyNameBloc.style.display = "none";
                } else {
                    //console.log("Nom de la simul : ",historyName);
                    historyNameBloc.innerHTML = historyName;
                }
            } else {
                historyBloc.style.display = "none";
            }
        }
        // Quand tout est affiché => on affiche tout et on sauvegarde le resultat
        const startToSee = () => {
            console.log("Affichage");
            findUserData();
            // Cache la popin
            cache('.popin');
            // Affichage
            cache(".wait");
            cache("#erreur-display");
            montre(".page-contents");
            document.querySelector('.navbar-container.fixed').style = "display:block;translate3d(0px, 0px, 0px)";
            montre("#footer");
            if(historyMode){
                document.querySelector("#history-name").innerHTML = "";
                document.querySelector("#history-date").innerHTML = "";
                historyNameFiller();
            }
            // Timeout Popin   
            setTimeout(openPopin,90000);
            // Enregistrement        
            if(jobexitID){
                var dateMaintenant = new Date();
                var dateToSave = dateMaintenant.toString();
                var nameToSave = obJxt.nom;
                var objToSave = null;
                // Si on a un nom personnalisé on le sauvegarde
                if(nameToSave){
                    objToSave = {
                        date : dateToSave,
                        json : webHookResponse,
                        jobexitId : jobexitID,
                        nom : nameToSave
                    }
                } else {
                    // Pas de nom personnalisé
                    objToSave = {
                        date : dateToSave,
                        json : webHookResponse,
                        jobexitId : jobexitID
                    }
                }
                console.log("Simul mode : dateToSave : ",dateToSave," - jobexitID : ",jobexitID," - nameToSave : ",nameToSave," - objToSave : ",objToSave);
                // Send to Firestore
                if (objToSave){
                    const addSimulUser = firebase.functions().httpsCallable('addSimulUser');
                    addSimulUser(objToSave)
                    .catch(err => {
                        console.log('ERROR addSimulUser : ',err.message);
                    });
                }
                
                
            } else {
                console.log("History or local mode : not saving");
            }
        };
        //
        // PDF
        //bouton
        const boutonPdf = document.querySelector('#pdfBouton');

        boutonPdf.addEventListener('click', (e) => {
            e.preventDefault();
            boutonPdf.style.display = 'none';
            console.log('CLICK PDF');

            generatePdf();
        });

        const boutonPdf2 = document.querySelector('#pdfBouton2');
        boutonPdf2.addEventListener('click', (e) => {
            e.preventDefault();
            boutonPdf2.style.display = 'none';
            console.log('CLICK PDF 2')
            setTimeout(generatePdf, 1000);
        });


        const generatePdf = () => {
            // Get the element.
            
            var titrePDF = document.querySelector('.resultat-titre-page')
            var tableau = document.querySelector('.w-layout-grid.resultat-employeur-tableau-grille.pdf');
            var blocInfos = document.querySelector('.resultat-details-bloc-infos.space-top.space-bottom.pdf');
            var blocRappel = document.querySelector('#rappel-infos');
            

            pages[0] = titrePDF;
            pages[1] = tableau;
            pages[2] = blocInfos;
            pages[3] = blocRappel;

            console.log('PDF : ',pages);
            var opt = {
                margin: 10,
                filename: 'jobexit.pdf',
                html2canvas: { scale: 2 ,useCORS: true },
                jsPDF: {orientation: 'portrait', unit: 'mm', format: 'A3', compressPDF: true}
            }

            var worker = html2pdf().set(opt).from(pages[0]).toPdf();
            pages.slice(1).forEach(function (page) {
                worker = worker.get('pdf').then(function (pdf) {
                    pdf.addPage();
                }).from(page).toContainer().toCanvas().toPdf();
            });
            worker = worker.save().then(function (pdf) {
                console.log("PDF Terminé");
                boutonPdf.style.display = 'flex';
                boutonPdf2.style.display = 'flex';
                }  
            );
        }
    //
    startToSee();
    }

});
//</script>