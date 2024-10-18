import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';

import { Offer, City, HousingType, Author, Facilities } from '../../types/offer.js';

function parseCoordinates(coordinates: string){
  return coordinates.split(', ').map(([latitude, longitude]) => ({
    latitude : Number.parseInt(latitude, 10),
    longitude : Number.parseInt(longitude, 10) }))[0];
}

function parseAuthor(author: string): Author {
  return [author.split(', ')].map(([name, email, password, authorType, avatar]) => ({
    name : name,
    email : email,
    password : password,
    authorType : authorType,
    avatar : avatar}))[0] as Author;
}


export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(
        ([
          name,
          description,
          date,
          city,
          preview,
          photos,
          isPremium,
          isFavorite,
          rating,
          housingType,
          roomsCount,
          guestsCount,
          price,
          facilities,
          author,
          commentsCount,
          coordinates,
        ]) => ({
          name : name,
          description: description,
          date: new Date(date),
          city: city as City,
          preview: preview,
          photos: photos.split(';'),
          price: Number.parseInt(price, 10),
          isPremium: JSON.parse(isPremium),
          isFavorite: JSON.parse(isFavorite),
          rating: Number.parseInt(rating, 10),
          housingType: housingType as HousingType,
          roomsCount: Number.parseInt(roomsCount, 10),
          guestsCount: Number.parseInt(guestsCount, 10),
          facilities: facilities.split(', ') as Facilities[],
          author: parseAuthor(author),
          commentsCount: Number.parseInt(commentsCount, 10),
          coordinates: parseCoordinates(coordinates)
        })
      );
  }
}
