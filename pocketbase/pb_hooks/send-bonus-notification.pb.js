/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const user = $app.findRecordById("users", e.record.get("userId"));
  if (!user) {
    e.next();
    return;
  }
  
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: user.get("email") }],
    subject: "New Bonus Available!",
    html: "<h1>You've Earned a Bonus!</h1><p>Congratulations! A new bonus has been added to your account.</p><p><strong>Type:</strong> " + (e.record.get("type") || "special") + "</p><p><strong>Amount:</strong> " + e.record.get("amount") + " " + (e.record.get("currency") || "USD") + "</p><p><strong>Description:</strong> " + (e.record.get("description") || "Bonus reward") + "</p><p>Visit your account to claim this bonus before it expires.</p>"
  });
  $app.newMailClient().send(message);
  e.next();
}, "bonuses");