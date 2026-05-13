/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const original = e.record.original();
  const newRank = e.record.get("currentRank");
  const oldRank = original.get("currentRank");
  
  if (newRank && oldRank && newRank !== oldRank) {
    const userId = e.record.get("userId");
    const user = $app.findRecordById("users", userId);
    
    if (user) {
      const rank = $app.findFirstRecordByData("ranks", "name", newRank);
      let benefits = "New benefits unlocked!";
      if (rank) {
        const rankBenefits = rank.get("benefits");
        if (rankBenefits) {
          benefits = JSON.stringify(rankBenefits);
        }
      }
      
      const message = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName
        },
        to: [{ address: user.get("email") }],
        subject: "Congratulations on Your Promotion!",
        html: "<h1>Rank Promotion!</h1><p>Congratulations! You've been promoted to a new rank.</p><p><strong>New Rank:</strong> " + newRank + "</p><p><strong>Benefits:</strong> " + benefits + "</p><p>This achievement unlocks new benefits and opportunities. Check your account to see what's new.</p>"
      });
      
      $app.newMailClient().send(message);
    }
  }
  
  e.next();
}, "user_stats");