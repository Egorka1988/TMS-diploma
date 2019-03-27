var data2_for_creator = {};
var ship_loc = [];
var map2_keys = [];


function cleaning_db() {

        event.preventDefault();

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", e => {
            console.log(e.target.responseText);
        });
        xhr.addEventListener("error", e => {
            console.log(e);
        });
        xhr.open('GET', "/cleaning_db/", false); /* true => async */
        console.log("deleting map...");
        xhr.send();

    };

function display(){

        var cell_id, color;
        var result = form;
        for (var i=0; i < size; i++) {
            for (var j=0; j < size; j++) {
                cell_id = i+","+j;
                color = result[cell_id];
                cell_id_a = cell_id+"-a";
                document.getElementById(cell_id_a).style = color;
            };
        };
    };

function querying() {

        console.log("we are in loop");
        document.getElementById("state_msg").innerHTML = "We are\
            still waiting for enemy's fleet...";

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", e => {
            data2 = JSON.parse(e.target.responseText);
        });
        xhr.open('GET', "/awaited_fleet/", true); /* true => async */
        xhr.send();
        return data2;
    };

function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    /* function, that waits for a fleet of enemy, that should join the game.
    function runs by player, who has created game */


async function waiting_with_delay() {
        var i = 500;
        var tmp = [];

        while (i<501) {
            i--;
            await sleep(5000);

            if (tmp.length == 0) {

                data2_for_creator = querying()
                tmp = Object.keys(data2);
                console.log("arrived fleet :", data2_for_creator);

            } else {

                    console.log("break. Enemy's fleet has arrived");
                    document.getElementById("state_msg").innerHTML = "\
                        Enemy's fleet has arrived. Get ready to fight!"
                    await sleep(3000);
                    document.getElementById("state_msg").innerHTML = "FIRE!!!"

                    /* global var map2. Need for work with removing Listener after miss */

                    map2 = document.getElementById("opponent_table");
                    map2.addEventListener('click', shoot);
                    fleet_location();
                    break;

              };
            if (i == 0) {

                document.getElementById("state_msg").innerHTML = "Your fleet\
                 is so strong ,that nobody has enough bravery fighting with you";

            };
        };
    };


function fleet_location() {

        map2_keys = Object.keys(data2_for_creator);

        for (let i = 0; i < map2_keys.length; i++) {

            if (data2_for_creator[map2_keys[i]] == "background-color: lime;") {

                ship_loc[i] = map2_keys[i];

            };
        };
    };

function ext_location_foo(elem) {
        var up = (Number(elem[0]) - 1) + "," + elem[2];
        var right = elem[0] + "," + (Number(elem[2]) + 1);
        var left = elem[0] + "," + (Number(elem[2]) - 1);
        var bottom = (Number(elem[0]) + 1) + "," + elem[2];
        var right_up = (Number(elem[0]) - 1) + "," + (Number(elem[2]) + 1);
        var left_up = (Number(elem[0]) - 1) + "," + (Number(elem[2]) - 1);
        var right_bottom = (Number(elem[0]) + 1) + "," + (Number(elem[2]) + 1);
        var left_bottom = (Number(elem[0]) + 1) + "," + (Number(elem[2]) - 1);
        var ext_location = [up, right ,left, bottom, right_up, right_bottom, left_bottom, left_up];
        return ext_location
    };

function check_surround (elem) {

        var loc = ext_location_foo(elem);

        var result = "";

        for (let i=0; i < loc.length; i++) {
            if (map2_keys.includes(loc[i])) {  /* checks if ext index is within margins */

                var cell = loc[i];
                var cell_color = document.getElementById(loc[i]).style.backgroundColor

                /* if cell from surround belongs to enemy's ship and is not shooted yet... */

                if (ship_loc.includes(cell) && cell_color != "red") {

                    result = "Hurt";
                    return;

                } else {

                    result = "Killed";

                 };
            };
        };

        if (result == "Killed") {

            killed_paint(elem);
            check_if_win();

        };
    };

function killed_paint(elem) {

        /* painting cells surround killed ship */

        var loc = ext_location_foo(elem); /* pick up indexes, surrounding current elem */

        document.getElementById(elem).innerHTML = "&nbsp;";

        for (let i=0; i < loc.length; i++) {

            if (map2_keys.includes(loc[i])) { /* elem should be within edges battlemap */

                 var cell_color = document.getElementById(loc[i]).style.backgroundColor;
                 var cell_content
                 if (cell_color == "red" && document.getElementById(loc[i]).innerHTML != "&nbsp;") { /* if neighbour of current elem is red */

                    killed_paint(loc[i]);

                 } else {

                    if (document.getElementById(loc[i]).innerHTML != "&nbsp;") {
                        document.getElementById(loc[i]).innerHTML = "X";
                    };
                  };
            };
        };
    };

async function check_if_win() {

        var killed_cells = [];

        for (let i = 0; i < map2_keys.length; i++) {

            try {

                var elem = document.getElementById(map2_keys[i]).innerHTML;

                if (elem == "&nbsp;") {

                    killed_cells[i] = map2_keys[i];

                };

            } catch(err) {

                continue;
            };
        };

        if (String(ship_loc.sort()) == String(killed_cells.sort())) {

            await sleep(1000);
            alert("Nice job, bro!");
            document.getElementById("state_msg").innerHTML = "You win! Congratulations!!!"
            map2.removeEventListener('click', shoot);

        };
    };

function shoot(e) {

        var tmp = e.target.id;
        var style = data2_for_creator[tmp];
        if (style == "background-color: lime;"){

            document.getElementById(e.target.id).style.backgroundColor = "red";
            document.getElementById("state_msg").innerHTML = "Gotcha!"
            check_surround(tmp);

        } else {

            document.getElementById(e.target.id).innerHTML = "X";
            document.getElementById("state_msg").innerHTML = "Good try!"
            map2.removeEventListener('click', shoot);
        };
    };

window.onload = function target_for_shooting () {


    };

if (opponent == "None") {

        document.addEventListener('DOMContentLoaded', waiting_with_delay);

};

document.addEventListener('DOMContentLoaded', display);

window.addEventListener('pagehide', cleaning_db);
