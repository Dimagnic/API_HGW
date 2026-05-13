/// <reference path="../pb_data/types.d.ts" />
onRecordCreate((e) => {
  if (!e.record.get("referralLink")) {
    const code = e.record.get("referralCode") || "REF" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const link = "https://yourapp.com/join?ref=" + code;
    e.record.set("referralLink", link);
  }
  
  e.next();
}, "team_members");