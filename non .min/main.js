var alertsound = new Howl({
                src: ['Alert_2.mp3','Alert_2.ogg']
            });

            var winsound = new Howl({
                src: ['You_Win.mp3','You_Win.ogg']
            });

            var endsound = new Howl({
                src: ['Game_ends.mp3','Game_ends.ogg']
            });

            var drawsound = new Howl({
                src: ['Game_ends.mp3','Game_ends.ogg']
            });

            var xhttp;
            if (window.XMLHttpRequest) {
                xhttp = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                xhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            var type; //get id (1) OR enter id (2)
            var id; //it holds the id of the current game session
            var ro; //number of rows
            var co; //number of columns
            var pl; //number of players
            var nam; //name of the player
            var pcolor; //color of the player

            //the following variables are only needed when the game begins
            var colors = []; //array of all players' colors
            var players = []; //array of all players' names
            var currentplayer = 1; //the count of the current player
            var mycount; //the count of the main player
            var grid_data; //the 2D array of the grid which tells which player "owns" the button 
            var rpc = 0; //rpc- Registered Points Count

            var latest_data; //the latest data from the latest.grg file
            var valx; //x value of clicked button
            var valy; //y value of clicked button

            var movedone = false; //has player carried out a move?

            var wait;
            var yeah;
            var pa = 0;
            var start = 0;//servercom depends on this

            var mg = 0;

            var winner;
            
            var audiolvl = 1;

            window.onresize = resize;

            window.onload = function(){
                document.getElementById("screen-2").style.display = 'none';
                document.getElementById('playscreen').style.display = 'none';
                wait = setInterval(wait_players, 500);
                yeah = setInterval(servercom, 200);
            }
            function getid(){
                document.getElementById("screen-1").style.display = 'none';
                type = 1;
                document.getElementById('idbutton').innerHTML = "Copy";
                document.getElementById("screen-2").style.display = 'block';
                document.getElementById('playscreen').style.display = 'none';
                document.getElementById('post-done').style.display = 'none';

                document.getElementById('row').value = 8;
                document.getElementById('column').value = 15;
                document.getElementById('nop').value = 2;
                document.getElementById('idfield').value = "";

                document.getElementById('row').disabled = false;
                document.getElementById('column').disabled = false;
                document.getElementById('nop').disabled = false;
                document.getElementById("idfield").disabled = true;
                document.getElementById('done').disabled = false;

                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        id = this.responseText;
                        document.getElementById("idfield").value = hexTo64(this.responseText);
                    }
                };
                xhttp.open("GET", "Multiplayer/begin.php", true);
                xhttp.send();
                document.getElementById("idfield").disabled = true;
                
            }
            function enterid(){
                document.getElementById("screen-1").style.display = 'none';
                type = 2;
                document.getElementById('idbutton').innerHTML = "Connect";
                document.getElementById("screen-2").style.display = 'block';
                document.getElementById('post-done').style.display = 'none';
                document.getElementById('playscreen').style.display = 'none';

                document.getElementById('row').value = "";
                document.getElementById('column').value = "";
                document.getElementById('nop').value = "";
                document.getElementById('idfield').value = "";

                document.getElementById('row').disabled = true;
                document.getElementById('column').disabled = true;
                document.getElementById('nop').disabled = true;
                document.getElementById("idfield").disabled = false;
                document.getElementById('done').disabled = true;

            }
            function copybutton(){
                if (type==1){
                    var copyTextarea = document.querySelector('.js-copytextarea');
                    document.getElementById("idfield").disabled = false;
                    copyTextarea.select();
                    try {
                        var successful = document.execCommand('copy');
                        var msg = successful ? 'successful' : 'unsuccessful';
                    } catch (err) {window.alert("Not supported in your browser");}
                    document.getElementById("idfield").disabled = true;
                }
                else{

                    id = document.getElementById('idfield').value;
                    if (id == ""){
                        window.alert("No ID specified! Please enter ID in the given textbox.");
                    }
                    else{
                        //AJAX based code for connecting to server to get info about the game
						id = hexFrom64(id)
                        xhttp.onreadystatechange = function() {
                            if (this.readyState == 4 && this.status == 200) {

                                var out = this.responseText;
                                if (out == ""){
                                    window.alert("The configuration of the game has not been completed. Please try again.")
                                }
                                else{
                                    var spl = out.split("\n");
                                    ro = spl[1];
                                    co = spl[2];
                                    pl = spl[0];
                                    document.getElementById('row').value = spl[1];
                                    document.getElementById('column').value = spl[2];
                                    document.getElementById('nop').value = spl[0];
                                    document.getElementById('done').disabled = false;
                                }
                            }
                            else if (this.readyState == 4 && this.status == 404){
                                window.alert("Incorrect ID entered");
                            }
                        };
                        xhttp.open("GET", "Multiplayer/" + id + "/game_data.grg", true);
                        xhttp.send();
                    }
                }
            }
            function canc(){
                document.getElementById("screen-2").style.display = 'none';
                type = 1;
                document.getElementById("screen-1").style.display = 'block';
            }
            function done(){
                //Most important piece of code.
                nam = document.getElementById('name').value;
                pcolor = document.getElementById('col').style.backgroundColor;
                if (nam == ""){
                    window.alert("Name not specified")
                }
                else{
                    if (type==1){
                        ro = document.getElementById('row').value;
                        co = document.getElementById('column').value;
                        pl = document.getElementById('nop').value;

                        if (ro < 5){ro = 5;}
                        if (co < 5){co = 5;}
                        if (pl < 2){pl = 2;}
                        if (ro > 17){ro = 17;}
                        if (co > 32){co = 32;}
                        if (pl > 6){pl = 6;}

                        document.getElementById("idfield").disabled = true;
                        document.getElementById('row').disabled = true;
                        document.getElementById('column').disabled = true;
                        document.getElementById('nop').disabled = true;
                        document.getElementById('name').disabled = true;
                        document.getElementById('col').disabled = true;
                        document.getElementById('cancel').disabled = true;
                        document.getElementById('done').disabled = true;

                        document.getElementById('post-done').style.display = 'block';

                        xhttp.onreadystatechange = function() {
                            if (this.readyState == 4 && this.status == 200) {
                                pa = 1;
                            }
                        };
                        xhttp.open("GET", "Multiplayer/setup.php?g_id=" + id + "&nop=" + pl + "&gridr=" + ro + "&gridc=" + co + "&pname=" + nam + "&color=" + pcolor, true);
                        xhttp.send();

                    }
                    else{
                        document.getElementById("idfield").disabled = true;
                        document.getElementById('row').disabled = true;
                        document.getElementById('column').disabled = true;
                        document.getElementById('nop').disabled = true;
                        document.getElementById('name').disabled = true;
                        document.getElementById('col').disabled = true;
                        document.getElementById('cancel').disabled = true;
                        document.getElementById('done').disabled = true;
                        document.getElementById('idbutton').disabled = true;

                        document.getElementById('post-done').style.display = 'block';

                        xhttp.onreadystatechange = function() {
                            if (this.readyState == 4 && this.status == 200) {
                                var res = this.responseText;
                                if (res == "ERR1"){
                                    window.alert("Another player has same color.");
                                    document.getElementById('col').disabled = false;
                                    document.getElementById('done').disabled = false;
                                    document.getElementById('name').disabled = false;
                                    document.getElementById('post-done').style.display = 'none';
                                }
                                else if (res == "ERR2"){
                                    window.alert("Another player has same name.");
                                    document.getElementById('col').disabled = false;
                                    document.getElementById('done').disabled = false;
                                    document.getElementById('name').disabled = false;
                                    document.getElementById('post-done').style.display = 'none';
                                }
                                else if (res == "ERR3"){
                                    window.alert("The required number of players are already registered. You cannot join.");
                                    location.reload(true);
                                }
                                else if (res == ""){
                                    //this is PASS.
                                    colors = new Array(pl);
                                    players = new Array(pl);
                                    pa = 1;
                                }
                                else{
                                    window.alert("Another player has same name and color.");
                                    document.getElementById('col').disabled = false;
                                    document.getElementById('done').disabled = false;
                                    document.getElementById('name').disabled = false;
                                    document.getElementById('post-done').style.display = 'none';
                                }
                            }
                        };
                        xhttp.open("GET", "Multiplayer/player_setup.php?g_id=" + id + "&player_name=" + nam + "&color=" + pcolor, true);
                        xhttp.send();
                    }
                }
            }

            function wait_players(){
                if (pa == 1){
                    var ahttp;
                    if (window.XMLHttpRequest) {
                        ahttp = new XMLHttpRequest();
                    }    
                    else {
                        // code for IE6, IE5
                        ahttp = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    ahttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            var received = this.responseText;
                            var arr = received.split('\n');
                            var i = 1;
                            var cox = 0;
                            for (var x = 0, len = arr.length; x < len; x++) {
                                var a = arr[x];
                                if (a != ""){
                                    if (i % 2 == 0){
                                        //defines color
                                        colors[cox] = a;
                                        cox = cox + 1;
                                    }
                                    else{
                                        //defines name
                                        players[cox] = a;
                                        if (a == nam){
                                            mycount = cox + 1;
                                        }
                                    }
                                    i = i + 1;
                                }
                            }
                            if (cox == pl){
                                var superhttp;
                                if (window.XMLHttpRequest) {
                                    superhttp = new XMLHttpRequest();
                                } else {
                                    // code for IE6, IE5
                                    superhttp = new ActiveXObject("Microsoft.XMLHTTP");
                                }
                                if (mg != 3){
                                    superhttp.open("GET", "Multiplayer/seen.php?g_id=" + id + "&player=" + mycount, true);
                                    superhttp.send();
                                    pa = 0;
                                    mg = 1;
                                    makegrid();
                                }
                                clearInterval(wait);
                            }
                        }
                    };
                    ahttp.open("GET", "Multiplayer/" + id + "/players.grg" , true);
                    ahttp.send();
                }
            }

            function makegrid(){
                if (mg == 1){
                    mg = 3;
                    //initializing the grid_data array.
                    grid_data = new Array(ro);
                    for (var i = 0; i < ro; i++) {
                        grid_data[i] = new Array(co);
                        for (var j = 0; j < co; j++){
                            grid_data[i][j] = 0;
                        }
                    }

                    if (currentplayer == mycount){
                        document.getElementById('status').innerHTML = "<div>Your turn</div>";
                        alertsound.volume(audiolvl);
                        alertsound.play();
                    }
                    else{
                        document.getElementById('status').innerHTML = "<div>"+ players[currentplayer - 1] +"'s turn</div>";
                    }

                    var cola = colors[currentplayer - 1].split(")")[0].split("(")[1].split(",");
                    var textColour = colourIsLight(cola[0], cola[1], cola[2]) ? 'black' : 'white';

                    document.getElementById('status').style.backgroundColor = colors[currentplayer - 1];
                    document.getElementById('status').style.color = textColour;

                    document.getElementById("screen-2").style.display = 'none';
                    document.getElementById('playscreen').style.display = 'block';
                    document.getElementById('status').style.display = 'block';
                    document.getElementById('soundconf').style.display = 'block';

                    var hmm = document.getElementById('playscreen');
                    var hei = (window.innerHeight - 80) / ro;
                    var wid = (document.body.clientWidth - 10) / co;
                    for(var i = 0; i < ro; i++)
                    {

                        for(var j = 0; j < co; j++)
                        {
                            hmm.innerHTML += "<input type='button' class='gridbuttons' disabled='true' onclick='chandle(" + i.toString() + "," + j.toString() + ")' id='" + i.toString()+ "-" + j.toString() + "'/>";
                            var bu = document.getElementById(i.toString() + "-" + j.toString());
                            bu.style.height = hei + "px";
                            bu.style.width = wid + "px";
                            
                        }
                        hmm.innerHTML += "<br>";
                    }
                    for(var j = 0; j < co; j++){
                        var m = (i - 1).toString()+ "-" + j.toString();
                        document.getElementById(m).disabled = false;
                        document.getElementById(m).style.backgroundColor = 'cadetblue';
                    }

                    start = 1; //initialize server communication

                }
            }

            function chandle(a,b){
                if (mycount == currentplayer){
                    var here = document.getElementById(a + "-" + b);
                    var uphere;
                    if (a == 0){
                        uphere = here;
                    }
                    else{
                        uphere = document.getElementById((a - 1) + "-" + b);
                    }
                    if ((uphere.disabled == true) || (here.value == "")){
                        if (mg == 3 && !movedone){
                            movedone = true;
                            valx = a;
                            valy = b;
                            mg = 1;
                        }					
                    }
                    else{
                        alert("This box has already been clicked! Invalid move!");
                    }
                }
                else{
                    alert("Not your turn.");
                }
            }

            function servercom(){
                if(start == 1){
                    start = 0;

                    var sendmove;
                    var getlatest;
                    var seenmaker;
                    if (window.XMLHttpRequest) {
                        sendmove = new XMLHttpRequest();
                    }    
                    else{
                        sendmove = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    if (window.XMLHttpRequest) {
                        getlatest = new XMLHttpRequest();
                    }    
                    else{
                        getlatest = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    if (window.XMLHttpRequest) {
                        seenmaker = new XMLHttpRequest();
                    }    
                    else{
                        seenmaker = new ActiveXObject("Microsoft.XMLHTTP");
                    }



                    if (movedone){
                        sendmove.onreadystatechange = function(){
                            if(this.readyState == 4 && this.status == 200){
                                var st = this.responseText;
                                if (st == "Invalid" && movedone)
                                {
                                    alert("Previous move not yet seen by everyone!");
                                }
                                else if (st == "Sent"){
                                    mg = 3;

                                    var x = valx;
                                    var y = valy;


                                    if (x != 0)
                                    {
                                        var clickbut = document.getElementById(x + "-" + y);
                                        var aboveclickbut = document.getElementById((x - 1) + "-" + y)

                                        }
                                    else
                                    {
                                        var clickbut = document.getElementById(x + "-" + y);
                                        var aboveclickbut = clickbut;
                                    }

                                    //code for button press handling!
                                    aboveclickbut.disabled = false;
                                    aboveclickbut.style.backgroundColor = 'cadetblue';
                                    clickbut.value = mycount;

                                    var cola = colors[mycount - 1].split(")")[0].split("(")[1].split(",");
                                    var textColour = colourIsLight(cola[0], cola[1], cola[2]) ? 'black' : 'white';

                                    clickbut.style.backgroundColor = colors[mycount - 1];
                                    clickbut.style.color = textColour;

                                    grid_data[x][y] = mycount;


                                    rpc++;

                                    //winchecking code follows!

                                    var winint = 0;
                                    var skipz = 0;
                                    var skipza = 0;
                                    var skipo = 0;
                                    var skipoa = 0;
                                    var z = x - 3;
                                    var za = x + 3;
                                    var o = y + 3;
                                    var oa = y - 3;
                                    if (z < 0) { skipz = -z; z = 0; }
                                    if (za >= ro) { skipza = za - (ro - 1); za = ro - 1; }
                                    if (o >= co) { skipo = o - (co - 1); o = co - 1; }
                                    if (oa < 0) { skipoa = -oa; oa = 0; }


                                    var m = grid_data[z][y];
                                    for (var i = z; i <= za; i++)
                                    {
                                        if (grid_data[i][y] == m && m != 0)
                                        {
                                            winint++;
                                        }
                                        else { winint = 1; m = grid_data[i][y]; }

                                        if (winint == 4)
                                        {
                                            document.getElementById(i + "-" + y).style.backgroundColor = 'black';
                                            document.getElementById((i - 1) + "-" + y).style.backgroundColor = 'black';
                                            document.getElementById((i - 2) + "-" + y).style.backgroundColor = 'black';
                                            document.getElementById((i - 3) + "-" + y).style.backgroundColor = 'black';

                                            //execute win statement...
                                            winner = mycount;
                                            setTimeout(winhandle, 500);

                                        }
                                    }

                                    winint = 0;
                                    m = grid_data[za][oa];
                                    var ox = oa + skipza - skipoa;
                                    if (ox < 0) { ox = 0; }
                                    if (ox > co - 1) { ox = co - 1; }
                                    for (var i = za; i >= z; i--)
                                    {
                                        if (grid_data[i][ox] == m && m != 0)
                                        {
                                            winint++;
                                        }
                                        else
                                        {
                                            winint = 1;
                                            m = grid_data[i][ox];
                                        }
                                        if (winint == 4)
                                        {
                                            document.getElementById(i + "-" + ox).style.backgroundColor = 'black';
                                            document.getElementById((i + 1) + "-" + (ox - 1)).style.backgroundColor = 'black';
                                            document.getElementById((i + 2) + "-" + (ox - 2)).style.backgroundColor = 'black';
                                            document.getElementById((i + 3) + "-" + (ox - 3)).style.backgroundColor = 'black';

                                            //execute win statement...
                                            winner = mycount;
                                            setTimeout(winhandle, 500);
                                        }
                                        ox++;
                                        if (ox > o) { break; }
                                    }

                                    winint = 0;
                                    m = grid_data[x][oa];
                                    for (var i = oa; i <= o; i++)
                                    {
                                        if (grid_data[x][i] == m && m != 0)
                                        {
                                            winint++;
                                        }
                                        else { winint = 1; m = grid_data[x][i]; }

                                        if (winint == 4)
                                        {
                                            document.getElementById(x + "-" + i).style.backgroundColor = 'black';
                                            document.getElementById(x + "-" + (i - 1)).style.backgroundColor = 'black';
                                            document.getElementById(x + "-" + (i - 2)).style.backgroundColor = 'black';
                                            document.getElementById(x + "-" + (i - 3)).style.backgroundColor = 'black';

                                            //execute win statement...
                                            winner = mycount;
                                            setTimeout(winhandle, 500);
                                        }
                                    }
                                    winint = 0;
                                    var za4l = za;
                                    var o4l = o;
                                    var z4l = z;
                                    var oa4l = oa;

                                    if (skipo > skipza) { za4l = za - (skipo - skipza); }
                                    else if (skipza > skipo) { o4l = o - (skipza - skipo); }
                                    if (skipoa > skipz) { z4l = z + (skipoa - skipz); }
                                    else if (skipz > skipoa) { oa4l = oa + (skipz - skipoa); }
                                    ox = oa4l;

                                    m = grid_data[z4l][ox];
                                    for (var i = z4l; i <= za4l; i++)
                                    {
                                        if (grid_data[i][ox] == m && m != 0)
                                        {
                                            winint++;
                                        }
                                        else
                                        {
                                            winint = 1;
                                            m = grid_data[i][ox];
                                        }
                                        if (winint == 4)
                                        {
                                            document.getElementById(i + "-" + ox).style.backgroundColor = 'black';
                                            document.getElementById((i - 1) + "-" + (ox - 1)).style.backgroundColor = 'black';
                                            document.getElementById((i - 2) + "-" + (ox - 2)).style.backgroundColor = 'black';
                                            document.getElementById((i - 3) + "-" + (ox - 3)).style.backgroundColor = 'black';

                                            //execute win statement...
                                            winner = mycount;
                                            setTimeout(winhandle, 500);
                                        }
                                        ox++;
                                        if (ox > o4l) { break; }
                                    }

                                    if (rpc == co*ro){
                                        drawsound.volume(audiolvl);
                                        drawsound.play();
                                        alert("Draw!");
                                    }
                                    if (mycount == pl){
                                        currentplayer = 1; 
                                    }
                                    else{
                                        currentplayer++; 
                                    }

                                    if (currentplayer == mycount){
                                        document.getElementById('status').innerHTML = "<div>Your turn</div>";
                                        alertsound.volume(audiolvl);
                                        alertsound.play();
                                    }
                                    else{
                                        document.getElementById('status').innerHTML = "<div>"+ players[currentplayer - 1] +"'s turn</div>";
                                    }

                                    cola = colors[currentplayer - 1].split(")")[0].split("(")[1].split(",");
                                    textColour = colourIsLight(cola[0], cola[1], cola[2]) ? 'black' : 'white';

                                    document.getElementById('status').style.backgroundColor = colors[currentplayer - 1];
                                    document.getElementById('status').style.color = textColour;                 


                                }
                                movedone = false;
                            }
                        }
                        if (mg == 1){
                            sendmove.open("GET", "Multiplayer/move.php?g_id=" + id + "&by=" + mycount + "&x=" + valx + "&y=" + valy, true);
                            sendmove.send();
                        }	
                    }

                    getlatest.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {

                            var dat = this.responseText;
                            if (dat == "UNCON")
                            {
                                //refresh page after displaying alert.
                                alert("A player has disconnected. Game ended. Page will now refresh")
                                location.reload();
                            }

                            else if (dat != latest_data && dat != "")
                            {

                                latest_data = dat;
                                var part = dat.split(',');
                                var x = Number(part[0]);
                                var y = Number(part[1]);
                                var pcl = part[2];



                                if (pcl != mycount)
                                {
                                    currentplayer = pcl;
                                    seenmaker.open("GET", "Multiplayer/seen.php?g_id=" + id + "&player=" + mycount, true);
                                    seenmaker.send();

                                    if (x != 0)
                                    {
                                        var clickbut = document.getElementById(x + "-" + y);
                                        var aboveclickbut = document.getElementById((x - 1) + "-" + y)

                                        }
                                    else
                                    {
                                        var clickbut = document.getElementById(x + "-" + y);
                                        var aboveclickbut = clickbut;
                                    }

                                    //code for button press handling!
                                    aboveclickbut.disabled = false;
                                    aboveclickbut.style.backgroundColor = 'cadetblue';
                                    clickbut.value = currentplayer;

                                    var cola = colors[currentplayer - 1].split(")")[0].split("(")[1].split(",");
                                    var textColour = colourIsLight(cola[0], cola[1], cola[2]) ? 'black' : 'white';

                                    clickbut.style.backgroundColor = colors[currentplayer - 1];
                                    clickbut.style.color = textColour;

                                    grid_data[x][y] = currentplayer;


                                    rpc++;

                                    //winchecking code follows!

                                    var winint = 0;
                                    var skipz = 0;
                                    var skipza = 0;
                                    var skipo = 0;
                                    var skipoa = 0;
                                    var z = x - 3;
                                    var za = x + 3;
                                    var o = y + 3;
                                    var oa = y - 3;
                                    if (z < 0) { skipz = -z; z = 0; }
                                    if (za >= ro) { skipza = za - (ro - 1); za = ro - 1; }
                                    if (o >= co) { skipo = o - (co - 1); o = co - 1; }
                                    if (oa < 0) { skipoa = -oa; oa = 0; }


                                    var m = grid_data[z][y];
                                    for (var i = z; i <= za; i++)
                                    {
                                        if (grid_data[i][y] == m && m != 0)
                                        {
                                            winint++;
                                        }
                                        else { winint = 1; m = grid_data[i][y]; }

                                        if (winint == 4)
                                        {
                                            document.getElementById(i + "-" + y).style.backgroundColor = 'black';
                                            document.getElementById((i - 1) + "-" + y).style.backgroundColor = 'black';
                                            document.getElementById((i - 2) + "-" + y).style.backgroundColor = 'black';
                                            document.getElementById((i - 3) + "-" + y).style.backgroundColor = 'black';

                                            //execute win statement...
                                            winner = currentplayer;
                                            setTimeout(winhandle, 500);
                                        }
                                    }

                                    winint = 0;
                                    m = grid_data[za][oa];
                                    var ox = oa + skipza - skipoa;
                                    if (ox < 0) { ox = 0; }
                                    if (ox > co - 1) { ox = co - 1; }
                                    for (var i = za; i >= z; i--)
                                    {
                                        if (grid_data[i][ox] == m && m != 0)
                                        {
                                            winint++;
                                        }
                                        else
                                        {
                                            winint = 1;
                                            m = grid_data[i][ox];
                                        }
                                        if (winint == 4)
                                        {
                                            document.getElementById(i + "-" + ox).style.backgroundColor = 'black';
                                            document.getElementById((i + 1) + "-" + (ox - 1)).style.backgroundColor = 'black';
                                            document.getElementById((i + 2) + "-" + (ox - 2)).style.backgroundColor = 'black';
                                            document.getElementById((i + 3) + "-" + (ox - 3)).style.backgroundColor = 'black';

                                            //execute win statement...
                                            winner = currentplayer;
                                            setTimeout(winhandle, 500);
                                        }
                                        ox++;
                                        if (ox > o) { break; }
                                    }

                                    winint = 0;
                                    m = grid_data[x][oa];
                                    for (var i = oa; i <= o; i++)
                                    {
                                        if (grid_data[x][i] == m && m != 0)
                                        {
                                            winint++;
                                        }
                                        else { winint = 1; m = grid_data[x][i]; }

                                        if (winint == 4)
                                        {
                                            document.getElementById(x + "-" + i).style.backgroundColor = 'black';
                                            document.getElementById(x + "-" + (i - 1)).style.backgroundColor = 'black';
                                            document.getElementById(x + "-" + (i - 2)).style.backgroundColor = 'black';
                                            document.getElementById(x + "-" + (i - 3)).style.backgroundColor = 'black';

                                            //execute win statement...
                                            winner = currentplayer;
                                            setTimeout(winhandle, 500);
                                        }
                                    }
                                    winint = 0;
                                    var za4l = za;
                                    var o4l = o;
                                    var z4l = z;
                                    var oa4l = oa;

                                    if (skipo > skipza) { za4l = za - (skipo - skipza); }
                                    else if (skipza > skipo) { o4l = o - (skipza - skipo); }
                                    if (skipoa > skipz) { z4l = z + (skipoa - skipz); }
                                    else if (skipz > skipoa) { oa4l = oa + (skipz - skipoa); }
                                    ox = oa4l;

                                    m = grid_data[z4l][ox];
                                    for (var i = z4l; i <= za4l; i++)
                                    {
                                        if (grid_data[i][ox] == m && m != 0)
                                        {
                                            winint++;
                                        }
                                        else
                                        {
                                            winint = 1;
                                            m = grid_data[i][ox];
                                        }
                                        if (winint == 4)
                                        {
                                            document.getElementById(i + "-" + ox).style.backgroundColor = 'black';
                                            document.getElementById((i - 1) + "-" + (ox - 1)).style.backgroundColor = 'black';
                                            document.getElementById((i - 2) + "-" + (ox - 2)).style.backgroundColor = 'black';
                                            document.getElementById((i - 3) + "-" + (ox - 3)).style.backgroundColor = 'black';

                                            //execute win statement...
                                            winner = currentplayer;
                                            setTimeout(winhandle, 500);
                                        }
                                        ox++;
                                        if (ox > o4l) { break; }
                                    }

                                    if (rpc == co*ro){
                                        drawsound.volume(audiolvl);
                                        drawsound.play();
                                        alert("Draw!");
                                    }
                                    if (currentplayer == pl){
                                        currentplayer = 1; 
                                    }
                                    else{
                                        currentplayer++; 
                                    }

                                    if (currentplayer == mycount){
                                        document.getElementById('status').innerHTML = "<div>Your turn</div>";
                                        alertsound.volume(audiolvl);
                                        alertsound.play();
                                    }
                                    else{
                                        document.getElementById('status').innerHTML = "<div>"+ players[currentplayer - 1] +"'s turn</div>";
                                    }

                                    cola = colors[currentplayer - 1].split(")")[0].split("(")[1].split(",");
                                    textColour = colourIsLight(cola[0], cola[1], cola[2]) ? 'black' : 'white';

                                    document.getElementById('status').style.backgroundColor = colors[currentplayer - 1];
                                    document.getElementById('status').style.color = textColour;                 
                                }

                            }
                        }

                    }
                    getlatest.open("GET", "Multiplayer/" + id + "/latest.grg", true);
                    getlatest.send();

                    start = 1;
                }
            }

            function winhandle(){
                var ac = winner;
                if (mycount == ac){
                    winsound.volume(audiolvl);
                    winsound.play();
                    alert("You won! You will now be returned to main menu");
                }
                else{
                    endsound.volume(audiolvl);
                    endsound.play();
                    alert("You lost. " + players [ac - 1] + " won. You will now be returned to main menu");
                }
                //refresh the page
                location.reload();
            }

            function resize(){
                if (start == 1){    

                    var hei = (window.innerHeight - 80) / ro;
                    var wid = (document.body.clientWidth - 10) / co;
                    for(var i = 0; i < ro; i++)
                    {

                        for(var j = 0; j < co; j++)
                        {
                            var bu = document.getElementById(i.toString() + "-" + j.toString());
                            bu.style.height = hei + "px";
                            bu.style.width = wid + "px";
                        }
                    }

                }
            }
            var colourIsLight = function (r, g, b) {
                var a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                return (a < 0.5);
            }
            
            function setvol(vlvl){
                audiolvl = vlvl / 10;
            }