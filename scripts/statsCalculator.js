export function calculateStats(player, playerMatches){ 
    var wonMatches = 0, lostMatches = 0, titles = 0, bestWin = undefined;
    var aces = 0, doubleFaults = 0, servePoints = 0, fServeIn = 0, fServeWon = 0, sServeWon = 0;
    var bpSaved = 0, bpFaced = 0, retBpSaved = 0, retBpFaced = 0;
    var retServePoints = 0, retFServeIn = 0, retFServeWon = 0, retSServeWon = 0;
    var countryStats = {};

    for(var match of playerMatches){
        if(match.winner_id == player.id){
            wonMatches++;

            if(match.round == 'F')
                titles++;

            if(match.loser_rank != "" && match.loser_rank_points != ""){
                if(bestWin == undefined){
                    bestWin = match;
                }
                else if(parseInt(match.loser_rank) < parseInt(bestWin.loser_rank) || 
                    ((parseInt(match.loser_rank) == parseInt(bestWin.loser_rank)) && (parseInt(match.loser_rank_points) > parseInt(bestWin.loser_rank_points)))){
                    bestWin = match;
                }
            }
            if(!(match.loser_ioc in countryStats)){
                countryStats[match.loser_ioc] = {wins: 1, losses: 0, players: {}};
                countryStats[match.loser_ioc].players[match.loser_name] = {wins: 1, losses: 0};
            }
            else {
                countryStats[match.loser_ioc].wins += 1;
                if(match.loser_name in countryStats[match.loser_ioc].players){
                    countryStats[match.loser_ioc].players[match.loser_name].wins += 1;
                }
                else countryStats[match.loser_ioc].players[match.loser_name] = {wins: 1, losses: 0};
            }
        }
        else {
            lostMatches++;
            if(!(match.winner_ioc in countryStats)){
                countryStats[match.winner_ioc] = {wins: 0, losses: 1, players: {}};
                countryStats[match.winner_ioc].players[match.winner_name] = {wins: 0, losses: 1};
            }
            else{
                countryStats[match.winner_ioc].losses += 1;
                if(match.winner_name in countryStats[match.winner_ioc].players){
                    countryStats[match.winner_ioc].players[match.winner_name].losses += 1;
                }
                else countryStats[match.winner_ioc].players[match.winner_name] = {wins: 0, losses: 1};
            }
        }
        if(match.w_ace != '' && match.l_ace != '')
            aces += (match.winner_id == player.id) ? parseInt(match.w_ace) : parseInt(match.l_ace);

        if(match.w_df != '' && match.l_df != '')
            doubleFaults += (match.winner_id == player.id) ? parseInt(match.w_df) : parseInt(match.l_df);

        if(match.w_svpt != '' && match.l_svpt != ''){
            servePoints += (match.winner_id == player.id) ? parseInt(match.w_svpt) : parseInt(match.l_svpt);
            retServePoints += (match.winner_id == player.id) ? parseInt(match.l_svpt) : parseInt(match.w_svpt);
        }

        if(match.w_1stIn != '' && match.l_1stIn != ''){
            fServeIn += (match.winner_id == player.id) ? parseInt(match.w_1stIn) : parseInt(match.l_1stIn);
            retFServeIn += (match.winner_id == player.id) ? parseInt(match.l_1stIn) : parseInt(match.w_1stIn);
        }

        if(match.w_1stWon != '' && match.l_1stWon != ''){
            fServeWon += (match.winner_id == player.id) ? parseInt(match.w_1stWon) : parseInt(match.l_1stWon);
            retFServeWon += (match.winner_id == player.id) ? parseInt(match.l_1stWon) : parseInt(match.w_1stWon);
        }

        if(match.w_2ndWon != '' && match.l_2ndWon != ''){
            sServeWon += (match.winner_id == player.id) ? parseInt(match.w_2ndWon) : parseInt(match.l_2ndWon);
            retSServeWon += (match.winner_id == player.id) ? parseInt(match.l_2ndWon) : parseInt(match.w_2ndWon);
        }

        if(match.w_bpFaced != '' && match.l_bpFaced != ''){
            retBpFaced += (match.winner_id == player.id) ? parseInt(match.w_bpFaced) : parseInt(match.l_bpFaced);
            bpFaced += (match.winner_id == player.id) ? parseInt(match.l_bpFaced) : parseInt(match.w_bpFaced);
        }
        
        if(match.w_bpSaved != '' && match.l_bpSaved != ''){
            retBpSaved += (match.winner_id == player.id) ? parseInt(match.w_bpSaved) : parseInt(match.l_bpSaved);
            bpSaved += (match.winner_id == player.id) ? parseInt(match.l_bpSaved) : parseInt(match.w_bpSaved);
        }
    }

    var fServeP = fServeIn / servePoints;
    var fServeWonP = fServeWon / fServeIn;
    var sServeWonP = sServeWon / (servePoints - fServeIn)
    var retFServeWonP = 1 - retFServeWon / retFServeIn;
    var retSServeWonP = 1 - retSServeWon / (retServePoints - retFServeIn);
    var bpConversion = 1 - bpSaved / bpFaced;
    var retBpConversion = retBpSaved / retBpFaced; 

    var stats = {"wonMatches" : wonMatches, "lostMatches" : lostMatches, "titles" : titles,
            "bestWin" : bestWin, "aces" : aces, "doubleFaults" : doubleFaults, "fServeP" : fServeP,
            "fServeWonP" : fServeWonP, "sServeWonP" : sServeWonP, "retFServeWonP" : retFServeWonP,
            "retSServeWonP" : retSServeWonP, "bpConversion" : bpConversion, "retBpConversion" : retBpConversion,
            "countryStats" : countryStats
        };

    return stats;
}