/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const userId = e.record.get("userId");
  if (!userId) {
    e.next();
    return;
  }
  
  const user = $app.findRecordById("users", userId);
  if (!user) {
    e.next();
    return;
  }
  
  const notification = new Record($app.findCollectionByNameOrId("notifications"));
  notification.set("userId", userId);
  notification.set("type", "bonus_available");
  notification.set("title", "Bonus Claimed!");
  notification.set("message", "You have successfully claimed a bonus of " + e.record.get("amount") + "!");
  notification.set("isRead", false);
  
  $app.save(notification);
  
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: user.get("email") }],
    subject: "Bonus Claimed Successfully!",
    html: "<h1>Bonus Claimed!</h1><p>You have successfully claimed a bonus.</p><p><strong>Amount:</strong> " + e.record.get("amount") + "</p><p>The bonus has been added to your account. Thank you for being part of our community!</p>"
  });
  
  $app.newMailClient().send(message);
  e.next();
}, "claimed_bonuses");