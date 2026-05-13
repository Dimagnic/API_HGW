/// <reference path="../pb_data/types.d.ts" />
onRecordCreate((e) => {
  // Skip hook processing for user creation to avoid collection access errors
  e.next();
}, "users");