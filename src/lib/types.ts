/* ============================================================
   GAMMA RENDERUS — Core TypeScript Types
   ============================================================ */

// ======================== PROJECT ========================

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  developerName: string;
  location: string;
  settings: ProjectSettings;
  createdAt: string;
}

export interface ProjectSettings {
  logo?: string;
  colors?: {
    gold?: string;
    bg?: string;
  };
  contact: {
    phone?: string;
    email?: string;
    address?: string;
  };
  moveInDate?: string;
}

// ======================== BUILDING ========================

export interface Building {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  floorsCount: number;
  imageUrl?: string;
  sortOrder: number;
  floors: Floor[];
}

export interface Floor {
  id: string;
  buildingId: string;
  floorNumber: number;
  name: string;
  label?: string;
  floorPlanSvg?: string;
  apartments: Apartment[];
}

// ======================== APARTMENT ========================

export type ApartmentStatus = 'available' | 'reserved' | 'sold';
export type ApartmentType = 'studio' | '1br' | '2br' | '3br' | 'penthouse';

export interface Apartment {
  id: string;
  floorId: string;
  code: string;
  type: ApartmentType;
  typeLabel: string;
  areaM2: number;
  priceEur: number;
  rooms: number;
  bathrooms: number;
  status: ApartmentStatus;
  orientation?: string;
  features?: string[];
}

// ======================== STYLE ========================

export interface InteriorStyle {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  description: string;
  thumbnailUrl?: string;
  colorScheme: ColorScheme;
  tags: string[];
  sortOrder: number;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  mood: string;
}

// ======================== MATERIAL ========================

export type MaterialCategory = 'floor' | 'wall' | 'kitchen' | 'furniture' | 'details';

export interface Material {
  id: string;
  styleId: string;
  category: MaterialCategory;
  name: string;
  thumbnailUrl?: string;
  renderLayerId?: string;
  isDefault: boolean;
}

// ======================== RENDER ========================

export type RoomType = 'living' | 'bedroom' | 'kitchen' | 'bathroom';

export interface Render {
  id: string;
  apartmentId: string;
  styleId: string;
  room: RoomType;
  layers: RenderLayer[];
  cameraAngle?: string;
  resolution?: { width: number; height: number };
}

export interface RenderLayer {
  id: string;
  renderId: string;
  materialId?: string;
  layerUrl: string;
  zIndex: number;
  blendMode?: string;
  opacity: number;
}

// ======================== LEAD ========================

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
export type LeadSource = 'web' | 'qr' | 'agent';

export interface Lead {
  id: string;
  projectId: string;
  apartmentId?: string;
  styleId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
  materialsChosen?: Record<MaterialCategory, string>;
  pdfUrl?: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
}

// ======================== SELECTION STATE ========================

export interface BuyerSelection {
  buildingId?: string;
  floorId?: string;
  apartmentId?: string;
  styleId?: string;
  materials: Record<MaterialCategory, string>;
  currentRoom: RoomType;
}

// ======================== AGENT ========================

export type AgentMessageRole = 'user' | 'assistant' | 'system';

export interface AgentMessage {
  id: string;
  role: AgentMessageRole;
  content: string;
  richContent?: AgentRichContent[];
  timestamp: string;
}

export interface AgentRichContent {
  type: 'apartment_card' | 'render_preview' | 'action_button' | 'pdf_link';
  data: Record<string, unknown>;
}

export interface AgentSession {
  id: string;
  projectId: string;
  messages: AgentMessage[];
  customerName?: string;
  customerEmail?: string;
  startedAt: string;
}

// ======================== SHOWROOM STATE MACHINE ========================

export type ShowroomView = 'building' | 'facade_highlight' | 'floor_plan' | 'panorama';
export type FacadeId = 'A' | 'B' | 'C' | 'D';
export type TransitionType = 'rotate' | 'zoom_in' | 'zoom_out' | 'fade' | 'none';

export interface ShowroomState {
  currentView: ShowroomView;
  currentFacade: FacadeId;
  previousFacade: FacadeId | null;
  selectedBuildingId: string | null;
  selectedApartmentId: string | null;
  selectedFloorId: string | null;
  selectedRoom: RoomType | null;
  isTransitioning: boolean;
  transitionType: TransitionType;
  history: ShowroomView[];
}

// ======================== AI AGENT INTENTS ========================

export type AgentIntentType =
  | 'rotate_building'
  | 'show_apartment'
  | 'enter_apartment'
  | 'show_room'
  | 'describe_element'
  | 'go_back'
  | 'list_available'
  | 'general_info';

export interface AgentIntent {
  type: AgentIntentType;
  params: Record<string, unknown>;
  responseText: string;
  confidence: number;
}

export interface RotateBuildingParams {
  direction: 'next' | 'prev' | FacadeId;
}

export interface ShowApartmentParams {
  apartmentCode: string;
}

export interface ShowRoomParams {
  room: RoomType;
}

export interface ListAvailableParams {
  filter?: {
    type?: ApartmentType;
    minArea?: number;
    maxPrice?: number;
    floor?: number;
    facade?: FacadeId;
  };
}

export interface GeneralInfoParams {
  topic: string;
}

// ======================== FACADE MAPPING ========================

export interface FacadeApartmentMapping {
  apartmentId: string;
  svgZoneId: string;
  bbox: { x: number; y: number; width: number; height: number };
}

// ======================== PANORAMA ========================

export interface PanoramaHotpoint {
  id: string;
  pitch: number;
  yaw: number;
  type: 'info' | 'navigate' | 'link';
  label: string;
  targetRoom?: RoomType;
  content?: string;
}

export interface PanoramaConfig {
  imageUrl: string;
  hotpoints: PanoramaHotpoint[];
  initialView: { pitch: number; yaw: number; hfov: number };
}
