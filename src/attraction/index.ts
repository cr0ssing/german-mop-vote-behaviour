/*
 * Copyright (C) 2023 Robin Lamberti.
 *
 * This file is part of german-mop-vote-behaviour.
 *
 * german-mop-vote-behaviour is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * german-mop-vote-behaviour is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with german-mop-vote-behaviour. If not, see <http://www.gnu.org/licenses/>.
 */
import { Vote } from '../crawler';
import { Member } from '../parser';

export function processAttraction(data: Vote[]) {
  console.log('Processing attraction...');

  const links: Map<string, {a: string, b: string, attraction: number}> = new Map();
  data.forEach(a => {
    const all = a.results;
    console.log(`Processing ${a.meta.title}...`)
    all.filter(r => r.vote !== 'Nicht abg.').forEach(r => {
      const name1 = r.name;

      all.filter(a => a.vote == r.vote && a.name !== name1).map(a => a.name).forEach(name2 => {
        let link = links.get(name1 + name2) || links.get(name2 + name1);
        let add;
        switch (r.vote) {
          case 'Ja':
          case 'Nein':
            add = 2;
          default:
            add = 1;
        }
        if (!link) {
          link = {
            a: name1,
            b: name2,
            attraction: add
          };
          links.set(name1 + name2, link);
        } else {
          link.attraction = link.attraction + add;
        }
      });
  })});

  return Array.from(links.values());
}

// find most attracted members
export function printMostAttracted(members: Member[], attraction: {a: string, b: string, attraction: number}[]) {
  const most = attraction.sort((x, y) => x.attraction - y.attraction)[attraction.length - 1];
  console.log({
    a: members.find(e => e.name === most.a),
    b: members.find(e => e.name === most.b),
    attr: most.attraction / 2
  })
}
