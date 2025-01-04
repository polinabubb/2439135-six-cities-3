import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  HttpError,
  HttpMethod, UploadFileMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateAuthorRequest } from './create-author-request.type.js';
import { AuthorService } from './author-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { AuthorRdo } from './rdo/author.rdo.js';
import { LoginAuthorRequest } from './login-author-request.type.js';
import { CreateAuthorDto } from './dto/create-author.dto.js';
import { LoginAuthorDto } from './dto/login-author.dto.js';

@injectable()
export class AuthorController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.AuthorService) private readonly authorService: AuthorService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for AuthorController');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateAuthorDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginAuthorDto)]
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
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

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
