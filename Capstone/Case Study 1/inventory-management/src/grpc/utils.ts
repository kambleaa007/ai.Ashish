export const dateToTimestamp = (date: Date) => {
  const seconds = Math.floor(date.getTime() / 1000);
  const nanos = (date.getTime() % 1000) * 1000000;
  return { seconds, nanos };
};

export const timestampToDate = (timestamp: any) => {
  if (!timestamp) return new Date();
  return new Date((timestamp.seconds || 0) * 1000 + (timestamp.nanos || 0) / 1000000);
};

export const convertWarehouseToGRPC = (warehouse: any) => {
  return {
    id: warehouse.id,
    name: warehouse.name,
    location: warehouse.location,
    capacity: warehouse.capacity,
    manager: warehouse.manager,
    contact: warehouse.contact,
    createdAt: dateToTimestamp(warehouse.createdAt),
    updatedAt: dateToTimestamp(warehouse.updatedAt),
  };
};

export const convertProductToGRPC = (product: any) => {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    description: product.description || '',
    price: product.price,
    category: product.category,
    supplier: product.supplier,
    createdAt: dateToTimestamp(product.createdAt),
    updatedAt: dateToTimestamp(product.updatedAt),
  };
};

export const convertInventoryToGRPC = (inventory: any) => {
  return {
    id: inventory.id,
    productId: inventory.productId,
    warehouseId: inventory.warehouseId,
    quantity: inventory.quantity,
    minThreshold: inventory.minThreshold,
    maxThreshold: inventory.maxThreshold,
    status: inventory.status,
    createdAt: dateToTimestamp(inventory.createdAt),
    updatedAt: dateToTimestamp(inventory.updatedAt),
  };
};

export const convertStockMovementToGRPC = (movement: any) => {
  return {
    id: movement.id,
    productId: movement.productId,
    fromWarehouseId: movement.fromWarehouseId || '',
    toWarehouseId: movement.toWarehouseId,
    quantity: movement.quantity,
    type: movement.type,
    notes: movement.notes || '',
    createdAt: dateToTimestamp(movement.createdAt),
    createdBy: movement.createdBy,
  };
};

export const convertUserToGRPC = (user: any) => {
  const roleMap: any = {
    ADMIN: 0,
    MANAGER: 1,
    STAFF: 2,
  };

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: roleMap[user.role] || 2,
    createdAt: dateToTimestamp(user.createdAt),
    updatedAt: dateToTimestamp(user.updatedAt),
  };
};
