import Redis, {Redis as RedisClient} from 'ioredis'
import ICacheProvider from '../models/ICacheProvider';
import casheConfig from '@config/cache';

export default class RedisCasheProvider implements ICacheProvider {
    private client: RedisClient;

    constructor() {
        this.client = new Redis(casheConfig.config.redis);
    }

    public async save(key: string, value: any): Promise<void> {
        await this.client.set(key, JSON.stringify(value));
    }

    public async invalidate(key: string): Promise<void> {
        await this.client.del(key);
    }

    public async invalidatePrefix(prefix: string): Promise<void> {
        const keys = await this.client.keys(`${prefix}:*`);

        const pipeline = await this.client.pipeline();

        keys.forEach(key => {
            pipeline.del(key);
        });

        await pipeline.exec();
    }

    public async recover<T>(key: string): Promise<T | null> {
        const data = await this.client.get(key);

        if(!data) {
            return null;
        }

        const parsedData = JSON.parse(data) as T;

        return parsedData;
    }
}
