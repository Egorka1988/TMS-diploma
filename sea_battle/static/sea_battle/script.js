
var enemy_map = document; /* default value */
var joiner = "Nobody yet";

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

function joiner_querying() { /* asks the server if player-joiner created his fleet and returns data if yes */

        console.log("waiting...");
        document.getElementById("state_msg").innerHTML = "We are\
            still waiting for enemy's fleet...";
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", e => {

            joiner = JSON.parse(e.target.responseText);
            console.log('xhr', joiner);

        });
        var url = "/awaited_fleet/" + game_id;
        xhr.open('GET', url, true); /* true => async */
        xhr.send();
        console.log(joiner)
        return joiner;
    }

function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /* function, that waits for a fleet of enemy, that should join the game.
    function runs by player, who has created game */

async function waiting_for_joiner() {

        var i = 20;

        while (i < 501) {
            i--;
            await sleep(5000);
            var joiner = joiner_querying()
            if (joiner != "Nobody yet") {

                console.log("break. Enemy's fleet has arrived");
                document.getElementById("state_msg").innerHTML = "\
                    enemy's fleet has arrived. Get ready to fight!"
                await sleep(3000);
                document.getElementById("state_msg").innerHTML = "FIRE!!!"

                /* global var map2. Need for work with removing Listener after miss */

                enemy_map = document.getElementById("opponent_table");
                enemy_map.addEventListener('click', shoot);
                break;

              }

            if (i == 0) {

                document.getElementById("state_msg").innerHTML = "Your fleet\
                 is so strong ,that nobody has enough bravery fighting with you";
                return;

            }
        }

        display_destroy();

    }

function joiner_fleet() {

        enemy_map = document.getElementById("opponent_table");

        document.getElementById("state_msg").innerHTML = "Oops! Ambush!\
         You are under the fire! \n Waiting for enemy's shoot...";

        display_destroy ();
    }

async function display_destroy(map_keys) {

        var shoot_log = [];
        while (true) {

            var callback = receive_shoot_result();
            await sleep(3000);
            console.log(callback)
            shoot_log = callback;
            for (var i = 0; i< callback.length; i++) {

                cell_id_a = shoot_log[i]+"-a";

                if (form[shoot_log[i]] === "background-color: lime;") {

                    enemy_map.addEventListener('click', shoot);
                    document.getElementById(cell_id_a).style.backgroundColor = "#B51A78";

//                            await sleep(1000);
//                            alert("You loose, bro. I believe, next time it will be better");
//                            return;
//                        document.getElementById("state_msg").innerHTML = "Alarm! \
//                            Hurt! Keep the defence!";

                } else {

//                    document.getElementById(cell_id_a).innerHTML = "X";
                    document.getElementById("state_msg").innerHTML = "Now your\
                        turn. FIRE!!!";
                    enemy_map.addEventListener('click', shoot);

                 }
            }

        }
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


//     win result:
//        if (String(ship_loc.sort()) == String(killed_cells.sort())) {
//
//            document.getElementById("state_msg").innerHTML = "You win! Congratulations!!!"
//            map.removeEventListener('click', shoot);


//  loose result
//               document.getElementById("state_msg").innerHTML = "Your\
//                fleet is defeated. Game over."


//function shoot_field(map, data2, tmp, map_keys, ship_loc) {
//
//        if (data2[tmp] == "background-color: lime;"){
//
//                document.getElementById(tmp).style.backgroundColor = "red";
//                document.getElementById("state_msg").innerHTML = "Gotcha!"
//                send_statement(tmp);
//                check_surround(map, tmp, map_keys, ship_loc);
//
//            } else {
//
//                document.getElementById(tmp).innerHTML = "X";
//                document.getElementById("state_msg").innerHTML = "Good try!"
//                send_statement(tmp);
//                map.removeEventListener('click', shoot);
//             }
//    }

function shoot(e) {

        var id = e.target.id;
        enemy_map.removeEventListener('click', shoot);

        res_of_shoot = send_shoot(id);

    }

async function send_shoot(shoot_id) {

        var parcel = {};
        parcel['game_id'] = game_id;
        parcel['target'] = shoot_id;

        var json_result = JSON.stringify(parcel);
        var xhr = new XMLHttpRequest();
        var csrfCookie = document.cookie.substring(10);

        xhr.open('POST', "/shoot/", true); /* true => async */

        if (csrfCookie) {

            xhr.setRequestHeader("X-CSRFToken", csrfCookie);

        }
        xhr.send(json_result);
    }

function receive_shoot_result() {

        var xhr = new XMLHttpRequest();
        var csrfCookie = document.cookie.substring(10);
        var parcel = {
                        'game_id':  game_id,
                        'identity': identity
                     };
        var json_result = JSON.stringify(parcel);

        xhr.open('POST', "/statement_get/", true); /* true => async */

        if (csrfCookie) {

            xhr.setRequestHeader("X-CSRFToken", csrfCookie);

        }

        xhr.addEventListener("load", e => {

        try {

            got_statement = JSON.parse(e.target.responseText);

        } catch(err) {

                got_statement = "no shoots yet";

        }
        });
        xhr.send(json_result);
        console.log(got_statement);
        return got_statement;

    }

if (identity == "creator") {

        document.addEventListener('DOMContentLoaded', waiting_for_joiner);

} else {

    document.addEventListener('DOMContentLoaded', joiner_fleet);

 }

document.addEventListener('DOMContentLoaded', display);

window.addEventListener('pagehide', cleaning_db);
