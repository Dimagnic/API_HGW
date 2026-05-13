/// <reference path="../pb_data/types.d.ts" />
onRecordCreate((e) => {
  const permissions = e.record.get("permissions");
  if (!permissions || (Array.isArray(permissions) && permissions.length === 0)) {
    throw new BadRequestError("API key must have at least one permission");
  }
  
  e.next();
}, "api_keys");