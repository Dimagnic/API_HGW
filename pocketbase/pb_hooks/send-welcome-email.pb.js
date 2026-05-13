/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: e.record.get("email") }],
    subject: "Welcome to Our Platform!",
    html: "<h1>Welcome!</h1><p>Thank you for signing up. We're excited to have you on board.</p><p>Your account has been created successfully. You can now start exploring our products and building your referral network.</p>"
  });
  $app.newMailClient().send(message);
  e.next();
}, "users");