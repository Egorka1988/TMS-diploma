# TMS-diploma
It's a project of famous game- SeaBattle.<br>
First, visitor has to signup <br>
Then he sees available for  join games. User can choose existing or create his own game<br>
Then he should choose size, name of the game (if that is new game) and set up his ships by clicking on the cells of game-field.<br>
Finally, user-creator gets to active-game page, where he wait for somebody join his game. When it happened, the state message will say when it's time to shoot.  
# List ToDo for trying at localhost:

Linux system is recommended.I use 16.04 version

1. Download python https://www.python.org/downloads/. This project is started using Python 3.6
2. Setup pip. https://pip.pypa.io/en/stable/installing/
3. Setup virtualenv - <code>pip install virtualenv</code> https://virtualenv.pypa.io/en/stable/installation/
4. Create enviroment variable. (Try to remember its location) <code>virtualenv -p python3 your_project_name-env</code>
5. Activate your enviroment: <code>source your_project_name-env/bin/activate</code> (for unix-based systems), for Windows - <code>cd your_project_name-env/scripts activate</code>
6. Download the project: https://github.com/Egorka1988/TMS-diploma.git
7. Change your directory to dir, where <code>requirements.txt</code> is located. 
8. Run:  <code>pip install -r requirements.txt</code> to install all packages you need for proper start the project.
9. In project is used PostgreSQL v.10.8 database. Let's install it:
    <pre><code>$ sudo apt-get update
    $ sudo apt-get install postgresql postgresql-contrib</code></pre>
    Additional information you can find here: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04 <br>
10. Do not keep so sensitive data like name and password to your database in <code>settings.py</code>. Follow next steps:<br>
    -Find your <code>activate</code> file and open it for edit.<br>
    -Add to the end of file next code:<pre><code>  
    export DB_NAME=your_db_name
    export DB_USER=your_role
    export DB_PASSWORD=your_password</code></pre>
11. Change your dir to dir, where <code>manage.py</code> file is located.<br>
12. Run: <pre><code>
    $ python manage.py migrate
    $ python manage.py runserver
    </code></pre>
13. If everything is well, you will recieve a link http://127.0.0.1:8000/ and your backend is run now.
14. Frontend is written with React+Redux as SPA. 




