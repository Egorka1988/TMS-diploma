# TMS-diploma
It's a project of famous game- SeaBattle.<br>
First, visitor has to signup, then he comes to the login page. <br>
Then he sees other players, who is currently online. <br>
Authentificated user chooses an opponent and size of game-field. When pressing submit-button, user sends inviting to his opponent. <br>
Then he should set up his ships by clicking on the cells of game-field.<br>
Finally, when the opponent accepted inviting and set his ships up the battle begins. 
# List ToDo for trying at localhost:

linux system recommended.

1. Download python https://www.python.org/downloads/</li>
2. Setup pip. https://pip.pypa.io/en/stable/installing/
3. Setup virtualenv - <code>pip install virtualenv</code> https://virtualenv.pypa.io/en/stable/installation/
4. Create enviroment variable. (Try to remember its location) <code>virtualenv env1</code>
5. Activate your enviroment: <code>source env1/bin/activate</code> (for unix-based systems), for Windows - <code>cd env1/scripts activate</code>
6. Install ipython - <code>pip install ipython</code> Interactive mode - in ipython console.
7. Download the project: https://github.com/Egorka1988/TMS-diploma.git
8. Change your directory to dir, where requirements.txt is located. 
9. Run:  <code>pip install -r requirements.txt</code> to install all packages you need for proper start the project.
10. In project is used PostgreSQL database. Let's install it:
<pre><code>$ sudo apt-get update
$ sudo apt-get install postgresql postgresql-contrib</code></pre>
Additional information you can find here: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04
11. Do not keep so sensitive data like name and password to your database in settings.py. Follow next:
-find your activate file and open it for edit.
-add to the end of file next code:
<code> 



