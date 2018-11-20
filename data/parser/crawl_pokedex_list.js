// THIS SCRIPT WILL GENERATE JSON PARSING TABLE DATA OF THIS PAGE
// https://wiki.pokemoncentral.it/Elenco_Pok%C3%A9mon_secondo_il_Pok%C3%A9dex_di_Kanto
// containig all 151 pokemon of first generation

//AUTHOR Mauro Cerbai
//WEBSITE www.maurocerbai.com
//LICENCE MIT

//INJECT JQUERY INTO PAGE
(function() { function l(u, i) { var d = document; if (!d.getElementById(i)) { var s = d.createElement('script'); s.src = u; s.id = i; d.body.appendChild(s); } } l('//code.jquery.com/jquery-3.2.1.min.js', 'jquery') })();

//PREPARE ALL DATA STRUCTURES
var pokes = [];
var tables = $("table");

//CALLING THE FUNCTION FOR EACH TABLE IN PAGE
getPkList(tables[0], pokes);
getPkList(tables[1], pokes);
getPkList(tables[2], pokes);

//TRANSFORM DATA ARRAY INTO JSON
var json = JSON.stringify(pokes);
console.log(json);


function getPkList(tbl, array){
    $(tbl).find('tr').each(function (i) { //loop on each tr in table
        // SKIP HEADER
        if(i===0) return;
        //CREATE POKEMON OBJECT
        var poke = {};
        var $tds = $(this).find('td'); //get all td tags
        poke.strid = $tds.eq(1).text(); //access first td and get text content
        poke.strid = poke.strid.replace('#','');
        poke.id = parseInt(poke.strid, 10);
        poke.imageUrl = $tds.eq(2).find('img')[0].getAttribute('src'); //access second td and get src attribute of the img tag
        poke.name = $tds.eq(3).find('a')[0].text;
        poke.type1 = $tds.eq(4)[0].innerText;
        if($tds.eq(5)[0])
            poke.type2 = $tds.eq(5)[0].innerText;

        array.push(poke); //save object to the array
    });
}