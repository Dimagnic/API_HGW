/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const userId = e.record.get("userId");
  if (!userId) {
    e.next();
    return;
  }
  
  const webhooks = $app.findAllRecords("webhooks", { filter: "userId = '" + userId + "' && isActive = true" });
  
  for (const webhook of webhooks) {
    const events = webhook.get("events") || [];
    if (events.includes && events.includes("order_placed")) {
      const payload = {
        event: "order_placed",
        orderId: e.record.id,
        totalAmount: e.record.get("totalAmount"),
        status: e.record.get("status"),
        timestamp: new Date().toISOString()
      };
      
      try {
        $http.post(webhook.get("url"), payload);
      } catch (err) {
        console.log("Webhook trigger failed: " + err);
      }
    }
  }
  
  e.next();
}, "orders");

onRecordAfterCreateSuccess((e) => {
  const referrerId = e.record.get("referrerId");
  if (!referrerId) {
    e.next();
    return;
  }
  
  const webhooks = $app.findAllRecords("webhooks", { filter: "userId = '" + referrerId + "' && isActive = true" });
  
  for (const webhook of webhooks) {
    const events = webhook.get("events") || [];
    if (events.includes && events.includes("referral_added")) {
      const payload = {
        event: "referral_added",
        referralId: e.record.id,
        referredUserId: e.record.get("referredUserId"),
        status: e.record.get("status"),
        timestamp: new Date().toISOString()
      };
      
      try {
        $http.post(webhook.get("url"), payload);
      } catch (err) {
        console.log("Webhook trigger failed: " + err);
      }
    }
  }
  
  e.next();
}, "referrals");

onRecordAfterCreateSuccess((e) => {
  const userId = e.record.get("userId");
  if (!userId) {
    e.next();
    return;
  }
  
  const webhooks = $app.findAllRecords("webhooks", { filter: "userId = '" + userId + "' && isActive = true" });
  
  for (const webhook of webhooks) {
    const events = webhook.get("events") || [];
    if (events.includes && events.includes("bonus_claimed")) {
      const payload = {
        event: "bonus_claimed",
        claimedBonusId: e.record.id,
        amount: e.record.get("amount"),
        timestamp: new Date().toISOString()
      };
      
      try {
        $http.post(webhook.get("url"), payload);
      } catch (err) {
        console.log("Webhook trigger failed: " + err);
      }
    }
  }
  
  e.next();
}, "claimed_bonuses");

onRecordUpdate((e) => {
  const original = e.record.original();
  const newRank = e.record.get("currentRank");
  const oldRank = original.get("currentRank");
  
  if (newRank && oldRank && newRank !== oldRank) {
    const userId = e.record.get("userId");
    const webhooks = $app.findAllRecords("webhooks", { filter: "userId = '" + userId + "' && isActive = true" });
    
    for (const webhook of webhooks) {
      const events = webhook.get("events") || [];
      if (events.includes && events.includes("rank_changed")) {
        const payload = {
          event: "rank_changed",
          oldRank: oldRank,
          newRank: newRank,
          timestamp: new Date().toISOString()
        };
        
        try {
          $http.post(webhook.get("url"), payload);
        } catch (err) {
          console.log("Webhook trigger failed: " + err);
        }
      }
    }
  }
  
  e.next();
}, "user_stats");