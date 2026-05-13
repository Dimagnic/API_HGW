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
    subject: "Order Confirmation #" + e.record.id,
    html: "<h1>Order Confirmed!</h1><p>Thank you for your order.</p><p><strong>Order ID:</strong> " + e.record.id + "</p><p><strong>Total Amount:</strong> " + e.record.get("totalAmount") + " " + (e.record.get("currency") || "USD") + "</p><p><strong>Status:</strong> " + (e.record.get("status") || "pending") + "</p><p>We'll keep you updated on your order status.</p>"
  });
  $app.newMailClient().send(message);
  e.next();
}, "orders");