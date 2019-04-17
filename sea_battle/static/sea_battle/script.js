
var map2_for_creator_keys = [];
var map2_for_creator = document; /* default value */
var temp_self_loc = [];
var form_keys = Object.keys(form);
var j = 0;
    for (var i = 0; i < form_keys.length; i++) {
        if (form[form_keys[i]] == "background-color: lime;") {
            temp_self_loc[j] = form_keys[i];
            j++;
        }
    }
var self_ship_loc = temp_self_loc;

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

    }

function display(){ /* displays ships of player 1 after he has created his map */

        for (var k=0; k < form.length; k++) {
            for (var i=0; i < form[k].length; i++) {
            var cell_id = form[k][i][0] + "," + form[k][i][1]+"-a";
            document.getElementById(cell_id).style = "background-color: lime;";
            }
        }
    }

function querying() { /* asks the server if player-joiner created his fleet and returns data if yes */

        console.log("waiting...");
        document.getElementById("state_msg").innerHTML = "We are\
            still waiting for enemy's fleet...";

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", e => {

            var joiner = JSON.parse(e.target.responseText);

        });
        var url = "/awaited_fleet/" + game_id;
        console.log(url);
        xhr.open('GET', url, true); /* true => async */
        xhr.send();
        return joiner;
    }

function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /* function, that waits for a fleet of enemy, that should join the game.
    function runs by player, who has created game */

async function waiting_with_delay() {

        var i = 20;

        while (i < 501) {
            i--;
            await sleep(5000);
            var joiner = querying()
            if (joiner != "Nobody yet") {

                console.log("break. Enemy's fleet has arrived");
                document.getElementById("state_msg").innerHTML = "\
                    {{joiner}}'s fleet has arrived. Get ready to fight!"
                await sleep(3000);
                document.getElementById("state_msg").innerHTML = "FIRE!!!"

                /* global var map2. Need for work with removing Listener after miss */

                map2_for_creator = document.getElementById("opponent_table");
                map2_for_creator.addEventListener('click', shoot);

                ship_loc_for_creator = fleet_location(map2_for_creator_keys, data2_for_creator);
                break;

              }

            if (i == 0) {

                document.getElementById("state_msg").innerHTML = "Your fleet\
                 is so strong ,that nobody has enough bravery fighting with you";
                return;

            }
        }

        display_destroy(map2_for_creator, map2_for_creator_keys, ship_loc_for_creator);

    }

function joiner_fleet() {

        map2_for_joiner = document.getElementById("opponent_table");
        map2_for_joiner_keys = Object.keys(data2_for_joiner);

        document.getElementById("state_msg").innerHTML = "Oops! Ambush!\
         You are under the fire! \n Waiting for enemy's shoot...";

        ship_loc_for_joiner = fleet_location(map2_for_joiner_keys, data2_for_joiner);
        display_destroy (map2_for_joiner, map2_for_joiner_keys, ship_loc_for_joiner);
    }

async function display_destroy(map, map_keys, ship_loc) {

        var shoot_log = [];
        while (true) {

            var callback = get_statement();
            await sleep(3000);

            if (shoot_log.length === callback.length || callback === "no shoots yet") {

                if (check_if_win(map, map_keys, ship_loc)) {

                    return; /* turn off infinity listen of statement for winner */
                }

            } else {

                shoot_log = callback;
                for (var i = 0; i< callback.length; i++) {

                    cell_id_a = shoot_log[i]+"-a";

                    if (form[shoot_log[i]] === "background-color: lime;") {

                        map.removeEventListener('click', shoot);
                        document.getElementById(cell_id_a).style.backgroundColor = "#B51A78";
                        check_surround(map, cell_id_a, map_keys, ship_loc)

                        if (check_if_loose () == "You loose") {

                            await sleep(1000);
                            alert("You loose, bro. I believe, next time it will be better");
                            return;

                        }

                        document.getElementById("state_msg").innerHTML = "Alarm! \
                            Hurt! Keep the defence!";

                    } else {

                        document.getElementById(cell_id_a).innerHTML = "X";
                        document.getElementById("state_msg").innerHTML = "Now your\
                            turn. FIRE!!!";
                        map.addEventListener('click', shoot);

                     }
                }
             }
        }
    }

function fleet_location(map_keys, data2) {

        var ship_loc = [];

        for (let i = 0; i < map_keys.length; i++) {

            if (data2[map_keys[i]] == "background-color: lime;") {

                ship_loc[i] = map_keys[i];

            }
        }

        return ship_loc;
    }

function ext_location_foo(elem, map_keys) { /* get indexes of cells, that surround current cell */

        var up = (Number(elem[0]) - 1) + "," + elem[2];
        var right = elem[0] + "," + (Number(elem[2]) + 1);
        var left = elem[0] + "," + (Number(elem[2]) - 1);
        var bottom = (Number(elem[0]) + 1) + "," + elem[2];
        var right_up = (Number(elem[0]) - 1) + "," + (Number(elem[2]) + 1);
        var left_up = (Number(elem[0]) - 1) + "," + (Number(elem[2]) - 1);
        var right_bottom = (Number(elem[0]) + 1) + "," + (Number(elem[2]) + 1);
        var left_bottom = (Number(elem[0]) + 1) + "," + (Number(elem[2]) - 1);
        var tmp = [up, right ,left, bottom, right_up, right_bottom, left_bottom, left_up];
        var ext_location = [];
        var count = 0;
        for (let i = 0; i < tmp.length; i++) {

            if (map_keys.includes(tmp[i])) {

                /* checks if ext index is within margins */
                ext_location[count] = tmp[i];
                count++;

            }
        }

        if (elem.indexOf('-a') > 0) {

            for (let i=0; i < ext_location.length; i++) {

                ext_location[i] = ext_location[i] + '-a';

            }
        }
        return ext_location;
    }

function check_surround (map, elem, map_keys, ship_loc) {

        var loc = ext_location_foo(elem, map_keys);
        /* defining array of indexes of surround cells for current one */
        var result = ""; /* marker, if ship is killed or hurt */
        for (let i=0; i < loc.length; i++) {

            var cell_color = document.getElementById(loc[i]).style.backgroundColor

            /* if cell_id from surround belongs to enemy's ship and is not shooted yet... */

            var cond_enemy = ship_loc.includes(loc[i]) && cell_color != "red";
            var cond_self = self_ship_loc.includes(loc[i].substr(0,3)) && cell_color != "rgb(181, 26, 120)";
            console.log("cond_enemy", cond_enemy, "cond_self", cond_self, "cell_color", cell_color, "cell", loc[i]);

            if (cond_enemy || cond_self) {

                result = "Hurt";
                console.log(result);
                return;

            } else {

                result = "Killed";
                console.log(result);
             }
        }

        if (result == "Killed") {

            killed_paint(elem, map_keys);

            if (check_if_win(map, map_keys, ship_loc)) {

                alert("Nice job, bro!");

            }
        }
    }

function killed_paint(elem, map_keys) {

        /* painting cells surround killed ship */

        var loc = ext_location_foo(elem, map_keys); /* pick up indexes, surrounding current elem */
        console.log("loc in killed: ", loc);
        console.log("elem", elem)

        document.getElementById(elem).innerHTML = "&nbsp;";

        for (let i=0; i < loc.length; i++) {

             var cell_color = document.getElementById(loc[i]).style.backgroundColor;
             console.log("cell_color", cell_color)
             var cell_content = document.getElementById(loc[i]).innerHTML;
             if ((cell_color == "red" || cell_color == "rgb(181, 26, 120)") && cell_content != "&nbsp;") {

                /* if neighbour of current elem is red */

                killed_paint(loc[i], map_keys);

             } else {

                if (document.getElementById(loc[i]).innerHTML != "&nbsp;") {
                    document.getElementById(loc[i]).innerHTML = "X";
                }
              }
        }
    }

function check_if_win(map, map_keys, ship_loc) {

        var killed_cells = [];

        for (let i = 0; i < map_keys.length; i++) {

            try {

                var elem = document.getElementById(map_keys[i]).innerHTML;

                if (elem == "&nbsp;") {

                    killed_cells[i] = map_keys[i];

                }
            } catch(err) {

                continue;
            }
        }

        if (String(ship_loc.sort()) == String(killed_cells.sort())) {

            document.getElementById("state_msg").innerHTML = "You win! Congratulations!!!"
            map.removeEventListener('click', shoot);
            return true;

        }
    }

function check_if_loose() {

        var cell_id = "";
        var count = [];
        for (var i = 0; i < size; i++) {

            for (var j = 0; j < size; j++) {

                cell_id_a = i + "," + j + "-a";
                count.push(document.getElementById(cell_id_a).style.backgroundColor)

            }
        }

        function lime(item) {
            return item == "lime";
        }

        if (count.some(lime)) {

            return;

        } else {

               document.getElementById("state_msg").innerHTML = "Your\
                fleet is defeated. Game over."

               return "You loose";
         }

    }

function shoot_field(map, data2, tmp, map_keys, ship_loc) {

        if (data2[tmp] == "background-color: lime;"){

                document.getElementById(tmp).style.backgroundColor = "red";
                document.getElementById("state_msg").innerHTML = "Gotcha!"
                send_statement(tmp);
                check_surround(map, tmp, map_keys, ship_loc);

            } else {

                document.getElementById(tmp).innerHTML = "X";
                document.getElementById("state_msg").innerHTML = "Good try!"
                send_statement(tmp);
                map.removeEventListener('click', shoot);
             }
    }

function shoot(e) {

        var id = e.target.id;

        if (Object.keys(data2_for_joiner).length == 0) {

            shoot_field(map2_for_creator, data2_for_creator, id, map2_for_creator_keys, ship_loc_for_creator);

        } else {

            shoot_field(map2_for_joiner, data2_for_joiner, id, map2_for_joiner_keys, ship_loc_for_joiner);

         }
    }

async function send_statement(shoot_id) {

        var state_form = JSON.stringify({'cell': shoot_id});
        var json_result = JSON.stringify(state_form);
        var xhr = new XMLHttpRequest();
        var csrfCookie = document.cookie.substring(10);

        xhr.open('POST', "/statement_exchange/", false); /* true => async */

        if (csrfCookie) {

            xhr.setRequestHeader("X-CSRFToken", csrfCookie);

        }

        xhr.addEventListener("load", e => {

            statement = e.target.responseText;

        });
        xhr.send(json_result);
    }

function get_statement() {

        var xhr = new XMLHttpRequest();
        var csrfCookie = document.cookie.substring(10);

        xhr.open('POST', "/statement_get/", true); /* true => async */

        if (csrfCookie) {

            xhr.setRequestHeader("X-CSRFToken", csrfCookie);

        }

        xhr.addEventListener("load", e => {

        try {

            got_statement = JSON.parse(e.target.responseText)['shooted cells'];

        } catch(err) {

//                got_statement = "no shoots yet";

        }
        });
        xhr.send();

        return got_statement;

    }

if (opponent == "None") {

        document.addEventListener('DOMContentLoaded', waiting_with_delay);

} else {

    document.addEventListener('DOMContentLoaded', joiner_fleet);

 }

document.addEventListener('DOMContentLoaded', display);

window.addEventListener('pagehide', cleaning_db);
