/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const userId = e.record.get("userId");
  if (!userId) {
    e.next();
    return;
  }
  
  let userStats = $app.findFirstRecordByData("user_stats", "userId", userId);
  if (!userStats) {
    userStats = new Record($app.findCollectionByNameOrId("user_stats"));
    userStats.set("userId", userId);
  }
  
  const currentOrders = userStats.get("totalSalesVolume") || 0;
  userStats.set("totalSalesVolume", currentOrders + (e.record.get("totalAmount") || 0));
  
  $app.save(userStats);
  e.next();
}, "orders");

onRecordAfterCreateSuccess((e) => {
  const referrerId = e.record.get("referrerId");
  if (!referrerId) {
    e.next();
    return;
  }
  
  let userStats = $app.findFirstRecordByData("user_stats", "userId", referrerId);
  if (!userStats) {
    userStats = new Record($app.findCollectionByNameOrId("user_stats"));
    userStats.set("userId", referrerId);
  }
  
  const currentReferrals = userStats.get("totalReferrals") || 0;
  userStats.set("totalReferrals", currentReferrals + 1);
  
  const status = e.record.get("status");
  if (status === "active") {
    const activeReferrals = userStats.get("activeReferrals") || 0;
    userStats.set("activeReferrals", activeReferrals + 1);
  }
  
  $app.save(userStats);
  e.next();
}, "referrals");

onRecordAfterCreateSuccess((e) => {
  const userId = e.record.get("userId");
  if (!userId) {
    e.next();
    return;
  }
  
  let userStats = $app.findFirstRecordByData("user_stats", "userId", userId);
  if (!userStats) {
    userStats = new Record($app.findCollectionByNameOrId("user_stats"));
    userStats.set("userId", userId);
  }
  
  const currentRevenue = userStats.get("totalRevenue") || 0;
  userStats.set("totalRevenue", currentRevenue + (e.record.get("amount") || 0));
  
  $app.save(userStats);
  e.next();
}, "claimed_bonuses");