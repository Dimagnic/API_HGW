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
  activity.set("metadata", { orderId: e.record.id, totalAmount: e.record.get("totalAmount") });
  
  $app.save(activity);
  e.next();
}, "orders");

onRecordAfterCreateSuccess((e) => {
  const userId = e.record.get("referrerId");
  if (!userId) {
    e.next();
    return;
  }
  
  const activity = new Record($app.findCollectionByNameOrId("activity_feed"));
  activity.set("userId", userId);
  activity.set("activityType", "referral_added");
  activity.set("relatedUserId", e.record.get("referredUserId"));
  activity.set("description", "New referral added");
  activity.set("metadata", { referralId: e.record.id });
  
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