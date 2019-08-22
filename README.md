
branch| build status
---|---
master: | [![Build Status](https://travis-ci.com/EgorChernik/TMS-diploma.svg?branch=master)](https://travis-ci.com/EgorChernik/TMS-diploma)
dev: | [![Build Status](https://travis-ci.com/EgorChernik/TMS-diploma.svg?branch=dev)](https://travis-ci.com/EgorChernik/TMS-diploma) |

# TMS-diploma  
It's a project of famous game- SeaBattle.<br>
First, visitor has to signup <br>
Then he sees available for  join games. User can choose existing or create his own game<br>
Then he should choose size, name of the game (if that is new game) and set up his ships by clicking on the cells of game-field.<br>
Finally, user-creator gets to active-game page, where he wait for somebody join his game. When it happened, the state message will say when it's time to shoot.  
# List ToDo for trying at localhost:

Linux system is recommended. I use 16.04 version

1. Clone repo to your local machine. <br> 
    https://github.com/EgorChernik/TMS-diploma.git

2. Note, that you should specify your accessing url in webpack.config.js to:
 
    <pre><code> new webpack.DefinePlugin({
                'SERVICE_URL': JSON.stringify('http://127.0.0.1:8080')
            }),  
    </code></pre>
    You can also point your IP address at your local network. In this case you can share the game in your network scope.
3.  Note, that you need [docker](https://www.docker.com) to be installed. <br>
   
4. Specify your enviroment variables:
   <pre>
   $ export DB_NAME=your_db_name
   $ export DB_USER=user
   $ export DB_PASSWORD=your_secret_pass
   $ export DB_HOST=localhost
   </pre>
   Run out of the directory:
    <code>
    $ docker-compose up
    </code>
5. Now type in your browser:
   <code>
   http://your.IP.address:8080/
   </code>
   Enjoy!
