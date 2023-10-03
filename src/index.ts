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
import fs from 'fs';
import { Vote, saveAllResults } from './crawler';
import { importData, extractMembers } from './importer';
import { processAttraction } from './attraction';

(async () => {
  await saveAllResults();
  
  const data: Vote[] = importData();
  fs.writeFileSync('members.json', JSON.stringify(extractMembers(data)));

  const attraction = processAttraction(data);
  console.log('Writing file...');
  fs.writeFileSync('attraction.json', JSON.stringify(attraction));
})();

function compareResults(data: Vote[], name1: string, name2: string) {
  let matching = data.filter(abstimmung => 
    abstimmung.results.find(e => e.name === name1)?.vote === abstimmung.results.find(e => e.name === name2)?.vote);

  console.log(`Matching votes: ${matching.length} (${toPercent(matching.length / data.length)})`);
}

function toPercent(num: number) {
  return Number(num/100).toLocaleString(undefined,{style: 'percent', minimumFractionDigits: 2})
}
