
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
    var result = JSON.parse(form);
    for (var i=0; i < size; i++) {
        for (var j=0; j < size; j++) {
            cell_id =i+","+j;
            color = result[cell_id];
            document.getElementById(cell_id).style = color;
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
        <!--xhr.addEventListener("error", e => {-->
            <!--console.log(e);-->
        <!--});-->
        xhr.open('GET', "/awaited_fleet/", true); /* true => async */
        console.log("data2_of_querying: ", data2);
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
            if (tmp.length == 0) {

                tmp = Object.keys(querying());
                console.log("tmp :", tmp);
                await sleep(5000);

            } else {

                    console.log("break. Enemy's fleet has arrived");
                    document.getElementById("state_msg").innerHTML = "\
                        Enemy's fleet has arrived. Get ready to fight!"
                    await sleep(5000);
                    document.getElementById("state_msg").innerHTML = "FIRE!!!"
                    break;

              };
            if (i == 0) {

                document.getElementById("state_msg").innerHTML = "Your fleet\
                 is so strong ,that nobody has enough bravery fighting with you";

            };
        };
    };

document.addEventListener('DOMContentLoaded', display);
if (opponent == "None") {

        document.addEventListener('DOMContentLoaded', waiting_with_delay);

    };
window.addEventListener('pagehide', cleaning_db);