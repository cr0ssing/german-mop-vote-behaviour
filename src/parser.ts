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
import { load } from 'cheerio';
import 'moment-timezone';
import moment from 'moment';

export type Member = {
  state: string | undefined,
  name: string,
  party: string
}

export type Result = Member & {
  vote: string
}

export function extractResults(html: string): Result[] {
  const $ = load(html);
  return $('.bt-teaser-person-text').map((i, e) => ({
    state: e.attributes.find(a => a.name === 'data-bundesland')?.value,
    name: $('h3', e).first().text(),
    party: $('.bt-person-fraktion', e).first().text(),
    vote: $('.bt-person-abstimmung', e).first().text().trim()
  })).toArray();
}

export type MetaData = {
  date: Date,
  title: string,
  description: string,
  links: string[]
}

export function extractMeta(html: string) {
  const $ = load(html);

  const section = $('section#bt-namentliche-abstimmungen');
  const article = $('article', section).first();
  const dateString = $('span.bt-date', article).first().text().trim();
  const date = toTimeZone(dateString, 'Europe/Berlin');
  const title = $('h3', article).first().text().trim();
  const description = $('p', article).first()
  const descriptionText = description.text().trim();
  const links = $('a', description).map((i, e) => e.attribs.href).toArray();
  
  return {
    date,
    title,
    description: descriptionText,
    links
  }
}

function toTimeZone(date: string, zone: string) {
  var format = 'DD MMMM YYYY';
  return moment(date, format).tz(zone).toDate();
}
