/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const userId = e.record.get("userId");
  if (!userId) {
    e.next();
    return;
  }
  
  const activity = new Record($app.findCollectionByNameOrId("activity_feed"));
  activity.set("userId", userId);
  activity.set("activityType", "order_placed");
  activity.set("description", "Order placed for " + e.record.get("totalAmount") + " " + (e.record.get("currency") || "USD"));
  activity.set("metadata", { orderId: e.record.id, totalAmount: e.record.get("totalAmount"), status: e.record.get("status") });
  
  $app.save(activity);
  e.next();
}, "orders");

onRecordAfterCreateSuccess((e) => {
  const referrerId = e.record.get("referrerId");
  if (!referrerId) {
    e.next();
    return;
  }
  
  const activity = new Record($app.findCollectionByNameOrId("activity_feed"));
  activity.set("userId", referrerId);
  activity.set("activityType", "referral_added");
  activity.set("relatedUserId", e.record.get("referredUserId"));
  activity.set("description", "New referral added");
  activity.set("metadata", { referralId: e.record.id, status: e.record.get("status") });
  
  $app.save(activity);
  e.next();
}, "referrals");

onRecordAfterCreateSuccess((e) => {
  const userId = e.record.get("userId");
  if (!userId) {
    e.next();
    return;
  }
  
  const activity = new Record($app.findCollectionByNameOrId("activity_feed"));
  activity.set("userId", userId);
  activity.set("activityType", "bonus_claimed");
  activity.set("description", "Bonus claimed: " + e.record.get("amount"));
  activity.set("metadata", { bonusId: e.record.get("bonusId"), amount: e.record.get("amount") });
  
  $app.save(activity);
  e.next();
}, "claimed_bonuses");

onRecordUpdate((e) => {
  const original = e.record.original();
  const newRank = e.record.get("currentRank");
  const oldRank = original.get("currentRank");
  
  if (newRank && oldRank && newRank !== oldRank) {
    const userId = e.record.get("userId");
    const activity = new Record($app.findCollectionByNameOrId("activity_feed"));
    activity.set("userId", userId);
    activity.set("activityType", "rank_promoted");
    activity.set("description", "Promoted to rank: " + newRank);
    activity.set("metadata", { oldRank: oldRank, newRank: newRank });
    
    $app.save(activity);
  }
  
  e.next();
}, "user_stats");