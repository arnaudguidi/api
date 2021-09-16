//<!-- Code simulateur -->
//<script>

const checkUser = () => {
    console.log('***** checkUser ****')
    var docRef = db.collection('users').doc(currentUserUID);
    docRef.get().then((doc) => {
        if (doc.exists) {
            const nb_simul_left = doc.data().nb_simul_left;
            const nb_simul_start = doc.data().nb_simul_start;
            let okOrNot = false;
            
            if(nb_simul_left > 0 || nb_simul_start > 0 || nb_simul_left === -1){
                okOrNot = true;
            }
            
            console.log("nb_simul_left : ",nb_simul_left," - nb_simul_start : ",nb_simul_start," - okOrNot : ",okOrNot);

            if(okOrNot){
                console.log('Yes have fun');
            }
            else {
                console.log('Nope GO BACK');
                window.location.replace(accountpage);
            }
        } else {
            console.log("No such document! GO BACK");
            window.location.replace(accountpage);
        }
    }).catch((error) => {
        console.log("GO BACK Error getting document:", error);
        window.location.replace(accountpage);
    });
}

//</script>