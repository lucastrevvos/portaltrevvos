export declare class UploadsController {
    upload(file: Express.Multer.File, req: any): Promise<{
        url: string;
    }>;
}
