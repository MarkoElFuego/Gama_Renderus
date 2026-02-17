import { writable, derived } from 'svelte/store';
import type { BuyerSelection, RoomType, MaterialCategory } from '../types';

// Current buyer selection state
export const selection = writable<BuyerSelection>({
  buildingId: undefined,
  floorId: undefined,
  apartmentId: undefined,
  styleId: undefined,
  materials: {} as Record<MaterialCategory, string>,
  currentRoom: 'living' as RoomType,
});

// Convenience actions
export function selectFloor(floorId: string) {
  selection.update(s => ({ ...s, floorId, apartmentId: undefined }));
}

export function selectApartment(apartmentId: string) {
  selection.update(s => ({ ...s, apartmentId }));
}

export function selectStyle(styleId: string) {
  selection.update(s => ({ ...s, styleId }));
}

export function selectMaterial(category: MaterialCategory, materialId: string) {
  selection.update(s => ({
    ...s,
    materials: { ...s.materials, [category]: materialId },
  }));
}

export function selectRoom(room: RoomType) {
  selection.update(s => ({ ...s, currentRoom: room }));
}

export function resetSelection() {
  selection.set({
    buildingId: undefined,
    floorId: undefined,
    apartmentId: undefined,
    styleId: undefined,
    materials: {} as Record<MaterialCategory, string>,
    currentRoom: 'living',
  });
}

// Derived: is the selection complete enough for lead form?
export const isSelectionComplete = derived(selection, ($s) =>
  Boolean($s.apartmentId && $s.styleId)
);
