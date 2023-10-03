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
import { extractMeta, extractResults, MetaData, Result } from './parser';
import { loadResults, loadMeta } from './loader';
import path from 'path';

export type Vote = {
  results: Result[],
  meta: MetaData
};

export async function saveAllResults() {
  // all votes of the current legislation (up to 2023-10-01)
  const fromId = 756;
  const toId = 873;

  for (let id = fromId; id <= toId; id++) {
    try {
      console.log(`Getting #${id}`);
      
      const abstimmung = await extractVote(id);
      fs.writeFileSync(path.join('data', `${id}.json`), JSON.stringify(abstimmung));
    } catch (e) {
      console.log(`Getting #${id} failed`);
    }
    await delay(1000);
  }
}

async function extractVote(id: number): Promise<Vote> {
  let results: Result[]  = [];
  await Promise.all(loadResults(id).map(p => p.then(extractResults).then(r => r.forEach(e => results.push(e)))));
  const meta = await loadMeta(id).then(extractMeta);
  return {results, meta};
}

function delay(ms: number) { 
  return new Promise(resolve => setTimeout(resolve, ms))
}
