import {inject, injectable} from 'inversify';
import {Response, Request} from 'express';
import {BaseController, HttpMethod} from '../../libs/rest/index.js';//RequestBody, RequestParams
import {Logger} from '../../libs/logger/index.js';
import {Component} from '../../types/index.js';
import {OfferService} from './offer-service.interface.js';
//import { Config, RestSchema } from '../../libs/config/index.js';
import {fillDTO} from '../../helpers/index.js';
import {OfferRdo} from './rdo/offer.rdo.js';
//import { CreateOfferRequest } from './create-offer-request.type.js';
//import { AuthorService } from '../author/author-service.interface.js';
//import { CommentService } from '../comment/comment-service.interface.js';
//import { UpdateOfferDto } from './dto/update-offer.dto.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';

//import {ParamsDictionary} from 'express-serve-static-core';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    // @inject(Component.AuthorService) private readonly authorService: AuthorService,
    // @inject(Component.CommentService) private readonly commentService: CommentService,
    // @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController…');

    //offers
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.getOffers});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.createOffer});

    // /offers/{offerId}
    // TODO
    // this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.getOffer });
    // this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.deleteOffer });
    // this.addRoute({ path: '/:offerId', method: HttpMethod.Put, handler: this.editOffer });

    // /offers/{offerId}/comments
    // this.addRoute({ path: '/:offerId/comments', method: HttpMethod.Get, handler: this.getCommentsbyOfferId });
    // this.addRoute({ path: '/:offerId/comments', method: HttpMethod.Post, handler: this.addCommentByOfferId });

    // /offers/premium/{city}:
    // this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremiumByCity });

    //  /offers/favorite:
    // this.addRoute({ path: '/favorite', method: HttpMethod.Get, handler: this.getFavorites });

    // /offers/favorite/{offerId}:
    // this.addRoute({ path: '/favorite/:offerId', method: HttpMethod.Post, handler: this.addToFavorite });
    // this.addRoute({ path: '/favorite/:offerId', method: HttpMethod.Delete, handler: this.deleteFromFavorite });

  }

  //offers
  public async createOffer({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>, res: Response): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, result));
  }

  public async getOffers(_request: Request, res: Response): Promise<void> {
    const result = await this.offerService.find();
    this.ok(res, fillDTO(OfferRdo, result));
  }

  // /offers/{offerId}
  // public async deleteOffer({ params }: Request<{
  //     offerId: string;
  //   }, RequestParams, RequestBody>, res: Response): Promise<void> {
  //     const { offerId } = params;
  //     const offer = await this.offerService.deleteById(offerId);
  //     await this.commentService.deleteByOfferId(offerId);
  //     this.noContent(res, offer);
  // }
  // public async getOffer({ params }: Request<{ offerId: string; }>, res: Response): Promise<void> {
  //     const { offerId } = params;
  //     const offer = await this.offerService.findById(offerId);
  //     this.ok(res, fillDTO(OfferRdo, offer));
  // }

  // public async editOffer({ body, params }: Request<{ offerId: string; }, UpdateOfferDto>, res: Response): Promise<void> {
  //     const { offerId } = params;
  //     const offer = await this.offerService.updateById(offerId, body);
  //     this.ok(res, fillDTO(OfferRdo, offer));
  // }

  // /offers/{offerId}/comments:
  // public async getCommentsbyOfferId({ params }: Request<{ offerId: string; }>, res: Response): Promise<void> {
  //     const { offerId } = params;
  //     const comments = await this.commentService.findByOfferId(offerId);
  //     this.ok(res, fillDTO(OfferRdo, comments));
  // }
  //   public async addCommentByOfferId({ body, params }: Request<{ offerId: string; } >, res: Response): Promise<void> {
  //     const { offerId } = params;
  //     const result = await this.commentService.create(body);
  //     this.created(res, fillDTO(OfferRdo, result));
  //   }

  // /offers/premium/{city}:
  // public async getPremiumByCity({ params }: Request<{ city: string; }>, res: Response): Promise<void> {
  //     const { city } = params;
  //     const offers = await this.offerService.getPremiumOffersByCity(city);
  //     this.ok(res, fillDTO(OfferRdo, offers));
  // }
  //  /offers/favorite:
  // public async getFavorites({params}: Request<{authorId: string}>, res: Response): Promise<void> {
  //     const { authorId} = params;
  //     const offers = await this.offerService.getFavoriteOffersByAuthor(authorId);
  //     this.ok(res, fillDTO(OfferRdo, offers));
  // }
  // /offers/favorite/{offerId}:
  //public async addToFavorite({ params }: Request<{ offerId: string }>, res: Response): Promise<void> {
  //const { offerId } = params;
  //await this.offerService.changeFavoriteByIdToTrue(offerId, authorId);
  //this.noContent(res, {});
  //}

  //public async deleteFromFavorite({ params }: Request<{ offerId: string }>, res: Response): Promise<void> {
  //const { offerId } = params;
  //await this.offerService.changeFavoriteByIdToFalse(offerId, authorId);
  //this.noContent(res, {});
  //}
}
