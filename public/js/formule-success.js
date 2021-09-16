
//<script>
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('formule');
const formuleNumb = parseInt(id, 10);
console.log("formule : " + formuleNumb);

// Changement de formule
const changeFormule = firebase.functions().httpsCallable('changeFormule');

changeFormule({
    formule : formuleNumb
})

const butBack = document.querySelector('#btnback');
butBack.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});
//</script>