import csvParse from 'csv-parse';
import { getCustomRepository, getRepository, In } from 'typeorm';
import fs from 'fs';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface CSVtransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const contactReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      from_line: 2,
    });

    const parseCSV = contactReadStream.pipe(parsers);

    const transactions: CSVtransaction[] = [];

    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({
        title,
        type,
        value,
        category,
      });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const existentCategories = await categoriesRepository.find({
      where: { title: In(categories) },
    });

    const existentCategoriesTitle = existentCategories.map(
      (category: Category) => category.title,
    );

    const addCategoriesTitle = categories
      .filter(category => !existentCategoriesTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const addNewCategories = categoriesRepository.create(
      addCategoriesTitle.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(addNewCategories);

    const allCategories = [...addNewCategories, ...existentCategories];

    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: allCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(createdTransactions);

    await fs.promises.unlink(filePath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
