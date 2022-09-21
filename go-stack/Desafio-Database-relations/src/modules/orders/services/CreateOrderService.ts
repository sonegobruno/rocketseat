import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer does not exists.');
    }

    const requestedProducts = await this.productsRepository.findAllById(
      products.map(product => ({ id: product.id })),
    );

    const selectedProducts = products.map(selectedProduct => {
      const productExists = requestedProducts.find(
        product => product.id === selectedProduct.id,
      );

      if (!productExists) {
        throw new AppError(`Product ${selectedProduct.id} not found.`);
      }

      if (
        productExists.quantity === 0 ||
        productExists.quantity <= selectedProduct.quantity
      ) {
        throw new AppError(
          `
            Insufficient items in stock of product ${selectedProduct.id}.
            There is only ${productExists.quantity} in stock.
          `,
        );
      }
      return {
        product_id: selectedProduct.id,
        price: productExists.price,
        quantity: selectedProduct.quantity,
      };
    });

    const order = await this.ordersRepository.create({
      customer,
      products: selectedProducts,
    });

    await this.productsRepository.updateQuantity(products);

    return order;
  }
}

export default CreateOrderService;
