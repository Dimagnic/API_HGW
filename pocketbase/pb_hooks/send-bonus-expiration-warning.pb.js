/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const expirationDate = e.record.get("expirationDate");
  const userId = e.record.get("userId");
  
  if (!expirationDate || !userId) {
    e.next();
    return;
  }
  
  const expDate = new Date(expirationDate);
  const today = new Date();
  const daysUntilExpiry = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry > 0 && daysUntilExpiry <= 7) {
    const notification = new Record($app.findCollectionByNameOrId("notifications"));
    notification.set("userId", userId);
    notification.set("type", "bonus_available");
    notification.set("title", "Bonus Expiring Soon!");
    notification.set("message", "Your bonus of " + e.record.get("amount") + " expires in " + daysUntilExpiry + " days. Claim it now!");
    notification.set("isRead", false);
    
    $app.save(notification);
  }
  
  e.next();
}, "bonuses");