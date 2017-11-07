import {Inject, Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class FileServerService {

    private readonly baseURL = 'https://balogotthon.ddns.net/file-server/';

    constructor(@Inject(Http) private _http: Http) {
    }

    uploadFiles(fileList: FileList) {
        if (fileList.length > 0) {
            const file: File = fileList[0];
            const formData: FormData = new FormData();
            formData.append('files', file, file.name);

            return this._http.post(this.baseURL, formData)
                .map(res => res.json())
                .catch(error => Observable.throw(error));
        }
    }

    getBaseURL() {
        return this.baseURL;
    }

}
