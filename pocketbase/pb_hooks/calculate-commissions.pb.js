/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const userId = e.record.get("userId");
  if (!userId) {
    e.next();
    return;
  }
  
  const referrals = $app.findAllRecords("referrals", { filter: "referredUserId = '" + userId + "'" });
  
  for (const referral of referrals) {
    const referrerId = referral.get("referrerId");
    const commissionRate = referral.get("commissionRate") || 0.1;
    const totalAmount = e.record.get("totalAmount") || 0;
    const commission = totalAmount * commissionRate;
    
    const currentEarned = referral.get("commissionEarned") || 0;
    referral.set("commissionEarned", currentEarned + commission);
    
    $app.save(referral);
    
    const userStats = $app.findFirstRecordByData("user_stats", "userId", referrerId);
    if (userStats) {
      const currentRevenue = userStats.get("totalRevenue") || 0;
      userStats.set("totalRevenue", currentRevenue + commission);
      $app.save(userStats);
    }
  }
  
  e.next();
}, "orders");