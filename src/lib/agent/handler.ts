import type { AgentIntent, Apartment, Building, FacadeId, RoomType } from '../types';
import {
  rotateTo,
  rotateNext,
  rotatePrev,
  showApartment,
  enterApartment,
  showRoom,
  goBack,
} from '../stores/showroom';
import { getFacadeForApartment, findApartmentByCode } from '../utils/facade-mapping';

export function executeIntent(intent: AgentIntent, buildings: Building[]): void {
  switch (intent.type) {
    case 'rotate_building': {
      const direction = (intent.params as any).direction;
      if (direction === 'next') {
        rotateNext();
      } else if (direction === 'prev') {
        rotatePrev();
      } else if (['A', 'B', 'C', 'D'].includes(direction)) {
        rotateTo(direction as FacadeId);
      } else {
        rotateNext();
      }
      break;
    }

    case 'show_apartment': {
      const code = (intent.params as any).apartmentCode;
      if (!code) break;

      const apt = findApartmentByCode(buildings, code);
      if (apt) {
        const facade = getFacadeForApartment(apt.orientation);
        showApartment(apt.id, apt.floorId, facade);
      }
      break;
    }

    case 'enter_apartment': {
      enterApartment();
      break;
    }

    case 'show_room': {
      const room = (intent.params as any).room as RoomType;
      if (room) {
        showRoom(room);
      }
      break;
    }

    case 'go_back': {
      goBack();
      break;
    }

    case 'list_available': {
      // Intent handled — response bar shows the list
      // No viewport action needed beyond what responseText provides
      break;
    }

    case 'describe_element': {
      // Info-only — response bar shows description
      break;
    }

    case 'general_info': {
      // Info-only — response bar shows answer
      break;
    }
  }
}
