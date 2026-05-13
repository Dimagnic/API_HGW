/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const referrerId = e.record.get("referrerId");
  const referredUserId = e.record.get("referredUserId");
  
  if (!referrerId) {
    e.next();
    return;
  }
  
  const referrer = $app.findRecordById("users", referrerId);
  if (!referrer) {
    e.next();
    return;
  }
  
  const notification = new Record($app.findCollectionByNameOrId("notifications"));
  notification.set("userId", referrerId);
  notification.set("type", "referral_update");
  notification.set("title", "New Referral!");
  notification.set("message", "You have a new referral! Status: " + (e.record.get("status") || "pending"));
  notification.set("isRead", false);
  
  $app.save(notification);
  
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: referrer.get("email") }],
    subject: "New Referral Added!",
    html: "<h1>New Referral!</h1><p>Congratulations! You have a new referral.</p><p><strong>Status:</strong> " + (e.record.get("status") || "pending") + "</p><p><strong>Commission Rate:</strong> " + ((e.record.get("commissionRate") || 0.1) * 100) + "%</p><p>Visit your dashboard to track your referral's progress.</p>"
  });
  
  $app.newMailClient().send(message);
  e.next();
}, "referrals");