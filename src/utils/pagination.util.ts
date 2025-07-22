import { Repository, FindManyOptions, ObjectLiteral } from 'typeorm';

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export class PaginationUtil {
  /**
   * Función de paginación reutilizable
   * @param repository - Repositorio de TypeORM
   * @param options - Opciones de búsqueda de TypeORM
   * @param paginationOptions - Opciones de paginación (page, limit)
   * @returns Resultado paginado
   */
  static async paginate<T extends ObjectLiteral>(
    repository: Repository<T>,
    options: FindManyOptions<T> = {},
    paginationOptions: PaginationOptions = {}
  ): Promise<PaginationResult<T>> {
    const { page = 1, limit = 10 } = paginationOptions;

    // Validar que page y limit sean números positivos
    const currentPage = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Math.min(100, Number(limit))); // máximo 100 items por página

    // Calcular offset
    const skip = (currentPage - 1) * itemsPerPage;

    // Agregar paginación a las opciones de búsqueda
    const findOptions: FindManyOptions<T> = {
      ...options,
      skip,
      take: itemsPerPage,
    };

    // Ejecutar consulta con conteo
    const [data, totalItems] = await repository.findAndCount(findOptions);

    // Calcular metadatos
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    return {
      data,
      meta: {
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    };
  }
}
