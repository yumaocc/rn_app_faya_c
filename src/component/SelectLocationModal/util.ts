import {LocationCity} from '../../models';

export interface LocationSection {
  title: string;
  data: LocationCity[];
}

export function groupLocation(locations: LocationCity[]): LocationSection[] {
  const map = new Map<string, Set<LocationCity>>();
  locations.forEach(location => {
    let firstLetter = location.firstLetter || '#';
    firstLetter = firstLetter.toUpperCase();
    let section = map.get(firstLetter);
    if (section) {
      section.add(location);
    } else {
      section = new Set([location]);
    }
    map.set(firstLetter, section);
  });
  const sections: LocationSection[] = [];
  map.forEach((list, firstLetter) => {
    sections.push({title: firstLetter, data: Array.from(list)});
  });
  return sections.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
}
