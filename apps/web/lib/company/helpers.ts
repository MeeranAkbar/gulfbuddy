import type { CompanyRole, CompanyType, PropertyAdvertiserType, SellerType } from '@gulfbuddy/types';

export function inferPrimaryCompanyRole(companyType: CompanyType): CompanyRole {
  switch (companyType) {
    case 'agency':
      return 'agency_owner';
    case 'dealer':
      return 'dealer_owner';
    default:
      return 'company_owner';
  }
}

export function inferPropertySellerType(advertiserType: PropertyAdvertiserType): SellerType {
  switch (advertiserType) {
    case 'agency':
      return 'agency';
    case 'agent':
      return 'broker';
    case 'developer':
      return 'developer';
    case 'owner':
      return 'owner';
    case 'holiday_home_operator':
      return 'business';
  }
}

export function inferPropertySourceRelationshipType(advertiserType: PropertyAdvertiserType) {
  switch (advertiserType) {
    case 'agency':
      return 'agency_listing' as const;
    case 'agent':
      return 'broker_listing' as const;
    case 'developer':
      return 'developer_listing' as const;
    default:
      return 'owner_listing' as const;
  }
}
