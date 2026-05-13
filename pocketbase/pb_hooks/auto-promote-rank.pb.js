/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const totalSalesVolume = e.record.get("totalSalesVolume") || 0;
  const totalTeamSize = e.record.get("totalTeamSize") || 0;
  const totalReferrals = e.record.get("totalReferrals") || 0;
  
  const ranks = $app.findAllRecords("ranks", { sort: "level" });
  let newRank = null;
  
  for (const rank of ranks) {
    const minSalesVolume = rank.get("minSalesVolume") || 0;
    const minTeamSize = rank.get("minTeamSize") || 0;
    const minReferrals = rank.get("minReferrals") || 0;
    
    if (totalSalesVolume >= minSalesVolume && totalTeamSize >= minTeamSize && totalReferrals >= minReferrals) {
      newRank = rank.get("name");
    }
  }
  
  if (newRank && newRank !== e.record.get("currentRank")) {
    e.record.set("currentRank", newRank);
  }
  
  e.next();
}, "user_stats");