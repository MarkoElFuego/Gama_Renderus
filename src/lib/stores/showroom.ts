import { writable, derived, get } from 'svelte/store';
import type { ShowroomState, ShowroomView, FacadeId, TransitionType, RoomType } from '../types';

const FACADE_ORDER: FacadeId[] = ['A', 'B', 'C', 'D'];
const TRANSITION_DURATION = 800; // ms, matches CSS transition

const initialState: ShowroomState = {
  currentView: 'building',
  currentFacade: 'A',
  previousFacade: null,
  selectedBuildingId: 'building-a',
  selectedApartmentId: null,
  selectedFloorId: null,
  selectedRoom: null,
  isTransitioning: false,
  transitionType: 'none',
  history: [],
};

export const showroom = writable<ShowroomState>(initialState);

// Derived selectors
export const currentView = derived(showroom, s => s.currentView);
export const currentFacade = derived(showroom, s => s.currentFacade);
export const isTransitioning = derived(showroom, s => s.isTransitioning);
export const canGoBack = derived(showroom, s => s.history.length > 0);
export const selectedApartmentId = derived(showroom, s => s.selectedApartmentId);
export const selectedRoom = derived(showroom, s => s.selectedRoom);

// --- Transition helpers ---

function startTransition(type: TransitionType) {
  showroom.update(s => ({ ...s, isTransitioning: true, transitionType: type }));
}

function endTransition() {
  showroom.update(s => ({ ...s, isTransitioning: false, transitionType: 'none' }));
}

function scheduleEndTransition(duration = TRANSITION_DURATION) {
  setTimeout(endTransition, duration);
}

function pushHistory(view: ShowroomView) {
  showroom.update(s => ({ ...s, history: [...s.history, view] }));
}

// --- Actions ---

export function rotateTo(facade: FacadeId) {
  const state = get(showroom);
  if (state.currentFacade === facade || state.isTransitioning) return;

  startTransition('rotate');
  showroom.update(s => ({
    ...s,
    previousFacade: s.currentFacade,
    currentFacade: facade,
  }));
  scheduleEndTransition();
}

export function rotateNext() {
  const state = get(showroom);
  if (state.isTransitioning) return;
  const idx = FACADE_ORDER.indexOf(state.currentFacade);
  const next = FACADE_ORDER[(idx + 1) % 4];
  rotateTo(next);
}

export function rotatePrev() {
  const state = get(showroom);
  if (state.isTransitioning) return;
  const idx = FACADE_ORDER.indexOf(state.currentFacade);
  const prev = FACADE_ORDER[(idx + 3) % 4];
  rotateTo(prev);
}

export function showApartment(apartmentId: string, floorId: string, facade: FacadeId) {
  const state = get(showroom);

  // First rotate to the correct facade if needed
  if (state.currentFacade !== facade) {
    rotateTo(facade);
  }

  pushHistory(state.currentView);
  showroom.update(s => ({
    ...s,
    currentView: 'facade_highlight',
    selectedApartmentId: apartmentId,
    selectedFloorId: floorId,
  }));
}

export function enterApartment() {
  const state = get(showroom);
  if (!state.selectedApartmentId) return;

  pushHistory(state.currentView);
  startTransition('zoom_in');
  showroom.update(s => ({
    ...s,
    currentView: 'floor_plan',
    selectedRoom: null,
  }));
  scheduleEndTransition();
}

export function showRoom(room: RoomType) {
  const state = get(showroom);

  pushHistory(state.currentView);
  startTransition('fade');
  showroom.update(s => ({
    ...s,
    currentView: 'panorama',
    selectedRoom: room,
  }));
  scheduleEndTransition();
}

export function goBack() {
  const state = get(showroom);
  if (state.history.length === 0) return;

  const previousView = state.history[state.history.length - 1];
  startTransition('fade');

  showroom.update(s => {
    const newHistory = [...s.history];
    newHistory.pop();

    const updates: Partial<ShowroomState> = {
      currentView: previousView,
      history: newHistory,
    };

    // Clean up state when going back
    if (previousView === 'building') {
      updates.selectedApartmentId = null;
      updates.selectedFloorId = null;
      updates.selectedRoom = null;
    } else if (previousView === 'facade_highlight') {
      updates.selectedRoom = null;
    } else if (previousView === 'floor_plan') {
      updates.selectedRoom = null;
    }

    return { ...s, ...updates };
  });

  scheduleEndTransition();
}

export function resetShowroom() {
  showroom.set(initialState);
}
