import { container } from 'tsyringe';

import IStorageprovide from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

import ImailProvider from './MailProvider/models/IMailProvider';
import EtherialMailProvider from '../providers/MailProvider/implementations/EtherialMailProvider';

import ImailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from '../providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

import ICacheProvider from './CacheProvider/models/ICacheProvider';
import RedisCacheProvider from './CacheProvider/implementations/RedisCacheProvider';


container.registerSingleton<IStorageprovide>(
    'StorageProvider',
    DiskStorageProvider,
);

container.registerSingleton<ImailTemplateProvider>(
    'MailTemplateProvider',
    HandlebarsMailTemplateProvider,
);

container.registerSingleton<ICacheProvider>(
    'CacheProvider',
    RedisCacheProvider,
);

container.registerInstance<ImailProvider>(
    'MailProvider',
    container.resolve(EtherialMailProvider),
);
