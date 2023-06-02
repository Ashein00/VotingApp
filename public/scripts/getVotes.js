
function getVotes(votes) {
    const perCandiVote = {};

    //console.log(votes)
    // group votes by particular candidate
    for (const obj of votes) {
        const vote = [obj.vote1,obj.vote2,obj.vote3];
        for (var i=0; i<3;i++){
            if (!perCandiVote[vote[i]]) {
                perCandiVote[vote[i]] = 0;
            }
            perCandiVote[vote[i]] += 1;
        }
    }
    //console.log(perCandiVote)
    // Convert parties object to an array of arrays
    //const perCandiVoteArrays = Object.values(perCandiVote);

    return perCandiVote;
}
  
  module.exports = getVotes;