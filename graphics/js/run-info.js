'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	var speedcontrolBundle = 'nodecg-speedcontrol';
	
	// JQuery selectors.
	var gameTitle = $('#gameTitle'); // game-title.html
	var nextGameTitle = $('#nextGameTitle'); // game-title.html
	var nextGameCat = $('#nextGameCategory'); // game-title.html
	var nextRunner = $('#nextPlayer'); // game-title.html
	var onDeckRunner = $('#onDeckPlayer'); // game-title.html
	var gameCategory = $('#gameCategory'); // game-category.html
	var gameSystem = $('#gameSystem'); // game-system.html
	var gameEstimate = $('#gameEstimate'); // game-estimate.html
	var player = $('#player'); // player.html
	var twitch = $('#twitch'); // twitch.html
        
	// This is where the information is received for the run we want to display.
	// The "change" event is triggered when the current run is changed.
	var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
	runDataActiveRun.on('change', (newVal, oldVal) => {
		if (newVal){
                    updateSceneFields(newVal);
                    //updateSurrInfo(newVal);
                }
	});
	
        // Update the next game
	var runArray = nodecg.Replicant('runDataArray', speedcontrolBundle);
	var surrRuns = nodecg.Replicant('runDataActiveRunSurrounding', speedcontrolBundle);
	surrRuns.on('change', (newVal, oldVal) => {
                updateSurrInfo(newVal);
	});

        function updateSurrInfo(newVal){
            if (newVal){
                console.log(surrRuns.value);
                var nextRun = runArray.value.filter( (run) => run.id == surrRuns.value.next);
                console.log(JSON.stringify(nextRun[0], null, 2));
                nextGameTitle.html(nextRun[0].game);
                nextGameCat.html(nextRun[0].category);
                //if(nextRun[0].teams.length > 1)
                    onDeckRunner.html(getRunnerString(nextRun[0]));
                //else
                    
            }
        }

        function getRunnerString(run) {
            if(run.teams.length>1){
                var a = []
                var b = []
                run.teams[0].players.forEach( (p) => a.push(p.name));
                run.teams[1].players.forEach( (p) => b.push(p.name));
                console.log(a)
                if(a.Length>0)
                    console.log(a.join(', ') + " vs " + b.join(', '));
                    return a.join(', ') + " vs " + b.join(', ');
            }else{
                return run.teams[0].players[0].name
            }
            console.log(nextRun[0].game);
        }
        
	// Sets information on the pages for the run.
	function updateSceneFields(runData) {
		gameTitle.html(runData.game); // game-title.html
		gameCategory.html(runData.category); // game-category.html
		gameSystem.html(runData.system); // game-system.html
		gameEstimate.html(runData.estimate); // game-estimate.html
		
		// Checks if we are on the player.html/twitch.html page.
		// This is done by checking if the #player/#twitch span exists.
		if (player.length || twitch.length) {
			// Open the webpage with a hash parameter on the end to choose the team.
			// eg: http://localhost:9090/bundles/speedcontrol-simpletext/graphics/player.html#2
			// If this can't be found, defaults to 1.
			var playerNumber = parseInt(window.location.hash.replace('#', '')[1]) || 1;
			
			// Arrays start from 0 and not 1, so have to adjust for that.
			//var team = runData.teams[playerNumber-1];
			var teamNumber = parseInt(window.location.hash.replace('#', '')[0]) || 1;
			var team = runData.teams[teamNumber-1];
                        console.log(teamNumber);
			
			// speedcontrol has the ability to have multiple players in a team,
			// but for here we'll just return the 1st one.
			player.html(team.players[playerNumber-1].name); // player.html
			twitch.html("/"+team.players[playerNumber-1].social.twitch); // twitch.html
		}
                //if(runData.teams.length > 1)
                    nextRunner.html(getRunnerString(runData));
	}
});
