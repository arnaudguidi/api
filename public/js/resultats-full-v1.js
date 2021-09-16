// Page de résultat du simulateur Jobexit v1
// 15/09/2021

// Mise en place du DatePicker
$('#datepicker').datepicker();

// Barres de gantt dans le tableau
var pgantt1 = 24;
var pgantt2 = 12;
var pgantt3 = 31;
var pgantt4 = 33;
//
const numberToString = (number)=>{
    var stringNumber = number.toString();
    var newString = stringNumber+'%';
    return newString;
};
//
document.querySelector("#gantt1").style.width = numberToString(pgantt1);
document.querySelector("#gantt2").style.width = numberToString(pgantt2);
document.querySelector("#gantt3").style.width = numberToString(pgantt3);
document.querySelector("#gantt4").style.width = numberToString(pgantt4);
//
document.querySelector("#gantt1").style.left = '0%';
document.querySelector("#gantt2").style.left = numberToString(pgantt1);
document.querySelector("#gantt3").style.left = numberToString(pgantt1+pgantt2);
document.querySelector("#gantt4").style.left = numberToString(pgantt1+pgantt2+pgantt3);
//
tippy('#gantt1', {
    theme: 'light',
    content: '<div class="tooltip-titre">Titre 1</div><div class="tooltip-date">01/12/1983</div>',
    allowHTML: true
});
tippy('#gantt2', {
    theme: 'light',
    content: '<div class="tooltip-titre">Titre 2</div><div class="tooltip-date">30/06/1982</div>',
    allowHTML: true,
});
tippy('#gantt3', {
    theme: 'light',
    content: '<div class="tooltip-titre">Titre 3</div><div class="tooltip-date">10/05/2013</div>',
    allowHTML: true,
});
tippy('#gantt4', {
    theme: 'light',
    content: '<div class="tooltip-titre">Titre 4</div><div class="tooltip-date">20/07/2016</div>',
    allowHTML: true,
});