import letterIcon from '../assets/letter.svg';
import songIcon from '../assets/song.svg';
import photoIcon from '../assets/photo.svg';
import mapPinIcon from '../assets/map-pin.svg';
import affirmationIcon from '../assets/affirmation.svg';
import scratchOffIcon from '../assets/scratch-off-card.svg';
import voiceMemoIcon from '../assets/voice-memo.svg';
import drawingIcon from '../assets/drawing.svg';
import whyIcon from '../assets/why-im-sending-this.svg';
import recommendationIcon from '../assets/recommendation.svg';

// Everything that can go in a box. Saved gifts only store each item's id and data;
// the name and icon are looked up here, so they can change without breaking old gifts.
export const catalog = [
  { id: 'letter', name: 'Letter', image: letterIcon },
  { id: 'song', name: 'Song', image: songIcon },
  { id: 'photo', name: 'Photo', image: photoIcon },
  { id: 'map-pin', name: 'Map Pin', image: mapPinIcon },
  { id: 'affirmation', name: 'Affirmation', image: affirmationIcon },
  { id: 'scratch-off', name: 'Scratch Off Card', image: scratchOffIcon },
  { id: 'voice-memo', name: 'Voice Memo', image: voiceMemoIcon },
  { id: 'drawing', name: 'Drawing', image: drawingIcon },
  { id: 'why', name: "Why I'm Sending This", image: whyIcon },
  { id: 'recommendation', name: 'Recommendation', image: recommendationIcon },
];

export function fromCatalog(id) {
  return catalog.find((item) => item.id === id);
}
