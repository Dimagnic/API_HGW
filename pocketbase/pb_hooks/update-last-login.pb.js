/// <reference path="../pb_data/types.d.ts" />
onRecordAuthRequest((e) => {
  const user = e.record;
  user.set("lastLogin", new Date().toISOString());
  $app.save(user);
  
  e.next();
}, "users");