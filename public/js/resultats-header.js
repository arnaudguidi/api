/*
<style>
    .page-contents {
        display: none;
    }
	#footer {
        display: none;
    }
	.navbar-container.fixed {
    display: none;
		transform: translate3d(0px, 0px, 0px); 
		transform-style: preserve-3d;
    }
</style>
*/
//<script>

		// On créé des tableaux de champs textes cibles
		constCibles = function (name, long) {
			var tb = [];
			for (var i = 0; i < long; i++) {
				tb.push("." + name + "-" + (i + 1));
			}
			return tb;
		}
		// ** Champs infos recap **
		let ciInfosSal = constCibles("infos-sal",10);
		let ciInfosEnt = constCibles("infos-entre",3);
		let ciInfosRup = constCibles("infos-rup",6);

		// ** Champs pour le tableau **
		let ciIN = constCibles("inde", 10);
		let ciRI = constCibles("risk", 2);
		let ciHY = constCibles("hyp", 1);
		let ciAR = constCibles("are", 9);

		// ** Champs pour les en savoir plus **
		// Les indemnités dues par l'entreprise
		let ciEspInLic = constCibles("esp-inde-lic", 11);
		let ciEspInCp = constCibles("esp-inde-cp", 9);
		let ciEspInPrCSP = constCibles("esp-inde-pre-csp", 7);
		let ciEspInPr = constCibles("esp-inde-pre", 6);
		let ciEspInCo = constCibles("esp-inde-cont", 5);
		let ciEspInRe = constCibles("esp-inde-rec", 7);
		// Risque supplémentaire si contentieux
		let ciEspRi = constCibles("esp-risk", 36);
		// Indemnités prud'homales
		let ciEspPr = constCibles("esp-prud", 12);
		// Remboursement préavis et congés payés
		let ciEspReCpCSP = constCibles("esp-remb-pre-csp", 7);
		let ciEspReCp = constCibles("esp-remb-pre", 7);
		// Risque indemnite licenciement
		let ciEspRiLi = constCibles("esp-risk-lic", 11);
		// Remboursement ARE 
		let ciEspReArCSP = constCibles("esp-remb-are-csp", 5);
		let ciEspReAr = constCibles("esp-remb-are", 4);
		// Rappel heures supplémentaires
		let ciEspRaHs = constCibles("esp-rapp-hs", 12);
		// Rappel primes
		let ciEspRp = constCibles("esp-primes", 6);
		// Hypothese indemnite negociee
		let ciEspHyp = constCibles("esp-hyp-inde",4);
		// ARE
		let ciEspAr = constCibles("esp-are", 23);	
		



		// On liste les div conteneurs des champs
		// Infos recap
		var IN_recap;

		// Tableau
		var DE_ind = null;
		var DE_risk = null;
		var DE_hyp = null;
		var DE_are = null;

		var RC_ind = null;
		var RC_risk = null;
		var RC_hyp = null;
		var RC_are = null;

		var LE_ind = null;
		var LE_risk = null;
		var LE_hyp = null;
		var LE_are = null;

		var LI_ind = null;
		var LI_risk = null;
		var LI_hyp = null;
		var LI_are = null;

		var LF_ind = null;
		var LF_risk = null;
		var LF_hyp = null;
		var LF_are = null;

		var IP_ind = null;
		var IP_risk = null;
		var IP_hyp = null;
		var IP_are = null;

		var IN_ind = null;
		var IN_risk = null;
		var IN_hyp = null;
		var IN_are = null;

		// Conteneurs en savoir plus
        var EspDE = null;
        var EspRC = null;
        var EspLE = null;
        var EspLI = null;
        var EspLF = null;
        var EspIP = null;
        var EspIN = null;

		//Objet
		let obJxt = {};
		let webHookResponse = null;

		// Drop montants
		var resMont = "brut";
		// Cout Employeur,B,N,Nai,
		let BNNai = 1;
		// CSP true ou false
		let cspDE = false;
		let cspRC = false;
		let cspLE = false;
		let cspLI = false;
		let cspLF = false;
		let cspIP = false;
		let cspIN = false;

		// Affichage de toutes les propriétés et valeurs
		function afficherProps(obj) {
			for (const [key, value] of Object.entries(obj)) {
				console.log(`${key}: ${value}`);
				return `${key}: ${value}`;
			}
		}

		// Remplissage des champs cibles
    // Remplissage pour tout
    const remplissageCibles = (location, cible, contenu, decimal) => {
        // Pour tous les champs de destinations passés ici
		if(contenu[0] != null){
			for (var i = 0; i < cible.length; i++) {
				// On sélectionne le contenu pour ce champ
				var nTabl = contenu[i];
				// On sélectionne le champ de destination
				var x = location.querySelector(cible[i]);
				// Si le contenu et la cible existent
				if(nTabl && x){
					// Si le contenu est un array
					if (Array.isArray(nTabl)) {
						//console.log("Cible : ", x.className, " - Data : " + nTabl[BNNai]);
						// Si le contenu est vide
						if (nTabl[BNNai] == "") {
							// On affiche un -
							x.innerHTML = "-";
						} else {
							// Si le contenu n'est pas vide on vérifie si c'est un chiffre
							// Si oui on le formate et on affiche le contenu
							// Si non on affiche le contenu texte
							if(decimal != 2){
								x.innerHTML = nTabl[BNNai];
							} else {
								x.innerHTML = onlyNumbers(nTabl[BNNai]);
							}
						}
					} else {
						//console.log("Cible : ", x.className, " - Data : " + nTabl);
						// Si le contenu est vide
						if (nTabl == "") {
							// On affiche un -
							x.innerHTML = "-";
						} else if (nTabl == null) {
							// Si le contenu affiche null on cache la zone
							x.innerHTML = "effacer";
							if(i === 0){
								cacheParent(x);
							}
						} else {
							// Si le contenu n'est pas vide ou = à null on vérifie si c'est un chiffre
							// Si oui on le formate et on affiche le contenu
							// Si non on affiche le contenu texte
							if(decimal != 2){
								x.innerHTML = nTabl;
							} else {
								x.innerHTML = onlyNumbers(nTabl);
							}
						}
					}
				} else {
					//alert("Une erreur est survenue, veuillez nous en excuser");
				}
			}
		} else {
			//console.log("Contenu uniquement NULL, on cache le ESPinner supérieur :");
			cacheParent(location.querySelector(cible[0]));
		}
    }

	// Sur l'ESP si on a null au lieu d'un array de données on cache le bloc entier
    const cacheParent = (element) => {
		let elementToHide = element.closest(".esp-inner");
		//console.log('cacheParent : ',elementToHide);
		if(elementToHide) {
			//console.log('on a trouvé le parent : ',elementToHide);
			elementToHide.style.display = 'none';
		} else {
			//console.log('on a PAS trouvé le parent');
		}
    };

	// Analyse pour voir si on a un chiffre ou non et on applique un float sans décimales
    const onlyNumbers = (n) => {
        //console.log('Valeur initiale : ', n);
        var re = /[^\d,-]+/g;
        // Test si c'est un chiffre de plus de 4 caractères
        if (re.test(n) === false && n.length > 4) {
            // c'est un chiffre
            var numFloat = parseFloat(n);
            var number = spaceMil(numFloat);
            //console.log('Valeur modifiée : ', number);
            return number;

        } else {
            // Ce n'est pas un chiffre
            //console.log('Valeur modifiée : ', n);
            return n;
        }
    };

	// Analyse pour voir si on a un chiffre ou non et on applique un float avec décimales
	const onlyNumbersDecimal = (n) => {
        //console.log('Valeur à 2 décimales');
        var re = /[^\d,-]+/g;
        // Test si c'est un chiffre de plus de 4 caractères
        if (re.test(n) === false && n.length > 4) {
            // c'est un chiffre
            var numFloat = parseFloat(n).toFixed(2);
            var number = spaceMil(numFloat);
            //console.log('Valeur modifiée : ', number);
            return number;

        } else {
            // Ce n'est pas un chiffre
            //console.log('Valeur modifiée : ', n);
            return n;
        }
    };

	// Formattage d'un chiffre avec un espace aux milliers
    const spaceMil = (valeur) => {
        return valeur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };


	// Lancement de la réorganisation du tableau en fonctions des filtres
	const remplissageTableau = () => {
		rempDE();
		rempRC();
		rempLE();
		rempLI();
		rempLF();
		rempIP();
		rempIN();
	};

	// Pages du pdf
	let pages = ['','','',''];
	
	// User data
	let userData = {};
	var jobexitID = null;
	//</script>