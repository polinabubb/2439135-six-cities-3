import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateAuthorRequest } from './create-author-request.type.js';
import { AuthorService } from './author-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { AuthorRdo } from './rdo/author.rdo.js';
import { LoginAuthorRequest } from './login-author-request.type.js';

@injectable()
export class AuthorController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.AuthorService) private readonly authorService: AuthorService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for AuthorController');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    //this.addRoute({ path: '/logout'});
  }

  public async create(
    { body }: CreateAuthorRequest,
    res: Response,
  ): Promise<void> {
    const existsAuthor = await this.authorService.findByEmail(body.email);

    if (existsAuthor) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Author with email «${body.email}» exists.`,
        'AuthorController'
      );
    }

    const result = await this.authorService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(AuthorRdo, result));
  }

  public async login(
    { body }: LoginAuthorRequest,
    _res: Response,
  ): Promise<void> {
    const existsAuthor = await this.authorService.findByEmail(body.email);

    if (! existsAuthor) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `Author with email ${body.email} not found.`,
        'AuthorController',
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'AuthorController',
    );
  }
}