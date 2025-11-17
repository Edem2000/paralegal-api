import { MultiLanguage } from 'domain/_core';

export const AuditCategory = {
  Auth: 'auth',
  User: 'user',
  Product: 'product',
  Company: 'company',
} as const;

export type AuditCategory = typeof AuditCategory[keyof typeof AuditCategory];

export const AuditType = {
  Login: 'login',
  Logout: 'logout',
  UserRegistration: 'userRegistration',
  PasswordChange: 'passwordChange',
  UserDelete: 'userDelete',
  UserUpdate: 'userUpdate',
  AssignCompanyToUser: 'assignCompanyToUser',
  UnassignCompanyFromUser: 'unassignCompanyFromUser',

  ProductCreate: 'productCreate',
  ProductUpdate: 'productUpdate',
  ProductDelete: 'productDelete',

  // ...

  CompanyCreate: 'companyCreate',
  CompanyUpdate: 'companyUpdate',
  CompanyDelete: 'companyDelete',
} as const;

export type AuditType = typeof AuditType[keyof typeof AuditType];

export const categoryByType: Record<AuditType, AuditCategory> = {
  [AuditType.Login]: AuditCategory.Auth,
  [AuditType.Logout]: AuditCategory.Auth,

  [AuditType.UserRegistration]: AuditCategory.User,
  [AuditType.PasswordChange]: AuditCategory.User,
  [AuditType.UserDelete]: AuditCategory.User,
  [AuditType.UserUpdate]: AuditCategory.User,
  [AuditType.AssignCompanyToUser]: AuditCategory.User,
  [AuditType.UnassignCompanyFromUser]: AuditCategory.User,

  [AuditType.ProductCreate]: AuditCategory.Product,
  [AuditType.ProductUpdate]: AuditCategory.Product,
  [AuditType.ProductDelete]: AuditCategory.Product,

  [AuditType.CompanyCreate]: AuditCategory.Company,
  [AuditType.CompanyUpdate]: AuditCategory.Company,
  [AuditType.CompanyDelete]: AuditCategory.Company,
};

export const messageByType: Record<AuditType, MultiLanguage> = {
  [AuditType.Login]: {
    ru: 'Вход выполнен успешно',
    uz: 'Tizimga muvaffaqiyatli kirdingiz',
    en: 'Login successful',
  },
  [AuditType.Logout]: {
    ru: 'Выход выполнен успешно',
    uz: 'Tizimdan muvaffaqiyatli chiqdingiz',
    en: 'Logout successful',
  },
  [AuditType.UserRegistration]: {
    ru: 'Регистрация пользователя успешна',
    uz: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi",
    en: 'User registration successful',
  },
  [AuditType.PasswordChange]: {
    uz: "Parol muvaffaqiyatli o'zgartirildi",
    ru: 'Пароль успешно изменен',
    en: 'Password changed successfully',
  },
  [AuditType.UserDelete]: {
    ru: 'Пользователь успешно удален',
    uz: "Foydalanuvchi muvaffaqiyatli o'chirildi",
    en: 'User deleted successfully',
  },
  [AuditType.UserUpdate]: {
    ru: 'Пользователь успешно обновлен',
    uz: 'Foydalanuvchi muvaffaqiyatli yangilandi',
    en: 'User updated successfully',
  },
  [AuditType.AssignCompanyToUser]: {
    ru: 'Компания успешно назначена пользователю',
    uz: 'Kompaniya foydalanuvchiga muvaffaqiyatli tayinlandi',
    en: 'Company assigned to user successfully',
  },
  [AuditType.UnassignCompanyFromUser]: {
    ru: 'Компания успешно удалена у пользователя',
    uz: "Kompaniya foydalanuvchidan muvaffaqiyatli o'chirildi",
    en: 'Company unassigned from user successfully',
  },

  [AuditType.ProductCreate]: {
    ru: 'Продукт успешно создан',
    uz: 'Mahsulot muvaffaqiyatli yaratildi',
    en: 'Product created successfully',
  },
  [AuditType.ProductUpdate]: {
    ru: 'Продукт успешно обновлен',
    uz: 'Mahsulot muvaffaqiyatli yangilandi',
    en: 'Product updated successfully',
  },
  [AuditType.ProductDelete]: {
    ru: 'Продукт успешно удален',
    uz: "Mahsulot muvaffaqiyatli o'chirildi",
    en: 'Product deleted successfully',
  },

  [AuditType.CompanyCreate]: {
    ru: 'Компания успешно создана',
    uz: 'Kompaniya muvaffaqiyatli yaratildi',
    en: 'Company created successfully',
  },
  [AuditType.CompanyUpdate]: {
    ru: 'Компания успешно обновлена',
    uz: 'Kompaniya muvaffaqiyatli yangilandi',
    en: 'Company updated successfully',
  },
  [AuditType.CompanyDelete]: {
    ru: 'Компания успешно удалена',
    uz: "Kompaniya muvaffaqiyatli o'chirildi",
    en: 'Company deleted successfully',
  },
};

export const Actor = {
  User: "user",
  System: "system",
} as const;

export type Actor = typeof Actor[keyof typeof Actor];

export const TargetEntity = {
  User: "user",
  Company: "company",
  Product: "product",
} as const;

export type TargetEntity = typeof TargetEntity[keyof typeof TargetEntity];

