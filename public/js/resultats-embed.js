//<script>
function ready2(callback) {
    if (document.readyState != 'loading') callback(); else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    else document.attachEvent('onreadystatechange', function () {if (document.readyState == 'complete') callback();});
}

ready2(function () {
    go2 = function () {
        console.log('\n',"GO 2");
        //
        // On défini l'array des elements à mettre dans le pdf en fonction des filtres (utilisé dans les boutons)
        const populArrayPdf = (ref, activ) => {
            //console.log('######### populArrayPdf : ',activ)
            if(activ){
                console.log('Element à mettre dans le pdf :',ref);
                pages.indexOf(ref) === -1 ? pages.push(ref) : console.log("This item already exists : ",ref);
            } else {
                //console.log('Element à enlever du pdf :',ref);
                const index = pages.indexOf(ref);
                if (index > -1) {
                pages.splice(index, 1);
                }
            }
            //console.log('Pages : ',pages);
        };
        //
        // Liste de la strucutre html des cellules du tableau
        let tbTitre =   '<div class="api-tb-titre">'+
                            '<div class="api-tb-titre-txt">'+
                                'licenciement pour motif économique'+
                            '</div>'+
                        '</div>';

        let tbIndemnites = '<div id="LE-ind" class="api-tb-cell w-node-_49cc5dbe-642f-cafa-ca3a-53d59c308049-c348db8c">'+
                                '<h6 class="api-tb-sous-titre">indemnités dues</h6>'+
                                '<div class="api-tb-inter">'+
                                    '<div class="api-tb-nom">li cenciement</div>'+
                                    '<div class="api-tb-montant">'+
                                        '<div>-</div>'+
                                        '<div>€</div>'+
                                    '</div>'+
                                    '<div class="api-tb-date">-</div>'+
                                '</div>'+
                                '<div class="api-tb-inter">'+
                                    '<div class="api-tb-nom">congés payés</div>'+
                                    '<div class="api-tb-montant">'+
                                        '<div>-</div>'+
                                        '<div>€</div>'+
                                    '</div>'+
                                    '<div class="api-tb-date">-</div>'+
                                '</div>'+
                                '<div class="api-tb-inter lic-pre">'+
                                    '<div class="api-tb-nom">préavis</div>'+
                                    '<div class="api-tb-montant">'+
                                        '<div>-</div>'+
                                        '<div>€</div>'+
                                    '</div>'+
                                    '<div class="api-tb-date">-</div>'+
                                '</div>'+
                                '<div class="api-tb-inter conge-reclass">'+
                                    '<div class="api-tb-nom">Congé de reclassement</div>'+
                                    '<div class="api-tb-montant">'+
                                        '<div>-</div>'+
                                        '<div>€</div>'+
                                    '</div>'+
                                    '<div class="api-tb-date">-</div>'+
                                '</div><a href="#le-inde" class="api-bouton-small w-inline-block">'+
                                    '<div>En savoir plus</div>'+
                                '</a>'+
                            '</div>';

        // Liste boutons filtres
        const boutonsFiltres = {
            boutonDE: { ref: document.querySelector('#btn-de'), state: 0, activate: false },
            boutonRC: { ref: document.querySelector('#btn-rc'), state: 0, activate: false },
            boutonLE: { ref: document.querySelector('#btn-le'), state: 0, activate: false },
            boutonLI: { ref: document.querySelector('#btn-li'), state: 0, activate: false },
            boutonLF: { ref: document.querySelector('#btn-lf'), state: 0, activate: false },
            boutonIP: { ref: document.querySelector('#btn-ip'), state: 0, activate: false },
            boutonIN: { ref: document.querySelector('#btn-in'), state: 0, activate: false },
        }
        // Nombre de boutons cochés au max
        let maxSelect = 3;
        // Nombre de boutons actifs
        let btncount = 0;
        // On regarde l'état des boutons et on les laisse cliquables ou non
        const updateButtons = (object) => {
            btncount = 0;
            // Regarde l’état des boutons
            if (checkButActive() < maxSelect) {
                //console.log("il y a moins de 3 boutons qui sont actifs");
                // => tous les boutons peuvent être cliqués
                for (const [key, value] of Object.entries(object)) {
                    for (const [key2, value2] of Object.entries(value)) {
                        //console.log(`${key2}: ${value2}`);
                        buttonActivate(value);
                    }
                }
            } else if (checkButActive() === maxSelect) {
                // Les autres ne peuvent pas être cliqués
                for (const [key, value] of Object.entries(object)) {
                    for (const [key2, value2] of Object.entries(value)) {
                        if (key2 === 'state') {
                            if (value2 === 0) {
                                buttonDeactivate(value);
                            } else if (value2 === 1) {
                                buttonActivate(value);
                            }
                        }
                    }
                }
            }
        };
        // Si le bouton est cliquable il change d'état
        const btnOnOFF = (obj) => {
            let stateBtn = obj.state;
            if (stateBtn === 0 && btncount < 3) {
                animBoutonON(obj.ref);
                obj.state = 1;
            } else if (stateBtn === 1) {
                animBoutonOFF(obj.ref);
                obj.state = 0;
            }
            updateButtons(boutonsFiltres);
        };
        // Animations et activation du bouton
        const animBoutonOFF = (bouton) => {
            let checkOff = bouton.getElementsByClassName("off")[0];
            let checkOn = bouton.getElementsByClassName("on")[0];
            bouton.style.color = 'rgb(64, 64, 64)';
            bouton.style.borderColor = 'rgb(208, 219, 229)';
            checkOff.style.display = 'block';
            checkOn.style.display = 'none';
        };
        const animBoutonON = (bouton) => {
            let checkOff = bouton.getElementsByClassName("off")[0];
            let checkOn = bouton.getElementsByClassName("on")[0];
            bouton.style.color = 'rgb(74, 12, 120)';
            bouton.style.borderColor = 'rgb(91, 10, 196)';
            checkOff.style.display = 'none';
            checkOn.style.display = 'block';
        };
        const buttonActivate = (bouton) => {
            bouton.ref.style.opacity = '1';
            bouton.ref.style.disabled = 'false';
            bouton.ref.style.cursor = 'pointer';
            bouton.activate = 'true';
        };
        const buttonDeactivate = (bouton) => {
            bouton.ref.style.opacity = '0.3';
            bouton.ref.style.disabled = 'true';
            bouton.ref.style.cursor = 'not-allowed';
            bouton.activate = 'false';
        };
        // On liste le nombre de boutons actifs ou non
        const checkButActive = () => {
            btncount = 0;
            let tb = [];
            tb[0] = boutonsFiltres.boutonDE.state;
            tb[1] = boutonsFiltres.boutonRC.state;
            tb[2] = boutonsFiltres.boutonLE.state;
            tb[3] = boutonsFiltres.boutonLI.state;
            tb[4] = boutonsFiltres.boutonLF.state;
            tb[5] = boutonsFiltres.boutonIP.state;
            tb[6] = boutonsFiltres.boutonIN.state;
            tb.forEach(value => {
                if (value === 1)
                    btncount += 1;
            })
            return btncount;
        };
        // Actions au clic
        boutonsFiltres.boutonDE.ref.addEventListener('click', (e) => {
            e.preventDefault();
            btnOnOFF(boutonsFiltres.boutonDE);
        });

        boutonsFiltres.boutonRC.ref.addEventListener('click', (e) => {
            e.preventDefault();
            btnOnOFF(boutonsFiltres.boutonRC);
        });

        boutonsFiltres.boutonLE.ref.addEventListener('click', (e) => {
            e.preventDefault();
            btnOnOFF(boutonsFiltres.boutonLE);
        });

        boutonsFiltres.boutonLI.ref.addEventListener('click', (e) => {
            e.preventDefault();
            btnOnOFF(boutonsFiltres.boutonLI);
        });

        boutonsFiltres.boutonLF.ref.addEventListener('click', (e) => {
            e.preventDefault();
            btnOnOFF(boutonsFiltres.boutonLF);
        });

        boutonsFiltres.boutonIP.ref.addEventListener('click', (e) => {
            e.preventDefault();
            btnOnOFF(boutonsFiltres.boutonIP);
        });

        boutonsFiltres.boutonIN.ref.addEventListener('click', (e) => {
            e.preventDefault();
            btnOnOFF(boutonsFiltres.boutonIN);
        });

        // Drop down Filtres
        //let contentFiltres = document.querySelector('.api-filtres-content');
        //let arrowFiltres = document.querySelector('.api-filtres-titre-fleche');

        

        let contentFiltres = document.querySelector('.resultat-filtres-acc-content');
        let arrowFiltres = document.querySelector('.resultat-filtres-acc-arrow ');
        contentFiltres.style.opacity = 0;
        contentFiltres.style.display = 'none';
        let filtresDropState = 0;
        //const filtresDrop = document.querySelector('.api-filtres-titre').addEventListener('click', (e) => {
        
        const filtresDrop = document.querySelector('.resultat-filtres-acc-titre').addEventListener('click', (e) => {
            e.preventDefault();
            console.log("CLICK");
            animDropFiltres();
            
        });

        // Animation du dropdown filtres
        const animDropFiltres = () => {
            if(filtresDropState === 0){
                contentFiltres.style.display = 'flex';
                contentFiltres.style.opacity = 1;
                arrowFiltres.style.rotate = 90;
                filtresDropState = 1;
            } else if(filtresDropState === 1){
                contentFiltres.style.display = 'none';
                contentFiltres.style.opacity = 0;
                arrowFiltres.style.rotate = -90;
                filtresDropState = 0;
            }
        };

        // Réorganise le tableau en fonc des filtres
        toogleTable = function (opt) {
            $("#res-mont option:selected").each(function () {
                resMont = $(this).val();
            });
            if (resMont == "Coût employeur") {
                BNNai = 0;
            } else if (resMont == "brut") {
                BNNai = 1;
            } else if (resMont == "net") {
                BNNai = 2;
            } else if (resMont == "netai") {
                BNNai = 3;
            }
            if (boutonsFiltres.boutonDE.state === 1) {
                montre('#DE-head');
                montre('#DE-ind');
                montre('#DE-risk');
                montre('#DE-hyp');
                montre('#DE-are');
                montre('#espDE');
                populArrayPdf(EspDE,true);
            } else {
                cache('#DE-head');
                cache('#DE-ind');
                cache('#DE-risk');
                cache('#DE-hyp');
                cache('#DE-are');
                cache('#espDE');
                populArrayPdf(EspDE,false);
            }
            if (boutonsFiltres.boutonRC.state === 1) {
                montre('#RC-head');
                montre('#RC-ind');
                montre('#RC-risk');
                montre('#RC-hyp');
                montre('#RC-are');
                montre('#espRC');
                populArrayPdf(EspRC,true);
            } else {
                cache('#RC-head');
                cache('#RC-ind');
                cache('#RC-risk');
                cache('#RC-hyp');
                cache('#RC-are');
                cache('#espRC');
                populArrayPdf(EspRC,false);
            }
            if (boutonsFiltres.boutonLE.state === 1) {
                montre('#LE-head');
                montre('#LE-ind');
                montre('#LE-risk');
                montre('#LE-hyp');
                montre('#LE-are');
                montre('#espLE');
                populArrayPdf(EspLE,true);
            } else {
                cache('#LE-head');
                cache('#LE-ind');
                cache('#LE-risk');
                cache('#LE-hyp');
                cache('#LE-are');
                cache('#espLE');
                populArrayPdf(EspLE,false);
            }
            if (boutonsFiltres.boutonLI.state === 1) {
                montre('#LI-head');
                montre('#LI-ind');
                montre('#LI-risk');
                montre('#LI-hyp');
                montre('#LI-are');
                montre('#espLI');
                populArrayPdf(EspLI,true);
            } else {
                cache('#LI-head');
                cache('#LI-ind');
                cache('#LI-risk');
                cache('#LI-hyp');
                cache('#LI-are');
                cache('#espLI');
                populArrayPdf(EspLI,false);
            }
            if (boutonsFiltres.boutonLF.state === 1) {
                montre('#LF-head');
                montre('#LF-ind');
                montre('#LF-risk');
                montre('#LF-hyp');
                montre('#LF-are');
                montre('#espLF');
                populArrayPdf(EspLF,true);
            } else {
                cache('#LF-head');
                cache('#LF-ind');
                cache('#LF-risk');
                cache('#LF-hyp');
                cache('#LF-are');
                cache('#espLF');
                populArrayPdf(EspLF,false);
            }
            if (boutonsFiltres.boutonIP.state === 1) {
                montre('#IP-head');
                montre('#IP-ind');
                montre('#IP-risk');
                montre('#IP-hyp');
                montre('#IP-are');
                montre('#espIP');
                populArrayPdf(EspIP,true);
            } else {
                cache('#IP-head');
                cache('#IP-ind');
                cache('#IP-risk');
                cache('#IP-hyp');
                cache('#IP-are');
                cache('#espIP');
                populArrayPdf(EspIP,false);
            }
            if (boutonsFiltres.boutonIN.state === 1) {
                montre('#IN-head');
                montre('#IN-ind');
                montre('#IN-risk');
                montre('#IN-hyp');
                montre('#IN-are');
                montre('#espIN');
                populArrayPdf(EspIN,true);
            } else {
                cache('#IN-head');
                cache('#IN-ind');
                cache('#IN-risk');
                cache('#IN-hyp');
                cache('#IN-are');
                cache('#espIN');
                populArrayPdf(EspIN,false);
            }
            remplissageTableau();
        }
        // Bouton valider qui lance la réorganisation du tableau
        const submitFiltres = document.querySelector('#filtres-valider').addEventListener('click', (e) => {
            e.preventDefault();
            toogleTable();
            animDropFiltres();
        });
        // Au début on affiche ces éléments comme actifs
        btnOnOFF(boutonsFiltres.boutonRC);
        btnOnOFF(boutonsFiltres.boutonLI);
        btnOnOFF(boutonsFiltres.boutonLE);
        //

        // Fonction 3
        go3();
    }
});
//</script>