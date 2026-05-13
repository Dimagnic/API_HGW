/// <reference path="../pb_data/types.d.ts" />
onRecordCreate((e) => {
  const password = e.record.get("password");
  if (!password) {
    e.next();
    return;
  }
  
  if (password.length < 8) {
    throw new BadRequestError("Password must be at least 8 characters long");
  }
  
  if (!/[A-Z]/.test(password)) {
    throw new BadRequestError("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    throw new BadRequestError("Password must contain at least one lowercase letter");
  }
  
  if (!/[0-9]/.test(password)) {
    throw new BadRequestError("Password must contain at least one number");
  }
  
  e.next();
}, "users");

onRecordUpdate((e) => {
  const password = e.record.get("password");
  const original = e.record.original();
  const originalPassword = original.get("password");
  
  if (password && password !== originalPassword) {
    if (password.length < 8) {
      throw new BadRequestError("Password must be at least 8 characters long");
    }
    
    if (!/[A-Z]/.test(password)) {
      throw new BadRequestError("Password must contain at least one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      throw new BadRequestError("Password must contain at least one lowercase letter");
    }
    
    if (!/[0-9]/.test(password)) {
      throw new BadRequestError("Password must contain at least one number");
    }
  }
  
  e.next();
}, "users");