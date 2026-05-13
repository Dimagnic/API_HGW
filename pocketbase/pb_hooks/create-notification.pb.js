/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const userId = e.record.get("userId");
  if (!userId) {
    e.next();
    return;
  }
  
  const notification = new Record($app.findCollectionByNameOrId("notifications"));
  notification.set("userId", userId);
  notification.set("type", "order_update");
  notification.set("title", "Order Placed");
  notification.set("message", "Your order #" + e.record.id + " has been placed successfully.");
  notification.set("isRead", false);
  
  $app.save(notification);
  e.next();
}, "orders");

onRecordAfterCreateSuccess((e) => {
  const userId = e.record.get("referrerId");
  if (!userId) {
    e.next();
    return;
  }
  
  const notification = new Record($app.findCollectionByNameOrId("notifications"));
  notification.set("userId", userId);
  notification.set("type", "referral_update");
  notification.set("title", "New Referral");
  notification.set("message", "You have a new referral!");
  notification.set("isRead", false);
  
  $app.save(notification);
  e.next();
}, "referrals");

onRecordAfterCreateSuccess((e) => {
  const userId = e.record.get("userId");
  if (!userId) {
    e.next();
    return;
  }
  
  const notification = new Record($app.findCollectionByNameOrId("notifications"));
  notification.set("userId", userId);
  notification.set("type", "bonus_available");
  notification.set("title", "Bonus Available");
  notification.set("message", "A new bonus of " + e.record.get("amount") + " is available for you!");
  notification.set("isRead", false);
  
  $app.save(notification);
  e.next();
}, "bonuses");