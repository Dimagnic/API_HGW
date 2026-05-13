/// <reference path="../pb_data/types.d.ts" />
onRecordCreate((e) => {
  if (!e.record.get("referralCode")) {
    const code = "REF" + Math.random().toString(36).substring(2, 10).toUpperCase();
    e.record.set("referralCode", code);
  }
  
  e.next();
}, "team_members");