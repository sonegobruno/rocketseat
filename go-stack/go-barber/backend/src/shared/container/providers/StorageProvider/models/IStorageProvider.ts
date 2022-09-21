export default interface IStorageProvider {
    savefile(file: string): Promise<string>;
    deleteFile(file: string): Promise<void>;
}
