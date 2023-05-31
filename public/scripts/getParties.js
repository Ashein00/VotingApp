
function getParties(cands) {
    const parties = {};

    // Group objects by party name
    for (const obj of cands) {
    const party = obj.party;
    if (!parties[party]) {
    parties[party] = [];
    }
    parties[party].push(obj);
    }

    // Convert parties object to an array of arrays
  
  const partyArrays = Object.values(parties);
  return partyArrays;
}
  
  module.exports = getParties;