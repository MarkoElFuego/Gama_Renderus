import type { FacadeId, Apartment } from '../types';

const ORIENTATION_TO_FACADE: Record<string, FacadeId> = {
  'S': 'A',
  'SW': 'A',
  'W': 'B',
  'NW': 'B',
  'N': 'C',
  'NE': 'C',
  'E': 'D',
  'SE': 'D',
};

export function getFacadeForApartment(orientation?: string): FacadeId {
  if (!orientation) return 'A';
  return ORIENTATION_TO_FACADE[orientation] || 'A';
}

export function getApartmentsOnFacade(apartments: Apartment[], facade: FacadeId): Apartment[] {
  return apartments.filter(a => getFacadeForApartment(a.orientation) === facade);
}

export function findApartmentByCode(buildings: { floors: { apartments: Apartment[] }[] }[], code: string): Apartment | undefined {
  for (const building of buildings) {
    for (const floor of building.floors) {
      const apt = floor.apartments.find(a => a.code.toLowerCase() === code.toLowerCase());
      if (apt) return apt;
    }
  }
  return undefined;
}

export function getAllApartments(buildings: { floors: { apartments: Apartment[] }[] }[]): Apartment[] {
  return buildings.flatMap(b => b.floors.flatMap(f => f.apartments));
}
