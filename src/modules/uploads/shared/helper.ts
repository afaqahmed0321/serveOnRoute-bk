export class Helper {
  static customFileName(req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    let fileExtension = '';
    if (file.mimetype.indexOf('jpeg') > -1) {
      fileExtension = 'jpg';
    } else if (file.mimetype.indexOf('png') > -1) {
      fileExtension = 'png';
    }
    const originalName = file.originalname.split('.')[0];
    cb(null, originalName + '-' + uniqueSuffix + '.' + fileExtension);
  }

  static destinationPath(req: any, file: any, cb: any) {
    cb(null, './images/');
  }
}
