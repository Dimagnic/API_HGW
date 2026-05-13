/// <reference path="../pb_data/types.d.ts" />
onRecordCreate((e) => {
  const email = e.record.get("email");
  if (!email) {
    e.next();
    return;
  }
  
  const existing = $app.findFirstRecordByData("users", "email", email);
  if (existing && existing.id !== e.record.id) {
    throw new BadRequestError("Email already in use");
  }
  
  e.next();
}, "users");

onRecordUpdate((e) => {
  const email = e.record.get("email");
  const original = e.record.original();
  const originalEmail = original.get("email");
  
  if (email && email !== originalEmail) {
    const existing = $app.findFirstRecordByData("users", "email", email);
    if (existing && existing.id !== e.record.id) {
      throw new BadRequestError("Email already in use");
    }
  }
  
  e.next();
}, "users");