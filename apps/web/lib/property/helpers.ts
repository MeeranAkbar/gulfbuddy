import type { PropertyAdvertiserType, PropertyMarketMode, PropertyPermitSystem } from '@gulfbuddy/types';

export function inferPropertyRegulatorRegion(emirate: string) {
  const normalized = emirate.trim().toLowerCase();

  if (normalized === 'dubai') {
    return 'dubai' as const;
  }

  if (normalized === 'abu dhabi' || normalized === 'abudhabi') {
    return 'abu_dhabi' as const;
  }

  return 'other_uae' as const;
}

export function inferPropertyPermitSystem({
  emirate,
  advertiserType,
  marketMode
}: {
  emirate: string;
  advertiserType: PropertyAdvertiserType;
  marketMode: PropertyMarketMode;
}): PropertyPermitSystem {
  const regulatorRegion = inferPropertyRegulatorRegion(emirate);

  if (regulatorRegion === 'dubai') {
    if (advertiserType === 'holiday_home_operator' || marketMode === 'short_term') {
      return 'holiday_home';
    }

    return 'trakheesi';
  }

  if (regulatorRegion === 'abu_dhabi') {
    return 'dari';
  }

  return 'none';
}
