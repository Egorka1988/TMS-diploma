
var map2_for_creator_keys = [];

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

function display(){ /* displays ships of player 1 after he has created his map */

        var cell_id, color;
        for (var i=0; i < size; i++) {
            for (var j=0; j < size; j++) {
                cell_id = i+","+j;
                color = form[cell_id];
                cell_id_a = cell_id+"-a";
                document.getElementById(cell_id_a).style = color;
            };
        };
    };

function querying() { /* asks the server if player-joiner created his fleet and returns data if yes */

        console.log("waiting...");
        document.getElementById("state_msg").innerHTML = "We are\
            still waiting for enemy's fleet...";

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", e => {

            data2_for_creator = JSON.parse(e.target.responseText);

        });
        xhr.open('GET', "/awaited_fleet/", true); /* true => async */
        xhr.send();
        return data2_for_creator;
    };

function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    /* function, that waits for a fleet of enemy, that should join the game.
    function runs by player, who has created game */


async function waiting_with_delay() {

        var i = 500;

        while (i < 501) {
            i--;
            await sleep(5000);

            if (map2_for_creator_keys.length == 0) {

                data2_for_creator = querying();
                map2_for_creator_keys = Object.keys(data2_for_creator);

            } else {

                    console.log("break. Enemy's fleet has arrived");
                    document.getElementById("state_msg").innerHTML = "\
                        Enemy's fleet has arrived. Get ready to fight!"
                    await sleep(3000);
                    document.getElementById("state_msg").innerHTML = "FIRE!!!"

                    /* global var map2. Need for work with removing Listener after miss */

                    map2_for_creator = document.getElementById("opponent_table");
                    map2_for_creator.addEventListener('click', shoot);

                    ship_loc_for_creator = fleet_location(map2_for_creator_keys, data2_for_creator);
                    break;

              };

            if (i == 0) {

                document.getElementById("state_msg").innerHTML = "Your fleet\
                 is so strong ,that nobody has enough bravery fighting with you";

            };
        };
    };

function joiner_fleet() {

        map2_for_joiner = document.getElementById("opponent_table");
        map2_for_joiner_keys = Object.keys(data2_for_joiner);

        ship_loc_for_joiner = fleet_location(map2_for_joiner_keys, data2_for_joiner);

    };

function fleet_location(map_keys, data2) {

        var ship_loc = [];

        for (let i = 0; i < map_keys.length; i++) {

            if (data2[map_keys[i]] == "background-color: lime;") {

                ship_loc[i] = map_keys[i];

            };
        };

        return ship_loc;
    };

function ext_location_foo(elem) { /* get indexes of cells, that surround current cell */
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

function check_surround (map, elem, map_keys, ship_loc) {

        var loc = ext_location_foo(elem);

        var result = "";

        for (let i=0; i < loc.length; i++) {

            var cell_id = loc[i];

            if (map_keys.includes(cell_id)) {  /* checks if ext index is within margins */

                var cell_color = document.getElementById(cell_id).style.backgroundColor

                /* if cell_id from surround belongs to enemy's ship and is not shooted yet... */

                if (ship_loc.includes(cell_id) && cell_color != "red") {

                    result = "Hurt";
                    return;

                } else {

                    result = "Killed";

                 };
            };
        };

        if (result == "Killed") {

            killed_paint(elem, map_keys);
            check_if_win(map, map_keys, ship_loc);

        };
    };

function killed_paint(elem, map_keys) {

        /* painting cells surround killed ship */

        var loc = ext_location_foo(elem); /* pick up indexes, surrounding current elem */

        document.getElementById(elem).innerHTML = "&nbsp;";

        for (let i=0; i < loc.length; i++) {

            if (map_keys.includes(loc[i])) { /* elem should be within edges battlemap */

                 var cell_color = document.getElementById(loc[i]).style.backgroundColor;
                 var cell_content
                 if (cell_color == "red" && document.getElementById(loc[i]).innerHTML != "&nbsp;") { /* if neighbour of current elem is red */

                    killed_paint(loc[i], map_keys);

                 } else {

                    if (document.getElementById(loc[i]).innerHTML != "&nbsp;") {
                        document.getElementById(loc[i]).innerHTML = "X";
                    };
                  };
            };
        };
    };

async function check_if_win(map, map_keys, ship_loc) {

        var killed_cells = [];

        for (let i = 0; i < map_keys.length; i++) {

            try {

                var elem = document.getElementById(map_keys[i]).innerHTML;

                if (elem == "&nbsp;") {

                    killed_cells[i] = map_keys[i];

                };

            } catch(err) {

                continue;
            };
        };

        if (String(ship_loc.sort()) == String(killed_cells.sort())) {

            await sleep(1000);
            alert("Nice job, bro!");
            document.getElementById("state_msg").innerHTML = "You win! Congratulations!!!"
            map.removeEventListener('click', shoot);

        };
    };

function shoot_field(map, data2, tmp, map_keys, ship_loc) {

        if (data2[tmp] == "background-color: lime;"){

                document.getElementById(tmp).style.backgroundColor = "red";
                document.getElementById("state_msg").innerHTML = "Gotcha!"

                check_surround(map, tmp, map_keys, ship_loc);

            } else {

                document.getElementById(tmp).innerHTML = "X";
                document.getElementById("state_msg").innerHTML = "Good try!"

                map.removeEventListener('click', shoot);
             };
    };

function shoot(e) {

        var id = e.target.id;

        if (Object.keys(data2_for_joiner).length == 0) {

            shoot_field(map2_for_creator, data2_for_creator, id, map2_for_creator_keys, ship_loc_for_creator);

        } else {

            shoot_field(map2_for_joiner, data2_for_joiner, id, map2_for_joiner_keys, ship_loc_for_joiner);

         };
    };

if (opponent == "None") {

        document.addEventListener('DOMContentLoaded', waiting_with_delay);

} else {

    document.addEventListener('DOMContentLoaded', joiner_fleet);

 };

document.addEventListener('DOMContentLoaded', display);

window.addEventListener('pagehide', cleaning_db);
