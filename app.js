var fs = require('fs');
const Database = require('better-sqlite3');

//OPEN DATABASE CONNECTION
const db = new Database('pokebase.db');

//CREATE TABLE FOR STORING TYPES
var types = [];
db.prepare(`DROP TABLE IF EXISTS \`types\``).run();
db.prepare(`CREATE TABLE IF NOT EXISTS \`types\` (
  \`id\` INT NOT NULL, \`name\` VARCHAR(100) NOT NULL,
   PRIMARY KEY (\`id\`));`).run();

//CREATE TABLE FOR STORING POKEMONS
db.prepare(`DROP TABLE IF EXISTS \`pokemon\``).run();
db.prepare(`CREATE TABLE IF NOT EXISTS \`pokemon\` (
  \`id\` INT NOT NULL, \`imageurl\` VARCHAR(100) NULL, \`name\` VARCHAR(45) NULL,
   \`type1\` INT, \`type2\` INT,
   PRIMARY KEY (\`id\`));`).run();

//READ EXTERNAL POKEMON JSON LIST
let pokelist = JSON.parse(fs.readFileSync('./data/pokedex_list.json', 'utf8'));


for (let index in pokelist) {
    // console.log("Id " + pokelist[index].id +': '+pokelist[index].name+'| '+pokelist[index].type1+', '+pokelist[index].type2);

    // RETRIEVE ID OF TYPE OF CURRENT POKEMON, OTHERWISE INSERT THE NEW TYPE INTO THE ARRAY
    let t1 = -1, t2 = -1;
    for (let i in types) {
        if(pokelist[index].type1 === types[i]) t1 = i;
        if(pokelist[index].type2 === types[i]) t2 = i;
    }
    if(t1 === -1) t1 = (types.push(pokelist[index].type1))-1;
    if(pokelist[index].type2 !== undefined && t2 === -1) t2 = (types.push(pokelist[index].type2))-1;


    //INSERTING POKEMON INTO DATABASE
    const stmt = db.prepare('INSERT INTO pokemon(id, imageurl, name, type1, type2) VALUES(?, ?, ?, ?, ?)');
    let info;
    if(t2 === -1)
        info = stmt.run(pokelist[index].id, pokelist[index].imageUrl, pokelist[index].name, t1, null);
    else
        info = stmt.run(pokelist[index].id, pokelist[index].imageUrl, pokelist[index].name, t1, t2);
}

//INSERTING POKEMON TYPES INTO DATABASE
for (var i in types) {
    const info = db.prepare('INSERT INTO types(id, name) VALUES(?, ?)').run(i, types[i]);
    console.log("insert type: "+info.changes);
}


//CREATE TABLE FOR STORING MNs
db.prepare(`DROP TABLE IF EXISTS \`mn\``).run();
db.prepare(`CREATE TABLE IF NOT EXISTS \`mn\` (
  \`id\` INT NOT NULL, \`name\` VARCHAR(45) NULL,
   PRIMARY KEY (\`id\`));`).run();

//CREATE TABLE FOR STORING ASSOCIATIONS BETWEEN MN AND POKEMONS
db.prepare(`DROP TABLE IF EXISTS \`mn_pokemon\``).run();
db.prepare(`CREATE TABLE IF NOT EXISTS \`mn_pokemon\` (
  \`mn_id\` INT NOT NULL, \`pokemon_id\` INT NOT NULL,
  PRIMARY KEY (\`mn_id\`, \`pokemon_id\`));`).run();

//INSERTING INTO DB ALL MN TOOLS AND RELATED POKEMON CAPABLE OF LEARNING THEM
let mnlist = JSON.parse(fs.readFileSync('./data/MN_list.json', 'utf8'));
mnlist = mnlist['MN'];

for (let key in mnlist) {
    console.log("Id " + mnlist[key].id +': '+mnlist[key].name+'| '+mnlist[key].pokes);

    const stmt = db.prepare('INSERT INTO mn(id, name) VALUES(?, ?)');
    let info = stmt.run(mnlist[key].id, mnlist[key].name);
    console.log("insert MN: "+info.changes);

    let compatible_pokemons = mnlist[key].pokes;
    for (let k in compatible_pokemons) {
        const stmt = db.prepare('INSERT INTO mn_pokemon(mn_id, pokemon_id) VALUES(?, ?)');
        let info = stmt.run(mnlist[key].id, compatible_pokemons[k]);
        console.log("insert MN-POKEMON: "+info.changes);
    }
}


//READING POKEMON DATA
var list = db.prepare(`SELECT p.id, p.name, t1.name as tipo1, t2.name as tipo2 FROM pokemon p JOIN types t1 ON p.type1=t1.id LEFT JOIN types t2 ON p.type2=t2.id ORDER BY p.id`).all();
console.log(list);


db.close();