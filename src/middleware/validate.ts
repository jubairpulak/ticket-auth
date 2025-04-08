import { Injectable, ArgumentMetadata, BadRequestException,ArgumentsHost, ValidationPipe, UnprocessableEntityException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response, NextFunction  } from 'express';


@Injectable()
export class ValidateInputPipe extends ValidationPipe {

  constructor(){ 

    super({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new UnprocessableEntityException(validationErrors);
      },
      whitelist: true, // enables the whitelist option
      transform: true, // ensures that the transformation of the payload to DTOs is enabled
      forbidNonWhitelisted: true // throws an exception if non-whitelisted properties are found
    }) 

  }


   public async transform(value, metadata: ArgumentMetadata) {

      try {

        return await super.transform(value, metadata);

      } catch (e) {
        const error = e
         if (e instanceof UnprocessableEntityException) {
            throw new UnprocessableEntityException(error.response);
         }
      }
   }

      private handleError(errors) {

        const errorsArray = {}
        errors.forEach((error, index) => !error.children.length ? errorsArray[error.property] = Object.values(error.constraints) :  error.children.forEach((nestederror,nestedindex) => errorsArray[nestederror.property] = Object.values(nestederror.constraints)) )
        return errorsArray;

   }
}
