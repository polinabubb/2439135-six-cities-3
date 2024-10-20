import { Author, citys, Facilities, HousingType, Offer, Coordinates } from '../types/index.js';

export function createOffer(offerData: string): Offer {
  const [
    name, description, createdDate,city,
    preview, photos, isPremium, isFavorite,
    rating, housingType, roomsCount, guestsCount,
    price, facilities, author, commentsCount, coordinates
  ] = offerData.replace('\n', '').split('\t');

  const [
    authorName, authorEmail, authorPassword, authorType, authorAvatar
  ] = author.split(', ');

  const authorObj = {
    name: authorName,
    email: authorEmail,
    password: authorPassword,
    authorType: authorType,
    avatar: authorAvatar
  } as Author;
  const [latitude, longitude] = coordinates.split(', ');

  const coordinatesObj = {latitude: +latitude, longitude: +longitude} as Coordinates;

  return {
    name,
    description,
    date: new Date(createdDate),
    city: city as keyof citys,
    preview,
    photos: photos.split(';'),
    isPremium: Boolean(isPremium),
    isFavorite: Boolean(isFavorite),
    rating: Number.parseInt(rating, 10),
    housingType: housingType as HousingType,
    roomsCount: Number.parseInt(roomsCount, 10),
    guestsCount: Number.parseInt(guestsCount, 10),
    price: Number.parseInt(price, 10),
    facilities: facilities.split(', ').map((item) => item as Facilities),
    author: authorObj,
    commentsCount: Number.parseInt(commentsCount, 10),
    coordinates: coordinatesObj
  };
}
