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
  
  const items = e.record.get("items") || [];
  let itemsHtml = "<ul>";
  if (Array.isArray(items)) {
    for (const item of items) {
      itemsHtml += "<li>" + (item.name || "Product") + " x " + (item.quantity || 1) + " - $" + (item.price || 0) + "</li>";
    }
  }
  itemsHtml += "</ul>";
  
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: user.get("email") }],
    subject: "Order Confirmation #" + e.record.id,
    html: "<h1>Order Confirmed!</h1><p>Thank you for your order.</p><h2>Order Details:</h2><p><strong>Order ID:</strong> " + e.record.id + "</p><p><strong>Total Amount:</strong> " + e.record.get("totalAmount") + " " + (e.record.get("currency") || "USD") + "</p><p><strong>Status:</strong> " + (e.record.get("status") || "pending") + "</p><h3>Items:</h3>" + itemsHtml + "<p><strong>Tracking Number:</strong> " + (e.record.get("trackingNumber") || "Not yet assigned") + "</p><p>We'll keep you updated on your order status.</p>"
  });
  
  $app.newMailClient().send(message);
  e.next();
}, "orders");