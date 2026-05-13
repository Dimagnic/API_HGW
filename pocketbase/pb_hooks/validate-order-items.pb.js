/// <reference path="../pb_data/types.d.ts" />
onRecordCreate((e) => {
  const items = e.record.get("items");
  
  if (!items || !Array.isArray(items)) {
    throw new BadRequestError("Order must contain items");
  }
  
  for (const item of items) {
    const productId = item.productId || item.id;
    if (!productId) {
      throw new BadRequestError("Each item must have a productId");
    }
    
    const product = $app.findRecordById("products", productId);
    if (!product) {
      throw new BadRequestError("Product not found: " + productId);
    }
    
    const stock = product.get("stock") || 0;
    const quantity = item.quantity || 1;
    
    if (stock < quantity) {
      throw new BadRequestError("Insufficient stock for product: " + product.get("name"));
    }
  }
  
  e.next();
}, "orders");