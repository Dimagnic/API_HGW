/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const expirationDate = e.record.get("expirationDate");
  const status = e.record.get("status");
  
  if (expirationDate && status !== "expired") {
    const expDate = new Date(expirationDate);
    const today = new Date();
    
    if (today > expDate) {
      e.record.set("status", "expired");
    }
  }
  
  e.next();
}, "bonuses");