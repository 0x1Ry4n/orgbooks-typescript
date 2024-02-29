import { Request, Response, NextFunction } from "express";
import { statusCode, errorHandler } from "@/utils";
import { prisma } from "@/config/database/prisma";
import { CreateBookstoreRequest, UpdateBookstoreRequest } from "@/validators/bookstore";
import { searchCep } from "@/services/cep";
import logger from "@/config/logger";


export class BookstoreController {
    async createBookstore(req: CreateBookstoreRequest, res: Response, next: NextFunction) {
        try {
            const { name, email, phoneNumber, cep } = req.body;
            
            const cepSearched = await searchCep(cep);

            logger.info(cepSearched);

            if (cepSearched?.error != null) {
                return res.status(statusCode.BAD_REQUEST).json({
                    success: false,
                    error: "CEP não encontrado"
                });
            }

            logger.info(cepSearched);

            const bookstore = await prisma.bookstore.create({
                data: {
                    name, 
                    email, 
                    phoneNumber, 
                    cep: cepSearched.data.cep,
                    city: cepSearched.data.localidade,
                    admins: {
                        connect: {
                            id: req.user!.id as string
                        }
                    } 
                }
            })

            res.status(201).json({
                success: true,
                data: bookstore
            })
        } catch(error) {
            errorHandler(error, req, res);
        }
    }

    async updateById(req: UpdateBookstoreRequest, res: Response) {
      try {
          const { name, cep } = req.body;

          const bookstoreUpdated = await prisma.bookstore.update({
              where: {
                  id: req.params.id,
              },
              data: {
                  name,
                  cep,
              },
              select: {
                  name: true,
                  cep: true,
              },
          });

          res.status(statusCode.OK).json({
              success: true,
              data: bookstoreUpdated,
          });
      } catch (error) {
          errorHandler(error, req, res)
      }
  }

  async findById(req: Request, res: Response) {
      try {
          const bookstoreFounded = await prisma.bookstore.findFirst({
              where: {
                  id: req.params.id,
              },
              select: {
                  id: true,
                  name: true,
                  email: true,
                  phoneNumber: true,
                  cep: true,
                  city: true,
                  admins: true
              },
          });

          res.status(statusCode.OK).json({
              success: true,
              data: bookstoreFounded,
          });
      } catch (error) {
          errorHandler(error, req, res)
      }
  }

  async deleteById(req: Request, res: Response) {
      try {
          const bookstoreDeleted = await prisma.bookstore.delete({
              where: {
                  id: req.params.id,
              },
          });

          res.status(statusCode.OK).json({
              success: true,
              data: bookstoreDeleted,
          });
      } catch (error) {
          errorHandler(error, req, res)
      }
  }
}