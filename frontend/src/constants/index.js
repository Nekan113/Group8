export const ROLES = {
  RECIPIENT: 'recipient',
  DONOR: 'donor',
  ADMIN: 'admin',
}

export const VIETNAM_CITIES = [
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Huế',
  'Nha Trang',
  'Vũng Tàu',
  'Đà Lạt',
  'Biên Hòa',
  'Hạ Long',
  'Quy Nhon',
  'Vinh',
  'Thái Nguyên',
  'Buôn Ma Thuột',
]

export const FOOD_CATEGORIES = [
  'Fruit',
  'Vegetable',
  'Meat',
  'Cooked Dish',
  'Baked Goods',
  'Drink',
]

export const MEASUREMENT_UNITS = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'g', label: 'Gram (g)' },
  { value: 'L', label: 'Liter (L)' },
  { value: 'ml', label: 'Milliliter (ml)' },
  { value: 'unit', label: 'Unit' },
  { value: 'per_request', label: 'Per Request' },
]

export const VEGETARIAN_OPTIONS = [
  { value: 'yes', label: 'Vegetarian' },
  { value: 'no', label: 'Non-vegetarian' },
  { value: 'na', label: 'Not applicable' },
]

export const LISTING_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
  SOLD_OUT: 'sold_out',
}

export const RESERVATION_STATUS = {
  RESERVED: 'reserved',
  COLLECTED: 'collected',
  CANCELLED_RECIPIENT: 'cancelled_recipient',
  CANCELLED_DONOR: 'cancelled_donor',
}

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash upon collection' },
  { value: 'wallet', label: 'AFF Wallet' },
  { value: 'card', label: 'Credit Card' },
]

export const PREMIUM_PRICE_USD = 5
