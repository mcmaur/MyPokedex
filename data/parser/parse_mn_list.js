// THIS SCRIPT WILL GENERATE JSON PARSING TABLE DATA OF THIS PAGE
// https://wiki.pokemoncentral.it/Taglio
// containig all 151 pokemon of first generation capable of learning CUT MN01

//AUTHOR Mauro Cerbai
//WEBSITE www.maurocerbai.com
//LICENCE MIT

(function() { function l(u, i) { let d = document; if (!d.getElementById(i)) { let s = d.createElement('script'); s.src = u; s.id = i; d.body.appendChild(s); } } l('//code.jquery.com/jquery-3.2.1.min.js', 'jquery') })();

let data = {};
data.id = 1;
data.name = 'TAGLIO';
data.pokes = [];

getMNList($("table")[1], data.pokes);

let json = JSON.stringify(data);
console.log(json);


function getMNList(tbl, array){
    let stop = false;

    $(tbl).find('tr').each(function (i) {
        if(stop) return;

        if(i===0 || i===1) return;

        let tds = $(this).find('td');
        let pokeid = parseInt(tds[0].innerText, 10);
        if(pokeid>151) {
            stop = true;
            return;
        }
        let canlearn = tds[5].innerText.trim();

        if (canlearn === '✔')
            array.push(pokeid);
    });
}