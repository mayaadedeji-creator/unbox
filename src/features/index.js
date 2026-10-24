import SongEditor from './SongEditor.jsx';
import LetterEditor from './LetterEditor.jsx';
import PhotoEditor from './PhotoEditor.jsx';
import MapPinEditor from './MapPinEditor.jsx';
import AffirmationEditor from './AffirmationEditor.jsx';
import ScratchOffEditor from './ScratchOffEditor.jsx';
import VoiceMemoEditor from './VoiceMemoEditor.jsx';
import DrawingEditor from './DrawingEditor.jsx';
import WhyEditor from './WhyEditor.jsx';
import RecommendationEditor from './RecommendationEditor.jsx';
import * as viewers from './viewers.jsx';
import { normalizeLink } from './helpers.js';
import './features.css';

const hasText = (text) => Boolean(text?.trim());

// One entry per inventory item id. Each feature provides:
//   Editor       — component rendered inside the modal, gets { value, onChange }
//   Viewer       — read-only version shown on the arrival page, gets { value }
//   initialData  — starting value for a fresh item
//   isComplete   — whether the "Add to box" button is enabled
const features = {
  letter: {
    Editor: LetterEditor,
    Viewer: viewers.LetterViewer,
    initialData: { text: '' },
    isComplete: (data) => hasText(data.text),
  },
  song: {
    Editor: SongEditor,
    Viewer: viewers.SongViewer,
    initialData: { link: '', spotify: null },
    isComplete: (data) => Boolean(data.spotify),
  },
  photo: {
    Editor: PhotoEditor,
    Viewer: viewers.PhotoViewer,
    initialData: { image: null, name: '' },
    isComplete: (data) => Boolean(data.image),
  },
  'map-pin': {
    Editor: MapPinEditor,
    Viewer: viewers.MapPinViewer,
    initialData: { place: null },
    isComplete: (data) => Boolean(data.place),
  },
  affirmation: {
    Editor: AffirmationEditor,
    Viewer: viewers.AffirmationViewer,
    initialData: { text: '', source: null },
    isComplete: (data) => hasText(data.text),
  },
  'scratch-off': {
    Editor: ScratchOffEditor,
    Viewer: viewers.ScratchOffViewer,
    initialData: { mode: 'type', text: '', image: null },
    isComplete: (data) => (data.mode === 'draw' ? Boolean(data.image) : hasText(data.text)),
  },
  'voice-memo': {
    Editor: VoiceMemoEditor,
    Viewer: viewers.VoiceMemoViewer,
    initialData: { audio: null, duration: 0 },
    isComplete: (data) => Boolean(data.audio),
  },
  drawing: {
    Editor: DrawingEditor,
    Viewer: viewers.DrawingViewer,
    initialData: { image: null },
    isComplete: (data) => Boolean(data.image),
  },
  why: {
    Editor: WhyEditor,
    Viewer: viewers.WhyViewer,
    initialData: { text: '' },
    isComplete: (data) => hasText(data.text),
  },
  recommendation: {
    Editor: RecommendationEditor,
    Viewer: viewers.RecommendationViewer,
    initialData: { text: '', link: '' },
    isComplete: (data) => hasText(data.text) && normalizeLink(data.link) !== null,
  },
};

export function getFeature(id) {
  return features[id];
}
