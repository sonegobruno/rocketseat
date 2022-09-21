import { getRepository, Repository } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import AppError from '@shared/errors/AppError';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findCustomer = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return findCustomer;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const findCustomer = await this.ormRepository.findByIds(products);

    if (findCustomer.length !== products.length) {
      throw new AppError('Missing Product');
    }

    return findCustomer;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const selectedProducts = await this.findAllById(products);

    const newProducts = selectedProducts.map(selectedProduct => {
      const newProduct = products.find(
        product => product.id === selectedProduct.id,
      );

      if (!newProduct) {
        throw new AppError('Product not found.');
      }

      if (selectedProduct.quantity < newProduct.quantity) {
        throw new AppError('Insufficient product quantity.');
      }

      const product = selectedProduct;

      product.quantity -= newProduct.quantity;

      return product;
    });

    await this.ormRepository.save(newProducts);

    return newProducts;
  }
}

export default ProductsRepository;
