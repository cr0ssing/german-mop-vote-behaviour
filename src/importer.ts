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
import { Vote } from './crawler';
import { Member } from './parser';
import path from 'path';

export function importData(): Vote[] {
  console.log('Reading data...');
  const files = fs.readdirSync('./data');
  const data: Vote[] = files
    .map(name => fs.readFileSync(path.join('data', name))).map(file => JSON.parse(file.toString()));
  console.log('Cleanup...');
  // remove note on votes
  data.forEach(a => a.results
    .filter(r => r.vote.indexOf('\n') > -1)
    .forEach(r => r.vote = r.vote.substring(0, r.vote.indexOf('\n'))))
  // typos
  replaceName(data, 'Ahmetovic, Adis', 'Ahmetović, Adis');
  replaceName(data, 'Bacherle, Tobias', 'Bacherle, Tobias B.');
  replaceName(data, 'Hoffmann, Dr. Christoph', 'Hoffmann, Dr. forest Christoph');
  replaceName(data, 'Mayer, Zoe', 'Mayer, Dr. Zoe');
  replaceName(data, 'Santos Firnhaber, Catarina', 'Santos-Wintz, Catarina dos')
  replaceName(data, 'Santos Firnhaber, Catarina dos', 'Santos-Wintz, Catarina dos')
  replaceName(data, 'Trasnea, Ana-Maria', 'Trăsnea, Ana-Maria');
  replaceName(data, 'Wadephul, Dr. Johann', 'Wadephul, Dr. Johann David');
  replaceName(data, 'Anikó Merten', 'Anikó Glogowski-Merten');
  replaceName(data, 'Barbara Lenk', 'Barbara Benkstein');
  // replaced members
  // Dr. h. c. Thomas Sattelberger -> Nils Gründer
  // Heiko Maas                    -> Emily Vontz
  // Falko Mohrs                   -> Alexander Bartz
  // Gero Storjohann               -> Melanie Bernstein
  // Hagen Reinhold                -> Christian Bartelt
  // Alexander Graf Lambsdorff     -> Katharina Willkomm
  // Katja Kipping                 -> Clara Bünger
  // Michael Hennrich              -> Alexander Föhr
  // Oliver Krischer               -> Michael Sacher
  // Rainer Johannes Keller        -> Daniel Rinkert
  // Yasmin Fahimi                 -> Dr. Daniela De Ridder
  // Cansel Kiziltepe              -> Ana-Maria Trăsnea
  // Corinna Miazga                -> Dr. Rainer Rothfuß
  // Dr. Andreas Philippi          -> Dirk-Ulrich Mende
  console.log('Done');
  return data;
}

export function extractMembers(data: Vote[]): Member[] {
  console.log('Processing members...')

  const names = data.map(a => a.results.map(r => r.name).flat()).flat();
  const namesUnique = new Set(names);

  return Array.from(namesUnique).map(name => {
    const a = data.map(a => a.results)
      .find(results => results.find(r => r.name === name) !== undefined)!
      .find(r => r.name === name)! 
    return {
      name,
      state: a.state,
      party: a.party
    }
  });
}

function replaceName(data: Vote[], search: string, replace: string) {
  data.forEach(a => a.results
    .filter(r => r.name === search)
    .forEach(r => r.name = replace))
}

function findIncompleteMembers(data: Vote[]) {
  const amount = new Map();
  data.map(a => a.results)
    .forEach(r => r.forEach(r => amount.set(r.name, (amount.has(r.name) ? amount.get(r.name) : 0) + 1)))
  const special = Array.from(amount.entries()).filter(e => e[1] < data.length);

  console.log(special.map(e => e[0]).map(name => {
    const parts = name.split(',');
    return parts[1].trim() + ' ' + parts[0].trim()
  }).sort());
}
