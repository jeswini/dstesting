(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "+JMX":
/*!*****************************************!*\
  !*** ./src/app/service/crud.service.ts ***!
  \*****************************************/
/*! exports provided: CrudService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CrudService", function() { return CrudService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "IheW");
/* harmony import */ var _variable_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./variable.service */ "ZA/X");
/* harmony import */ var xlsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! xlsx */ "JcrP");





let CrudService = class CrudService {
    constructor(http, variable) {
        this.http = http;
        this.variable = variable;
        this.dataFormat = {
            spreadsheet: ['xlsx', 'csv'],
            database: ['sql'],
            text: ['txt']
        };
    }
    getData(url) {
        this.variable.uploadedDataList = [];
        this.getDataObservable(url).subscribe(resp => {
            //@ts-ignore
            this.variable.uploadedDataList = resp.filter(data => this.dataFormat[this.variable.popupSubTitle.trim().toLowerCase()].includes(data.fileDetail.fileType));
            //@ts-ignore
            this.variable.uploadedDataListBckUp = resp.filter(data => this.dataFormat[this.variable.popupSubTitle.trim().toLowerCase()].includes(data.fileDetail.fileType));
        });
    }
    getDataObservable(url) {
        return this.http.get(url);
    }
    uploadData(e) {
        const file = e.target.files[0];
        const fileName = file.name;
        const fileDetails = {
            filename: fileName,
            fileType: fileName.split('.')[fileName.split('.').length - 1],
            filePath: null
        };
        const reader = new FileReader();
        reader.onloadend = (event) => {
            const fileData = event.target.result;
            fileDetails.filePath = fileData; // Set the file path as the file data
            if (fileDetails.fileType === 'csv' || fileDetails.fileType === 'xlsx') {
                const binarystr = fileData;
                const wb = xlsx__WEBPACK_IMPORTED_MODULE_4__["read"](binarystr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = xlsx__WEBPACK_IMPORTED_MODULE_4__["utils"].sheet_to_json(ws);
                const uploadedFileData = {
                    fileDetail: fileDetails,
                    data: data,
                    information: '',
                    separator: '',
                    header: Object.keys(data[0]).map(key => {
                        return { 'columnHeader': key };
                    })
                };
                this.http.post('/getData', uploadedFileData).subscribe((resp) => {
                    this.getData('/getData');
                });
            }
            else if (fileDetails.fileType === 'txt' || fileDetails.fileType === 'sql') {
                const fileReader = new FileReader();
                const self = this;
                fileReader.onloadend = function (x) {
                    const data = fileReader.result;
                    const uploadedFileData = {
                        fileDetail: fileDetails,
                        data: data,
                        header: []
                    };
                    self.http.post('/getData', uploadedFileData).subscribe((resp) => {
                        console.log('Success');
                        self.getData('/getData');
                    });
                };
                fileReader.readAsText(file);
            }
        };
        reader.readAsBinaryString(file);
    }
    deleteRecord(resp) {
        // console.log(resp);
        if (confirm('Do you really want to delete ' + resp.fileDetail.filename + ' database?')) {
            this.http.delete('/getData/' + resp.id).subscribe((resp) => {
                this.getData('/getData');
            });
        }
    }
    updateInformation(data) {
        this.variable.selectedData.information = data;
        const uploadedDataList = JSON.parse(localStorage.getItem('mockData'));
        uploadedDataList.forEach(resp => {
            if (resp.id === this.variable.selectedData.id) {
                resp['information'] = this.variable.selectedData.information;
            }
        });
        localStorage.setItem('mockData', JSON.stringify(uploadedDataList));
        this.getData('/getData');
        this.variable.popupAction = 'input';
    }
    updateHeader() {
        const uploadedDataList = JSON.parse(localStorage.getItem('mockData'));
        uploadedDataList.forEach(resp => {
            if (resp.id === this.variable.selectedData.id) {
                resp['header'] = this.variable.selectedData.header;
            }
        });
        localStorage.setItem('mockData', JSON.stringify(uploadedDataList));
        this.getData('/getData');
    }
    updateContent(actionEvent, character = null) {
        const uploadedDataList = JSON.parse(localStorage.getItem('mockData'));
        if (actionEvent === 'speicalChar') {
            uploadedDataList.forEach(resp => {
                if (resp.id === this.variable.selectedData.id) {
                    if (this.variable.headersQuestion.q1 === 'Yes') {
                        resp['data'] = this.variable.selectedData.data.split('\n').map(info => info.split(this.variable.selectedData.choiceOfSeparator)).slice(1);
                    }
                    else {
                        resp['data'] = this.variable.selectedData.data.split('\n').map(info => info.split(this.variable.selectedData.choiceOfSeparator));
                    }
                }
            });
        }
        else {
            uploadedDataList.forEach(resp => {
                if (resp.id === this.variable.selectedData.id) {
                    this.variable.selectedData.data.split('\n').map((info, index) => {
                        this.variable.columnSeparatorArray.map((range, indexj) => {
                            resp['data'][index][indexj] = info.substring(range.columnHeader);
                        });
                    });
                }
            });
        }
        localStorage.setItem('mockData', JSON.stringify(uploadedDataList));
        this.getData('/getData');
    }
    handleMergeAction(url, data) {
        const baseUrl = 'https://datasourcenj.herokuapp.com';
        return this.http.post(baseUrl + url, data);
    }
};
CrudService.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] },
    { type: _variable_service__WEBPACK_IMPORTED_MODULE_3__["VariableService"] }
];
CrudService = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    })
], CrudService);



/***/ }),

/***/ "/Abm":
/*!*******************************************************!*\
  !*** ./src/app/component/detail/detail.component.css ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJkZXRhaWwuY29tcG9uZW50LmNzcyJ9 */");

/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\ogjes\OneDrive\Desktop\DataSource-master\DataSource\UI\src\main.ts */"zUnb");


/***/ }),

/***/ "179K":
/*!******************************************!*\
  !*** ./src/app/teste/teste.component.ts ***!
  \******************************************/
/*! exports provided: TesteComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TesteComponent", function() { return TesteComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _raw_loader_teste_component_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! raw-loader!./teste.component.html */ "DQ3Y");
/* harmony import */ var _teste_component_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./teste.component.css */ "vgQ+");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "8Y7J");




let TesteComponent = class TesteComponent {
    constructor() {
        this.showpopup = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.closemodal = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
    }
    ngOnInit() { }
    showpopupChild(e) {
        console.log('click');
        this.showpopup.emit(e);
    }
    closemodalChild(e) {
        this.closemodal.emit(e);
    }
};
TesteComponent.ctorParameters = () => [];
TesteComponent.propDecorators = {
    showpopup: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"] }],
    closemodal: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"] }]
};
TesteComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
        selector: "app-teste",
        template: _raw_loader_teste_component_html__WEBPACK_IMPORTED_MODULE_1__["default"],
        styles: [_teste_component_css__WEBPACK_IMPORTED_MODULE_2__["default"]]
    })
], TesteComponent);



/***/ }),

/***/ "1Eu6":
/*!******************************************************!*\
  !*** ./src/app/component/detail/detail.component.ts ***!
  \******************************************************/
/*! exports provided: DetailComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DetailComponent", function() { return DetailComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _raw_loader_detail_component_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! raw-loader!./detail.component.html */ "5vz4");
/* harmony import */ var _detail_component_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./detail.component.css */ "/Abm");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _service_variable_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../service/variable.service */ "ZA/X");
/* harmony import */ var _service_crud_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../service/crud.service */ "+JMX");
/* harmony import */ var _service_data_source_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../service/data-source.service */ "Ad12");







let DetailComponent = class DetailComponent {
    constructor(variable, crud, dataSource) {
        this.variable = variable;
        this.crud = crud;
        this.dataSource = dataSource;
    }
    ngOnInit() {
    }
    getDataHeader(data) {
        return Object.keys(data);
    }
};
DetailComponent.ctorParameters = () => [
    { type: _service_variable_service__WEBPACK_IMPORTED_MODULE_4__["VariableService"] },
    { type: _service_crud_service__WEBPACK_IMPORTED_MODULE_5__["CrudService"] },
    { type: _service_data_source_service__WEBPACK_IMPORTED_MODULE_6__["DataSourceService"] }
];
DetailComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
        selector: 'app-detail',
        template: _raw_loader_detail_component_html__WEBPACK_IMPORTED_MODULE_1__["default"],
        styles: [_detail_component_css__WEBPACK_IMPORTED_MODULE_2__["default"]]
    })
], DetailComponent);



/***/ }),

/***/ "1VHI":
/*!************************************!*\
  !*** ./src/app/hello.component.ts ***!
  \************************************/
/*! exports provided: HelloComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HelloComponent", function() { return HelloComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");


let HelloComponent = class HelloComponent {
};
HelloComponent.propDecorators = {
    name: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"] }]
};
HelloComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'hello',
        template: `<h1>Hello {{name}}!</h1>`,
        styles: ["h1 { font-family: Lato; }"]
    })
], HelloComponent);



/***/ }),

/***/ "5vz4":
/*!**********************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/component/detail/detail.component.html ***!
  \**********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<table>\n    <ng-container *ngIf=\"variable.selectedRecordForDetail.length\">\n        <tr>\n            <th *ngFor=\"let head of getDataHeader(variable.selectedRecordForDetail[0])\">{{head}}</th>\n        </tr>\n            <tr *ngFor=\"let data of variable.selectedRecordForDetail\">\n            <td *ngFor=\"let head of getDataHeader(variable.selectedRecordForDetail[0]); let i = index\">{{data[head] ? data[head] : (data[i] ? data[i] : '0')}}</td>\n        </tr>\n    </ng-container>\n    <tr *ngIf=\"!variable.selectedRecordForDetail.length\">\n        <td>No Data Found</td>\n    </tr>\n</table>\n  ");

/***/ }),

/***/ "7+2v":
/*!***********************************************************************!*\
  !*** ./src/app/component/analysis-popup/analysis-popup.component.css ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhbmFseXNpcy1wb3B1cC5jb21wb25lbnQuY3NzIn0= */");

/***/ }),

/***/ "8PFa":
/*!*****************************************************************!*\
  !*** ./src/app/component/input-popup/input-popup.component.css ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJpbnB1dC1wb3B1cC5jb21wb25lbnQuY3NzIn0= */");

/***/ }),

/***/ "A3xY":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhcHAuY29tcG9uZW50LmNzcyJ9 */");

/***/ }),

/***/ "Ad12":
/*!************************************************!*\
  !*** ./src/app/service/data-source.service.ts ***!
  \************************************************/
/*! exports provided: DataSourceService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataSourceService", function() { return DataSourceService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _variable_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./variable.service */ "ZA/X");
/* harmony import */ var _crud_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./crud.service */ "+JMX");
/* harmony import */ var _tableUtil__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../tableUtil */ "U37X");





let DataSourceService = class DataSourceService {
    constructor(variable, crud) {
        this.variable = variable;
        this.crud = crud;
    }
    openPopup(title = 'Data Source', action = 'input') {
        this.variable.popupFlag = true;
        /*this.variable.outputTable = {
          data: [],
          header: []
        };
        if (this.variable.listOfDraggedFiles.action && this.variable.listOfDraggedFiles.action.includes('merge')) {
          /*this.http.post('/action', {body: this.variable.listOfDraggedFiles.data}).subscribe((resp) => {
            console.log('Success', resp);
          });* /
          let maxDataCount = 0;
          this.variable.listOfDraggedFiles.data.map(data => {
            maxDataCount = maxDataCount < data.data.length ? data.data.length : maxDataCount;
          })
          console.log(maxDataCount);
          for (let i = 0; i < maxDataCount; i++) {
            let outputData = [];
            this.variable.listOfDraggedFiles.data.map(selData => {
              outputData = {
                ...outputData,
                ...selData.data[i]
              };
            });
            this.variable.outputTable.data.push(outputData);
          }
          this.variable.outputTable.header = Object.keys(this.variable.outputTable.data[0]);
        }*/
        this.setPopupDetails(title, action);
    }
    setPopupDetails(title = null, action = null) {
        this.variable.popupTitle = title;
        this.variable.popupAction = action;
    }
    closePopup() {
        this.variable.popupFlag = false;
        this.setPopupDetails();
    }
    showInfo(resp) {
        this.variable.selectedData = resp;
        this.variable.popupTitle = 'About ' + resp.fileDetail.filename;
        this.variable.popupAction = 'file-info';
    }
    showData(resp) {
        if (resp.data) {
            this.variable.selectedData = resp;
            this.variable.popupTitle = 'Details ';
        }
        else {
            this.variable.selectedData = resp;
            try {
                this.variable.popupTitle =  true ? resp.fileDetail.filename : undefined;
            }
            catch (e) {
                this.variable.popupTitle = 'Data in detail';
            }
        }
        this.variable.popupAction = 'file-data';
    }
    showHead(resp) {
        if (resp.data) {
            this.variable.selectedData = resp;
            this.variable.popupTitle = 'Details ';
        }
        else {
            this.variable.selectedData = resp;
            this.variable.popupTitle = 'Data ' + resp.fileDetail.filename;
        }
        this.variable.popupAction = 'file-head';
    }
    backToList() {
        this.variable.popupAction = 'input';
        this.variable.popupTitle = 'CHOOSE FILE';
    }
    backToAction() {
        this.variable.popupAction = 'action';
        this.variable.popupTitle = 'MERGE ACTION';
    }
    backToDetail() {
        this.variable.popupAction = 'detail';
        this.variable.popupTitle = 'Details of : ' + this.variable.selectedRecordForDetail.fileDetail.filename;
    }
    selectFile(resp) {
        this.variable.listOfDraggedFiles.data.push(resp);
        document.querySelector("#node-" + this.variable.selectedNode + " .title-box .iconInfo").innerHTML = resp.fileDetail.filename;
        this.variable.popupFlag = false;
    }
    saveAction(funParam) {
        this.variable.listOfDraggedFiles.actionCommonColumns = this.variable.actionCommonColumns;
        this.variable.listOfDraggedFiles.action = this.variable.popupSubTitle;
        let fileContentList = [];
        for (let val of this.variable.listOfDraggedFiles.data) {
            console.log("Value of File Names List", val);
            console.log("Data", JSON.stringify(val.data));
            fileContentList.push(JSON.stringify(val.data));
        }
        if (this.variable.popupSubTitle === 'merge') {
            const param = {
                "ActionName": "Merge",
                "fileList": this.variable.listOfDraggedFiles.data.map(data => data.fileDetail.filePath),
                "mergeColumn": this.variable.listOfDraggedFiles.actionCommonColumns[0],
                "sortColumnNames": [],
                "projectColumns": [],
                "outputFileName": "",
                "encodingColumns": [],
                "x_columns": [],
                "y_columns": "",
                "jsonData": fileContentList.length > 0 ? fileContentList : []
            };
            this.crud.handleMergeAction('/action/', param).subscribe(resp => {
                console.log(resp);
                this.variable.outputTable.data = resp;
                // @ts-ignore
                this.variable.stateWiseData.merge = resp;
                this.variable.outputTable.header = Object.keys(resp[0]);
            });
            document.querySelector("#node-" + this.variable.selectedNode + " .title-box .iconInfo").innerHTML = 'Merge <br/>Common Fields: ' + this.getActionSummary();
        }
        else if (this.variable.popupSubTitle === 'sort' || this.variable.popupSubTitle === 'projection' || this.variable.popupSubTitle === 'encode') {
            let param = {};
            if (this.variable.popupSubTitle !== 'encode') {
                param = {
                    "ActionName": this.variable.popupSubTitle === 'sort' ? "Sort" : "Projection",
                    "sortColumnNames": this.variable.popupSubTitle === 'sort' ? funParam : [],
                    "fileList": this.variable.listOfDraggedFiles.data.map(data => data.fileDetail.filePath),
                    "mergeColumn": "",
                    "projectColumns": this.variable.popupSubTitle === 'projection' ? funParam : [],
                    "outputFileName": "",
                    "encodingColumns": [],
                    "x_columns": [],
                    "y_columns": "",
                    "jsonData": fileContentList.length > 0 ? fileContentList[0] : []
                };
            }
            else {
                param = {
                    "ActionName": "Encode",
                    "fileList": this.variable.listOfDraggedFiles.data.map(data => data.fileDetail.filePath),
                    "mergeColumn": "",
                    "projectColumns": [],
                    "outputFileName": "",
                    "sortColumnNames": [],
                    "x_columns": [],
                    "y_columns": "",
                    "encodingColumns": funParam,
                    "jsonData": fileContentList.length > 0 ? fileContentList[0] : []
                };
            }
            this.crud.handleMergeAction('/action/', param).subscribe(resp => {
                console.log(resp);
                this.variable.outputTable.data = resp;
                // @ts-ignore
                this.variable.stateWiseData[this.variable.popupSubTitle] = resp;
                this.variable.outputTable.header = Object.keys(resp[0]);
            });
        }
        else if (this.variable.popupSubTitle === 'decision tree') {
            const param = {
                "ActionName": "Decision Tree",
                "fileList": [],
                "mergeColumn": "",
                "projectColumns": [],
                "outputFileName": "",
                "encodingColumns": [],
                "jsonData": this.variable.outputTable.data.length ? JSON.stringify(this.variable.outputTable.data) : JSON.stringify([])
            };
            this.crud.handleMergeAction('/action/', param).subscribe(resp => {
                console.log(resp);
                this.variable.accuracy = resp['accuracy'];
            });
        }
        else if (this.variable.popupSubTitle === 'correlation') {
            const param = {
                "ActionName": "Correlation",
                "fileList": [],
                "mergeColumn": "",
                "projectColumns": [],
                "outputFileName": "C:/Users/ogjes/Desktop/graph/output2.png",
                "sortColumnNames": [],
                "encodingColumns": [],
                "jsonData": this.variable.outputTable.data.length ? JSON.stringify(this.variable.outputTable.data) : JSON.stringify([])
            };
            this.crud.handleMergeAction('/action/', param).subscribe(resp => {
                console.log(resp);
                // @ts-ignore
                this.variable.stateWiseData[this.variable.popupSubTitle] = resp;
                if (typeof resp === 'string') {
                    //@ts-ignore
                    this.variable.Correlation_matrix_encodedString = 'data:image/jpeg;base64,' + JSON.parse(resp).Correlation_matrix_encodedString.substring(2, resp['Correlation_matrix_encodedString'].length - 1);
                    this.variable.High_Correaltion_graph_encodedString = 'data:image/jpeg;base64,' + JSON.parse(resp).High_Correaltion_graph_encodedString.substring(2, resp['High_Correaltion_graph_encodedString'].length - 1);
                    this.variable.Low_Correaltion_graph_encodedString = 'data:image/jpeg;base64,' + JSON.parse(resp).Low_Correaltion_graph_encodedString.substring(2, resp['Low_Correaltion_graph_encodedString'].length - 1);
                    this.variable.Medium_Correaltion_graph_encodedString = 'data:image/jpeg;base64,' + JSON.parse(resp).Medium_Correaltion_graph_encodedString.substring(2, resp['Medium_Correaltion_graph_encodedString'].length - 1);
                }
                else {
                    this.variable.Correlation_matrix_encodedString = 'data:image/jpeg;base64,' + resp['Correlation_matrix_encodedString'].substring(2, resp['Correlation_matrix_encodedString'].length - 1);
                    this.variable.High_Correaltion_graph_encodedString = 'data:image/jpeg;base64,' + resp['High_Correaltion_graph_encodedString'].substring(2, resp['High_Correaltion_graph_encodedString'].length - 1);
                    this.variable.Low_Correaltion_graph_encodedString = 'data:image/jpeg;base64,' + resp['Low_Correaltion_graph_encodedString'].substring(2, resp['Low_Correaltion_graph_encodedString'].length - 1);
                    this.variable.Medium_Correaltion_graph_encodedString = 'data:image/jpeg;base64,' + resp['Medium_Correaltion_graph_encodedString'].substring(2, resp['Medium_Correaltion_graph_encodedString'].length - 1);
                }
                if (this.variable.popupSubTitle !== 'decision tree') {
                    // @ts-ignore
                    this.variable.outputTable.data = typeof resp.jsonData === 'string' ? JSON.parse(resp.jsonData) : resp.jsonData;
                    this.variable.outputTable.header = Object.keys(this.variable.outputTable.data[0]);
                }
            });
        }
        else if (this.variable.popupSubTitle === 'uppercase') {
            const param = {
                "ActionName": "UPPERCASE",
                "fileList": this.variable.listOfDraggedFiles.data.map(data => data.fileDetail.filePath),
                "mergeColumn": "",
                "projectColumns": [],
                "outputFileName": "C:\\Users\\ogjes\\Downloads\\Output.png",
                "sortColumnNames": (this.variable.popupSubTitle === 'uppercase') ? funParam : [],
                "encodingColumns": [],
                "jsonData": fileContentList.length > 0 ? fileContentList[0] : []
            };
            this.crud.handleMergeAction('/action/', param).subscribe(resp => {
                console.log("Result from Sort: ", resp);
                this.variable.outputTable.data = resp;
                // @ts-ignore
                this.variable.stateWiseData[this.variable.popupSubTitle] = resp;
                this.variable.outputTable.header = Object.keys(resp[0]);
            });
        }
        else if (this.variable.popupSubTitle === 'lowercase') {
            const param = {
                "ActionName": "lowercase",
                "fileList": this.variable.listOfDraggedFiles.data.map(data => data.fileDetail.filePath),
                "mergeColumn": "",
                "projectColumns": [],
                "outputFileName": "C:\\Users\\ogjes\\Downloads\\Output.png",
                "sortColumnNames": (this.variable.popupSubTitle === 'lowercase') ? funParam : [],
                "encodingColumns": [],
                "jsonData": fileContentList.length > 0 ? fileContentList[0] : []
            };
            this.crud.handleMergeAction('/action/', param).subscribe(resp => {
                console.log("Result from Sort: ", resp);
                this.variable.outputTable.data = resp;
                // @ts-ignore
                this.variable.stateWiseData[this.variable.popupSubTitle] = resp;
                this.variable.outputTable.header = Object.keys(resp[0]);
            });
        }
        this.variable.actionCommonColumns = [];
        this.variable.popupFlag = false;
    }
    getActionSummary() {
        let summary = '';
        this.variable.listOfDraggedFiles.data.map((file, index) => {
            summary = summary + ' ' + file.fileDetail.filename + ' [' + this.variable.listOfDraggedFiles.actionCommonColumns[index] + ']<br/>';
        });
        return summary;
    }
    getFirstTextLine(data) {
        try {
            return data.split('\n')[0];
        }
        catch (e) {
            return '';
        }
    }
    isString(data) {
        return typeof data === 'string';
    }
    addNewLineWithBr(data) {
        return data.replace('\n', '<br/>');
    }
    saveHeadersWithColumnSeparate() {
        this.variable.selectedData.header = this.getFirstTextLine(this.variable.selectedData.data).split(this.variable.selectedData.choiceOfSeparator === 'other' ? this.variable.selectedData.choiceOfSeparatorOther : this.variable.selectedData.choiceOfSeparator).map(option => {
            return { 'columnHeader': option };
        });
    }
    exportTable() {
        _tableUtil__WEBPACK_IMPORTED_MODULE_4__["TableUtil"].exportTableToExcel("outputTable");
    }
    getDataHeader(data) {
        return Object.keys(data);
    }
};
DataSourceService.ctorParameters = () => [
    { type: _variable_service__WEBPACK_IMPORTED_MODULE_2__["VariableService"] },
    { type: _crud_service__WEBPACK_IMPORTED_MODULE_3__["CrudService"] }
];
DataSourceService = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    })
], DataSourceService);



/***/ }),

/***/ "DOfa":
/*!*************************************************************!*\
  !*** ./src/app/component/file-head/file-head.component.css ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJmaWxlLWhlYWQuY29tcG9uZW50LmNzcyJ9 */");

/***/ }),

/***/ "DQ3Y":
/*!**********************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/teste/teste.component.html ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"box dbclickbox\" (dblclick)=\"showpopupChild($event)\">\n\tDb Click here\n\t<div class=\"modal\" style=\"display:none\">\n\t\t<div class=\"modal-content\">\n\t\t\t<span class=\"close\" (click)=\"closemodalChild($event)\">&times;</span>\n\t\t\tChange your variable !\n\t\t\t<input type=\"text\" df-name>\n  </div>\n</div>");

/***/ }),

/***/ "EXnY":
/*!************************************************************!*\
  !*** ./src/app/component/file-head/file-head.component.ts ***!
  \************************************************************/
/*! exports provided: FileHeadComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileHeadComponent", function() { return FileHeadComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _raw_loader_file_head_component_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! raw-loader!./file-head.component.html */ "Q0N7");
/* harmony import */ var _file_head_component_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./file-head.component.css */ "DOfa");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _service_variable_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../service/variable.service */ "ZA/X");
/* harmony import */ var _service_data_source_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../service/data-source.service */ "Ad12");
/* harmony import */ var _service_crud_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../service/crud.service */ "+JMX");







let FileHeadComponent = class FileHeadComponent {
    constructor(variable, dataSource, crud) {
        this.variable = variable;
        this.dataSource = dataSource;
        this.crud = crud;
        this.actionEvent = '';
        this.changeHeaders = false;
        this.changeHeadersValue = [];
    }
    ngOnInit() {
    }
    handleChangeHeader() {
        this.changeHeaders = !this.changeHeaders;
        this.variable.selectedData.header.map(head => {
            this.changeHeadersValue.push({ columnHeader: '' });
        });
    }
    ngOnDestroy() {
        this.actionEvent = '';
        this.changeHeaders = false;
        this.changeHeadersValue = [];
    }
};
FileHeadComponent.ctorParameters = () => [
    { type: _service_variable_service__WEBPACK_IMPORTED_MODULE_4__["VariableService"] },
    { type: _service_data_source_service__WEBPACK_IMPORTED_MODULE_5__["DataSourceService"] },
    { type: _service_crud_service__WEBPACK_IMPORTED_MODULE_6__["CrudService"] }
];
FileHeadComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
        selector: 'app-file-head',
        template: _raw_loader_file_head_component_html__WEBPACK_IMPORTED_MODULE_1__["default"],
        styles: [_file_head_component_css__WEBPACK_IMPORTED_MODULE_2__["default"]]
    })
], FileHeadComponent);



/***/ }),

/***/ "GeIU":
/*!**********************************************************************************!*\
  !*** ./src/app/component/transformation-popup/transformation-popup.component.ts ***!
  \**********************************************************************************/
/*! exports provided: TransformationPopupComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TransformationPopupComponent", function() { return TransformationPopupComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _raw_loader_transformation_popup_component_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! raw-loader!./transformation-popup.component.html */ "VhRb");
/* harmony import */ var _transformation_popup_component_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transformation-popup.component.css */ "HBxA");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _service_variable_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../service/variable.service */ "ZA/X");
/* harmony import */ var _service_data_source_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../service/data-source.service */ "Ad12");
/* harmony import */ var _service_crud_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../service/crud.service */ "+JMX");







let TransformationPopupComponent = class TransformationPopupComponent {
    constructor(variable, dataSource, crud) {
        this.variable = variable;
        this.dataSource = dataSource;
        this.crud = crud;
        this.sortColumnNames = '';
        this.selectedCheckboxes = [];
    }
    ngOnInit() {
    }
    onCheckboxChange(e) {
        if (e.target.checked) {
            this.selectedCheckboxes.push(e.target.value);
        }
        else {
            this.selectedCheckboxes.splice(this.selectedCheckboxes.indexOf(e.target.value), 1);
        }
    }
};
TransformationPopupComponent.ctorParameters = () => [
    { type: _service_variable_service__WEBPACK_IMPORTED_MODULE_4__["VariableService"] },
    { type: _service_data_source_service__WEBPACK_IMPORTED_MODULE_5__["DataSourceService"] },
    { type: _service_crud_service__WEBPACK_IMPORTED_MODULE_6__["CrudService"] }
];
TransformationPopupComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
        selector: 'app-transformation-popup',
        template: _raw_loader_transformation_popup_component_html__WEBPACK_IMPORTED_MODULE_1__["default"],
        styles: [_transformation_popup_component_css__WEBPACK_IMPORTED_MODULE_2__["default"]]
    })
], TransformationPopupComponent);



/***/ }),

/***/ "HBxA":
/*!***********************************************************************************!*\
  !*** ./src/app/component/transformation-popup/transformation-popup.component.css ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJ0cmFuc2Zvcm1hdGlvbi1wb3B1cC5jb21wb25lbnQuY3NzIn0= */");

/***/ }),

/***/ "OLKl":
/*!************************************************************!*\
  !*** ./src/app/component/file-info/file-info.component.ts ***!
  \************************************************************/
/*! exports provided: FileInfoComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileInfoComponent", function() { return FileInfoComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _raw_loader_file_info_component_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! raw-loader!./file-info.component.html */ "bH5L");
/* harmony import */ var _file_info_component_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./file-info.component.css */ "VJhT");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _service_variable_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../service/variable.service */ "ZA/X");
/* harmony import */ var _service_data_source_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../service/data-source.service */ "Ad12");
/* harmony import */ var _service_crud_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../service/crud.service */ "+JMX");







let FileInfoComponent = class FileInfoComponent {
    constructor(variable, dataSource, crud) {
        this.variable = variable;
        this.dataSource = dataSource;
        this.crud = crud;
        this.information = '';
    }
    ngOnInit() {
    }
};
FileInfoComponent.ctorParameters = () => [
    { type: _service_variable_service__WEBPACK_IMPORTED_MODULE_4__["VariableService"] },
    { type: _service_data_source_service__WEBPACK_IMPORTED_MODULE_5__["DataSourceService"] },
    { type: _service_crud_service__WEBPACK_IMPORTED_MODULE_6__["CrudService"] }
];
FileInfoComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
        selector: 'app-file-info',
        template: _raw_loader_file_info_component_html__WEBPACK_IMPORTED_MODULE_1__["default"],
        styles: [_file_info_component_css__WEBPACK_IMPORTED_MODULE_2__["default"]]
    })
], FileInfoComponent);



/***/ }),

/***/ "Q0N7":
/*!****************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/component/file-head/file-head.component.html ***!
  \****************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<span class=\"cursorPointer\" *ngIf=\"(variable.popupSubTitle === 'spreadsheet' || variable.popupSubTitle === 'database' || variable.popupSubTitle === 'text')\" (click)=\"dataSource.backToList()\"><- Back</span>\n<span class=\"cursorPointer\" *ngIf=\"variable.popupSubTitle === 'merge'\" (click)=\"dataSource.backToAction()\"><- Back</span>\n<span class=\"cursorPointer\" *ngIf=\"variable.popupSubTitle === 'detail'\" (click)=\"dataSource.backToDetail()\"><- Back</span>\n<!-- First Time setting headers -->\n<table class=\"w100\" *ngIf=\"!variable.selectedData.header.length\">\n  <tr>\n    <td colspan=\"2\"><p>Please answer below answers for smooth experience</p></td>\n  </tr>\n  <tr>\n    <td><label>Do you want to use 1st line as header?</label></td>\n    <td>\n      <select [(ngModel)]=\"variable.headersQuestion.q1\" class=\"my1 w100\">\n        <option>Yes</option>\n        <option>No</option>\n      </select>\n    </td>\n  </tr>\n  <!-- Separating Headers -->\n  <tr *ngIf=\"variable.headersQuestion.q1 === 'Yes'\">\n    <td><label>How do you want to separate headers?</label></td>\n    <td>\n      <select [(ngModel)]=\"variable.headersQuestion.q2\" class=\"my1 w100\">\n        <option value=\"columnSeparate\">Column Seperated by Characters</option>\n        <option value=\"characterRange\">Character Range for Columns</option>\n      </select>\n    </td>\n  </tr>\n  <tr *ngIf=\"variable.headersQuestion.q1 === 'Yes' && variable.headersQuestion.q2 === 'columnSeparate'\">\n    <td><label>Select column separator</label></td>\n    <td>\n      <select [(ngModel)]=\"variable.selectedData.choiceOfSeparator\" class=\"my1 w100\">\n        <ng-container *ngFor=\"let separator of variable.separatorList\">\n          <option value=\"{{separator}}\">{{separator === ' ' ? 'Space' : separator}}</option>\n        </ng-container>\n        <option value=\"other\">OTHER</option>\n      </select>\n      <input *ngIf=\"variable.selectedData.choiceOfSeparator === 'other'\" type=\"text\" [(ngModel)]=\"variable.selectedData.choiceOfSeparatorOther\" class=\"my1\" />\n    </td>\n  </tr>\n  <tr *ngIf=\"variable.headersQuestion.q1 === 'Yes' && variable.headersQuestion.q2 === 'columnSeparate'\">\n    <td colspan=\"2\">\n      <button class=\"mt1\" (click)=\"dataSource.saveHeadersWithColumnSeparate(); crud.updateHeader()\">Save</button>\n    </td>\n  </tr>\n  <tr *ngIf=\"variable.headersQuestion.q1 === 'Yes' && variable.headersQuestion.q2 === 'characterRange'\">\n    <td colspan=\"2\">\n      <strong>Data: [FIRST LINE]</strong>\n      <div>{{dataSource.getFirstTextLine(variable.selectedData.data)}}</div>\n      <button (click)=\"variable.columnSeparatorArray.push({columnHeader: '', charRange: ''})\">Add Column</button>\n      <table class=\"w100\">\n        <tr>\n          <th>Column Header</th>\n          <th>Character Range</th>\n          <th>Action</th>\n        </tr>\n        <tr *ngFor=\"let column of variable.columnSeparatorArray; let i = index\">\n          <td>\n            <input type=\"text\" name=\"colHeader{{i}}\" id=\"colHeader{{i}}\" [(ngModel)]=\"column.columnHeader\" placeholder=\"Column Header\" />\n          </td>\n          <td>\n            <input type=\"text\" name=\"colHeader{{i}}\" id=\"colHeader{{i}}\" [(ngModel)]=\"column.charRange\" placeholder=\"1,5\" />\n          </td>\n          <td>\n            <button (click)=\"variable.columnSeparatorArray.splice(i, 1)\">Delete</button>\n          </td>\n        </tr>\n      </table>\n      <button class=\"mt1\" (click)=\"variable.selectedData.header = variable.columnSeparatorArray; crud.updateHeader()\">Save</button>\n    </td>\n  </tr>\n  <tr *ngIf=\"variable.headersQuestion.q1 === 'No'\">\n    <td colspan=\"2\">\n      <strong>Data: [FIRST LINE]</strong>\n      <div>{{dataSource.getFirstTextLine(variable.selectedData.data)}}</div>\n      <button (click)=\"variable.columnSeparatorArray.push({columnHeader: ''})\">Add Column</button>\n      <table>\n        <tr>\n          <th>Column Header</th>\n          <th>Action</th>\n        </tr>\n        <tr *ngFor=\"let column of variable.columnSeparatorArray; let i = index\">\n          <td>\n            <input type=\"text\" name=\"colHeader{{i}}\" id=\"colHeader{{i}}\" [(ngModel)]=\"column.columnHeader\" placeholder=\"Column Header\" />\n          </td>\n          <td>\n            <button (click)=\"variable.columnSeparatorArray.splice(i, 1)\">Delete</button>\n          </td>\n        </tr>\n      </table>\n      <button class=\"mt1\" (click)=\"variable.selectedData.header = variable.columnSeparatorArray; crud.updateHeader()\">Save</button>\n    </td>\n  </tr>\n</table>\n<!-- If you have set Headers -->\n<ng-container *ngIf=\"variable.selectedData.header.length\">\n  <br/>\n  <button *ngIf=\"!changeHeaders\" class=\"mt1\" (click)=\"handleChangeHeader()\">Change Headers</button>\n  <table class=\"w100\">\n    <tr *ngFor=\"let head of variable.selectedData.header; let i = index\">\n      <td>{{head.columnHeader}}</td>\n      <td *ngIf=\"changeHeaders\">\n        <input type=\"text\" class=\"w100\" [(ngModel)]=\"changeHeadersValue[i]['columnHeader']\" />\n      </td>\n    </tr>\n  </table>\n  <button *ngIf=\"changeHeaders\" class=\"mt1\" (click)=\"variable.selectedData.header = changeHeadersValue; crud.updateHeader(); changeHeaders = !changeHeaders;\">Update Headers</button>\n  <!-- You have set headers but need to format content -->\n  <div *ngIf=\"dataSource.isString(variable.selectedData.data)\" class=\"mt1\">\n    <h2>Choose below option to separate Data</h2>\n    <button class=\"mr1\" (click)=\"actionEvent = 'speicalChar'\">Special Character Separator</button>\n    <button (click)=\"actionEvent = 'charRange'\">Separate Character Range</button>\n    <div *ngIf=\"actionEvent === 'charRange'\">\n      <button class=\"mt1\" (click)=\"variable.columnSeparatorArray.push({columnHeader: ''})\">Add Column</button>\n      <table>\n        <tr>\n          <th>Column Header</th>\n          <th>Action</th>\n        </tr>\n        <tr *ngFor=\"let column of variable.columnSeparatorArray; let i = index\">\n          <td>\n            <input type=\"text\" name=\"colHeader{{i}}\" id=\"colHeader{{i}}\" [(ngModel)]=\"column.columnHeader\" placeholder=\"0,3\" />\n          </td>\n          <td>\n            <button (click)=\"variable.columnSeparatorArray.splice(i, 1)\">Delete</button>\n          </td>\n        </tr>\n      </table>\n      <button class=\"mt1\" (click)=\"crud.updateContent(actionEvent)\">Save</button>\n    </div>\n    <div *ngIf=\"actionEvent === 'speicalChar'\">\n      <select [(ngModel)]=\"variable.selectedData.choiceOfSeparator\" class=\"my1 w100\">\n        <ng-container *ngFor=\"let separator of variable.separatorList\">\n          <option value=\"{{separator}}\">{{separator === ' ' ? 'Space' : separator}}</option>\n        </ng-container>\n        <option value=\"other\">OTHER</option>\n      </select>\n      <input *ngIf=\"variable.selectedData.choiceOfSeparator === 'other'\" type=\"text\" [(ngModel)]=\"variable.selectedData.choiceOfSeparatorOther\" class=\"my1\" />\n      <button class=\"mt1\" (click)=\"crud.updateContent(actionEvent, variable.selectedData.choiceOfSeparator === 'other' ? variable.selectedData.choiceOfSeparatorOther : variable.selectedData.choiceOfSeparator)\">Save</button>\n    </div>\n  </div>\n</ng-container>\n");

/***/ }),

/***/ "QvDl":
/*!*******************************************************************!*\
  !*** ./src/app/component/action-popup/action-popup.component.css ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhY3Rpb24tcG9wdXAuY29tcG9uZW50LmNzcyJ9 */");

/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _raw_loader_app_component_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! raw-loader!./app.component.html */ "VzVu");
/* harmony import */ var _app_component_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.component.css */ "A3xY");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser */ "cUpR");
/* harmony import */ var _teste_teste_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./teste/teste.component */ "179K");
/* harmony import */ var drawflow__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! drawflow */ "UuGl");
/* harmony import */ var drawflow__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(drawflow__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _service_default_drag_drop_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./service/default-drag-drop.service */ "TONh");
/* harmony import */ var _service_variable_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./service/variable.service */ "ZA/X");
/* harmony import */ var _service_data_source_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./service/data-source.service */ "Ad12");
/* harmony import */ var _service_crud_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./service/crud.service */ "+JMX");











let AppComponent = class AppComponent {
    constructor(sanitizer, dragDropService, dataSourceService, crud, variable) {
        this.sanitizer = sanitizer;
        this.dragDropService = dragDropService;
        this.dataSourceService = dataSourceService;
        this.crud = crud;
        this.variable = variable;
    }
    ngOnInit() {
        this.variable.id = document.getElementById("drawflow");
        this.variable.editor = new drawflow__WEBPACK_IMPORTED_MODULE_6___default.a(this.variable.id);
        this.variable.listOfDraggedFiles = {
            data: [],
            action: null,
            actionCommonColumns: []
        };
        this.dragDropService.registerEvents(this.variable.editor);
        this.variable.editor.reroute = true;
        this.variable.editor.drawflow = this.dragDropService.drawflow();
        this.variable.editor.start();
        const elements = document.getElementsByClassName("drag-drawflow");
        for (let i = 0; i < elements.length; i++) {
            elements[i].addEventListener("touchend", this.dragDropService.drop, false);
            elements[i].addEventListener("touchmove", this.dragDropService.positionMobile, false);
            elements[i].addEventListener("touchstart", this.dragDropService.drag, false);
        }
    }
};
AppComponent.ctorParameters = () => [
    { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["DomSanitizer"] },
    { type: _service_default_drag_drop_service__WEBPACK_IMPORTED_MODULE_7__["DefaultDragDropService"] },
    { type: _service_data_source_service__WEBPACK_IMPORTED_MODULE_9__["DataSourceService"] },
    { type: _service_crud_service__WEBPACK_IMPORTED_MODULE_10__["CrudService"] },
    { type: _service_variable_service__WEBPACK_IMPORTED_MODULE_8__["VariableService"] }
];
AppComponent.propDecorators = {
    testeComponent: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"], args: [_teste_teste_component__WEBPACK_IMPORTED_MODULE_5__["TesteComponent"], { read: _angular_core__WEBPACK_IMPORTED_MODULE_3__["TemplateRef"] },] }]
};
AppComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
        selector: "my-app",
        template: _raw_loader_app_component_html__WEBPACK_IMPORTED_MODULE_1__["default"],
        styles: [_app_component_css__WEBPACK_IMPORTED_MODULE_2__["default"]]
    })
], AppComponent);



/***/ }),

/***/ "TONh":
/*!******************************************************!*\
  !*** ./src/app/service/default-drag-drop.service.ts ***!
  \******************************************************/
/*! exports provided: DefaultDragDropService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultDragDropService", function() { return DefaultDragDropService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _variable_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./variable.service */ "ZA/X");
/* harmony import */ var _data_source_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./data-source.service */ "Ad12");




let DefaultDragDropService = class DefaultDragDropService {
    constructor(variable, dataSourceService) {
        this.variable = variable;
        this.dataSourceService = dataSourceService;
    }
    positionMobile(ev) {
        this.variable.mobile_last_move = ev;
    }
    allowDrop(ev) {
        ev.preventDefault();
    }
    drag(ev) {
        console.log("drag", ev);
        if (ev.type === "touchstart") {
            this.variable.mobile_item_selec = ev.target
                .closest(".drag-drawflow")
                .getAttribute("data-node");
        }
        else {
            ev.dataTransfer.setData("node", ev.target.getAttribute("data-node"));
        }
    }
    drop(ev) {
        console.log("drop", ev);
        if (ev.type === "touchend") {
            let parentdrawflow = document
                .elementFromPoint(this.variable.mobile_last_move.touches[0].clientX, this.variable.mobile_last_move.touches[0].clientY)
                .closest("#drawflow");
            if (parentdrawflow != null) {
                this.addNodeToDrawFlow(this.variable.mobile_item_selec, this.variable.mobile_last_move.touches[0].clientX, this.variable.mobile_last_move.touches[0].clientY);
            }
            this.variable.mobile_item_selec = "";
        }
        else {
            ev.preventDefault();
            let data = ev.dataTransfer.getData("node");
            this.addNodeToDrawFlow(data, ev.clientX, ev.clientY);
        }
    }
    addNodeToDrawFlow(name, pos_x, pos_y) {
        if (this.variable.editor.editor_mode === "fixed") {
            return false;
        }
        pos_x =
            pos_x *
                (this.variable.editor.precanvas.clientWidth /
                    (this.variable.editor.precanvas.clientWidth * this.variable.editor.zoom)) -
                this.variable.editor.precanvas.getBoundingClientRect().x *
                    (this.variable.editor.precanvas.clientWidth /
                        (this.variable.editor.precanvas.clientWidth * this.variable.editor.zoom));
        pos_y =
            pos_y *
                (this.variable.editor.precanvas.clientHeight /
                    (this.variable.editor.precanvas.clientHeight * this.variable.editor.zoom)) -
                this.variable.editor.precanvas.getBoundingClientRect().y *
                    (this.variable.editor.precanvas.clientHeight /
                        (this.variable.editor.precanvas.clientHeight * this.variable.editor.zoom));
        switch (name) {
            case "spreadsheet":
                let spreadsheet = `
        <div>
          <div class="title-box"><i class="fas fa-file-excel"></i><span id="spreadsheet" class="iconInfo"> SpreadSheet</span></div>
        </div>
        `;
                this.variable.editor.addNode("spreadsheet", 0, 1, pos_x, pos_y, "spreadsheet", {}, spreadsheet);
                break;
            case "database":
                let database = `
        <div>
          <div class="title-box"><i class="fas fa-server"></i> <span id="database" class="iconInfo"> Database</span></div>
        </div>
        `;
                this.variable.editor.addNode("database", 0, 1, pos_x, pos_y, "database", {}, database);
                break;
            case "text":
                let text = `
        <div>
          <div class="title-box"><i class="fas fa-file-alt"></i> <span id="text" class="iconInfo"> Text</span></div>
        </div>
        `;
                this.variable.editor.addNode("text", 0, 1, pos_x, pos_y, "text", {}, text);
                break;
            case "merge":
                let merge = `
        <div>
          <div class="title-box"><i class="fas fa-network-wired"></i> <span id="text" class="iconInfo"> Merge</span></div>
        </div>
        `;
                this.variable.editor.addNode("merge", 1, 1, pos_x, pos_y, "Merge", {}, merge);
                break;
            case "sort":
                let sort = `
        <div>
          <div class="title-box"><i class="fas fa-sort"></i> <span id="text" class="iconInfo"> Sort</span></div>
        </div>
        `;
                this.variable.editor.addNode("sort", 1, 1, pos_x, pos_y, "sort", {}, sort);
                break;
            case "projection":
                let projection = `
        <div>
          <div class="title-box"><i class="fas fa-sort"></i> <span id="text" class="iconInfo">Projection</span></div>
        </div>
        `;
                this.variable.editor.addNode("projection", 1, 1, pos_x, pos_y, "projection", {}, projection);
                break;
            case "decision_tree":
                let decision_tree = `
        <div>
          <div class="title-box"><i class="fas fa-network-wired"></i> <span id="text" class="iconInfo">Decision Tree</span></div>
        </div>
        `;
                this.variable.editor.addNode("decision_tree", 1, 1, pos_x, pos_y, "decision_tree", {}, decision_tree);
                break;
            case "regression":
                let regression = `
        <div>
          <div class="title-box"><i class="fas fa-sort"></i> <span id="text" class="iconInfo">Regression</span></div>
        </div>
        `;
                this.variable.editor.addNode("regression", 1, 1, pos_x, pos_y, "regression", {}, regression);
                break;
            case "correlation":
                let correlation = `
        <div>
          <div class="title-box"><i class="fas fa-sort"></i> <span id="text" class="iconInfo">Correlation</span></div>
        </div>
        `;
                this.variable.editor.addNode("correlation", 1, 1, pos_x, pos_y, "correlation", {}, correlation);
                break;
            case "uppercase":
                let uppercase = `
        <div>
          <div class="title-box"><span id="text" class="iconInfo">UpperCase</span> [TEXT]</div>
        </div>
        `;
                this.variable.editor.addNode("uppercase", 1, 1, pos_x, pos_y, "uppercase", {}, uppercase);
                break;
            case "lowercase":
                let lowercase = `
        <div>
          <div class="title-box"><span id="text" class="iconInfo">LowerCase</span> [text]</div>
        </div>
        `;
                this.variable.editor.addNode("lowercase", 1, 1, pos_x, pos_y, "lowercase", {}, lowercase);
                break;
            case "encode":
                let encode = `
        <div>
          <div class="title-box"><span id="text" class="iconInfo">Encode</span> [Text]</div>
        </div>
        `;
                this.variable.editor.addNode("encode", 1, 1, pos_x, pos_y, "encode", {}, encode);
                break;
            case "spreadsheetOutput":
                let spreadsheetOutput = `
        <div>
          <div class="title-box"><i class="fas fa-file-excel"></i><span id="spreadsheetOutput" class="iconInfo">Result.csv</span></div>
        </div>
        `;
                this.variable.editor.addNode("spreadsheetOutput", 1, 0, pos_x, pos_y, "spreadsheetOutput", {}, spreadsheetOutput);
                break;
            case "databaseOutput":
                let databaseOutput = `
        <div>
          <div class="title-box"><i class="fas fa-server"></i><span id="databaseOutput" class="iconInfo"> Database Output</span></div>
        </div>
        `;
                this.variable.editor.addNode("databaseOutput", 1, 0, pos_x, pos_y, "databaseOutput", {}, databaseOutput);
                break;
            case "textOutput":
                let textOutput = `
        <div>
          <div class="title-box"><i class="fas fa-file-alt"></i><span id="textOutput" class="iconInfo"> Text Output</span></div>
        </div>
        `;
                this.variable.editor.addNode("textOutput", 1, 0, pos_x, pos_y, "textOutput", {}, textOutput);
                break;
            default:
        }
    }
    changeModule(event) {
        let all = document.querySelectorAll(".menu ul li");
        for (let i = 0; i < all.length; i++) {
            all[i].classList.remove("selected");
        }
        event.target.classList.add("selected");
    }
    registerEvents(editor) {
        editor.on("nodeCreated", id => {
            console.log("Node created " + id);
        });
        editor.on("nodeRemoved", id => {
            console.log("Node removed " + id);
        });
        editor.on("nodeSelected", id => {
            console.log("Node selected " + id);
            this.variable.selectedNode = id;
            const dataInnerHTML = editor.container.querySelector('#node-' + id + ' .title-box .iconInfo') ? editor.container.querySelector('#node-' + id + ' .title-box .iconInfo').innerHTML : '';
            console.log("Node selected ", id, dataInnerHTML);
            // Input Popup Event Trigger
            if (['spreadsheet', 'database', 'text'].indexOf(dataInnerHTML.toLowerCase().trim()) !== -1) {
                this.variable.popupSubTitle = dataInnerHTML.toLowerCase().trim();
                this.dataSourceService.openPopup('CHOOSE FILE', 'input');
            }
            // Action Popup Event Trigger
            else if (['merge', 'sort', 'projection'].indexOf(dataInnerHTML.toLowerCase().trim()) !== -1) {
                if (this.variable.stateWiseData[dataInnerHTML.toLowerCase().trim()].length) {
                    this.variable.popupSubTitle = 'detail';
                    this.variable.selectedRecordForDetail = this.variable.stateWiseData[dataInnerHTML.toLowerCase().trim()];
                    this.dataSourceService.showData(this.variable.selectedRecordForDetail);
                    this.dataSourceService.openPopup('Details of : ' + dataInnerHTML.toLowerCase().trim(), 'detail');
                }
                else {
                    this.variable.popupSubTitle = dataInnerHTML.toLowerCase().trim();
                    if (!this.variable.listOfDraggedFiles.action) {
                        this.variable.listOfDraggedFiles.action = [];
                    }
                    if (typeof this.variable.listOfDraggedFiles.action === 'string') {
                        this.variable.listOfDraggedFiles.action = [this.variable.listOfDraggedFiles.action];
                    }
                    this.variable.listOfDraggedFiles.action.push(dataInnerHTML.toLowerCase().trim());
                    this.dataSourceService.openPopup(dataInnerHTML.toLowerCase().trim() + ' Action', 'action');
                    this.variable.actionCommonColumns = this.variable.listOfDraggedFiles.actionCommonColumns;
                }
            }
            // Transformation Popup Event Trigger
            else if (['uppercase', 'lowercase', 'encode'].indexOf(dataInnerHTML.toLowerCase().trim()) !== -1) {
                if (this.variable.stateWiseData[dataInnerHTML.toLowerCase().trim()].length) {
                    this.variable.popupSubTitle = 'detail';
                    this.variable.selectedRecordForDetail = this.variable.stateWiseData[dataInnerHTML.toLowerCase().trim()];
                    this.dataSourceService.showData(this.variable.selectedRecordForDetail);
                    this.dataSourceService.openPopup('Details of : ' + dataInnerHTML.toLowerCase().trim(), 'detail');
                }
                else {
                    this.variable.popupSubTitle = dataInnerHTML.toLowerCase().trim();
                    this.dataSourceService.openPopup('Transformation: ' + this.variable.popupSubTitle, 'transformation');
                }
            }
            // Analysis Popup Event Trigger
            else if (['decision tree', 'regression', 'correlation'].indexOf(dataInnerHTML.toLowerCase().trim()) !== -1) {
                this.variable.popupSubTitle = dataInnerHTML.toLowerCase().trim();
                this.dataSourceService.saveAction();
                // this.dataSourceService.openPopup('Analysis: ' + this.variable.popupSubTitle, 'analysis');
            }
            else if ((dataInnerHTML.toLowerCase().trim().includes("csv") || dataInnerHTML.toLowerCase().trim().includes("xlsx")) && !dataInnerHTML.toLowerCase().trim().includes("common fields")) {
                const iteratedTable = this.variable.uploadedDataList.filter(data => data.fileDetail.filename.toLowerCase().trim() === dataInnerHTML.toLowerCase().trim())[0];
                if (iteratedTable) {
                    this.variable.popupSubTitle = 'detailData';
                    this.variable.selectedRecordForDetail = iteratedTable.data;
                }
                else {
                    this.variable.popupSubTitle = 'detail';
                    this.variable.selectedRecordForDetail = this.variable.outputTable.data;
                }
                this.dataSourceService.showData(this.variable.selectedRecordForDetail);
                this.dataSourceService.openPopup('Details of : ' + dataInnerHTML.toLowerCase().trim().replaceAll('<br>', ''), 'detail');
            }
            else if (dataInnerHTML.toLowerCase().trim().includes("common fields")) {
                this.variable.selectedRecordForDetail = [];
                this.variable.popupSubTitle = 'detail';
                this.variable.selectedRecordForDetail = this.variable.stateWiseData.merge;
                this.dataSourceService.showData(this.variable.selectedRecordForDetail);
                this.dataSourceService.openPopup('Details of : ' + dataInnerHTML.toLowerCase().trim().replaceAll('<br>', ''), 'detail');
            }
        });
        editor.on("moduleCreated", name => {
            console.log("Module Created " + name);
        });
        editor.on("moduleChanged", name => {
            console.log("Module Changed " + name);
        });
        editor.on("connectionCreated", connection => {
            console.log("Connection created");
            console.log(connection);
        });
        editor.on("connectionRemoved", connection => {
            console.log("Connection removed");
            console.log(connection);
        });
        editor.on("mouseMove", position => {
            // console.log("Position mouse x:" + position.x + " y:" + position.y);
        });
        editor.on("nodeMoved", id => {
            console.log("Node moved " + id);
        });
        editor.on("zoom", zoom => {
            console.log("Zoom level " + zoom);
        });
        editor.on("translate", position => {
            console.log("Translate x:" + position.x + " y:" + position.y);
        });
        editor.on("addReroute", id => {
            console.log("Reroute added " + id);
        });
        editor.on("removeReroute", id => {
            console.log("Reroute removed " + id);
        });
    }
    drawflow() {
        return {
            drawflow: {
                Home: {
                    data: {}
                }
            }
        };
    }
};
DefaultDragDropService.ctorParameters = () => [
    { type: _variable_service__WEBPACK_IMPORTED_MODULE_2__["VariableService"] },
    { type: _data_source_service__WEBPACK_IMPORTED_MODULE_3__["DataSourceService"] }
];
DefaultDragDropService = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    })
], DefaultDragDropService);



/***/ }),

/***/ "U37X":
/*!******************************!*\
  !*** ./src/app/tableUtil.ts ***!
  \******************************/
/*! exports provided: TableUtil */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TableUtil", function() { return TableUtil; });
/* harmony import */ var xlsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! xlsx */ "JcrP");

const getFileName = (name) => {
    let timeSpan = new Date().toISOString();
    let sheetName = name || "ExportResult";
    let fileName = `${sheetName}-${timeSpan}`;
    return {
        sheetName,
        fileName
    };
};
class TableUtil {
    static exportTableToExcel(tableId, name) {
        let { sheetName, fileName } = getFileName(name);
        let targetTableElm = document.getElementById(tableId);
        let wb = xlsx__WEBPACK_IMPORTED_MODULE_0__["utils"].table_to_book(targetTableElm, {
            sheet: sheetName
        });
        xlsx__WEBPACK_IMPORTED_MODULE_0__["writeFile"](wb, `${fileName}.xlsx`);
    }
    static exportArrayToExcel(arr, name) {
        let { sheetName, fileName } = getFileName(name);
        var wb = xlsx__WEBPACK_IMPORTED_MODULE_0__["utils"].book_new();
        var ws = xlsx__WEBPACK_IMPORTED_MODULE_0__["utils"].json_to_sheet(arr);
        xlsx__WEBPACK_IMPORTED_MODULE_0__["utils"].book_append_sheet(wb, ws, sheetName);
        xlsx__WEBPACK_IMPORTED_MODULE_0__["writeFile"](wb, `${fileName}.xlsx`);
    }
}


/***/ }),

/***/ "UlLe":
/*!*************************************************************!*\
  !*** ./src/app/component/file-data/file-data.component.css ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJmaWxlLWRhdGEuY29tcG9uZW50LmNzcyJ9 */");

/***/ }),

/***/ "UpZD":
/*!****************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/component/file-data/file-data.component.html ***!
  \****************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- to show the data inside the file when we click on the file in the pallette-->\n\n<span class=\"cursorPointer\" *ngIf=\"(variable.popupSubTitle === 'spreadsheet' || variable.popupSubTitle === 'database' || variable.popupSubTitle === 'text')\" (click)=\"dataSource.backToList()\"><- Back</span>\n<span class=\"cursorPointer\" *ngIf=\"variable.popupSubTitle === 'merge'\" (click)=\"dataSource.backToAction()\"><- Back</span>\n<div *ngIf=\"!variable.selectedData.header.length || dataSource.isString(variable.selectedData.data)\">\n  {{variable.selectedData.data}}\n</div>\n<table *ngIf=\"variable.selectedData.header.length && !dataSource.isString(variable.selectedData.data) && variable.popupSubTitle !== 'detail'\">\n  <ng-container *ngIf=\"variable.selectedData.data.length\">\n    <tr>\n      <th *ngFor=\"let head of variable.selectedData.header\">{{head.columnHeader}}</th>\n    </tr>\n    <tr *ngFor=\"let data of variable.selectedData.data\">\n      <td *ngFor=\"let head of variable.selectedData.header; let i = index\">{{data[head.columnHeader] ? data[head.columnHeader] : data[i]}}</td>\n    </tr>\n  </ng-container>\n  <tr *ngIf=\"!variable.selectedData.data.length\">\n    <td>No Data Found</td>\n  </tr>\n</table>\n<table *ngIf=\"variable.selectedData.data.length && !dataSource.isString(variable.selectedData.data) && variable.popupSubTitle === 'detail'\">\n  <ng-container *ngIf=\"variable.selectedData.data.length\">\n    <tr>\n      <th *ngFor=\"let head of variable.selectedData.header\">{{head}}</th>\n    </tr>\n    <tr *ngFor=\"let data of variable.selectedData.data\">\n      <td *ngFor=\"let head of variable.selectedData.header; let i = index\">{{data[head] ? data[head] : data[i]}}</td>\n    </tr>\n  </ng-container>\n  <tr *ngIf=\"!variable.selectedData.data.length\">\n    <td>No Data Found</td>\n  </tr>\n</table>\n");

/***/ }),

/***/ "V2Eu":
/*!*******************************************************************!*\
  !*** ./src/app/component/output-popup/output-popup.component.css ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJvdXRwdXQtcG9wdXAuY29tcG9uZW50LmNzcyJ9 */");

/***/ }),

/***/ "VENg":
/*!**********************************************************!*\
  !*** ./src/app/component/sidemenu/sidemenu.component.ts ***!
  \**********************************************************/
/*! exports provided: SidemenuComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SidemenuComponent", function() { return SidemenuComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _raw_loader_sidemenu_component_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! raw-loader!./sidemenu.component.html */ "yDZ9");
/* harmony import */ var _sidemenu_component_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sidemenu.component.css */ "spTY");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _service_variable_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../service/variable.service */ "ZA/X");
/* harmony import */ var _service_default_drag_drop_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../service/default-drag-drop.service */ "TONh");






let SidemenuComponent = class SidemenuComponent {
    constructor(variable, dragDropService) {
        this.variable = variable;
        this.dragDropService = dragDropService;
    }
    ngOnInit() {
    }
};
SidemenuComponent.ctorParameters = () => [
    { type: _service_variable_service__WEBPACK_IMPORTED_MODULE_4__["VariableService"] },
    { type: _service_default_drag_drop_service__WEBPACK_IMPORTED_MODULE_5__["DefaultDragDropService"] }
];
SidemenuComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
        selector: 'app-sidemenu',
        template: _raw_loader_sidemenu_component_html__WEBPACK_IMPORTED_MODULE_1__["default"],
        styles: [_sidemenu_component_css__WEBPACK_IMPORTED_MODULE_2__["default"]]
    })
], SidemenuComponent);



/***/ }),

/***/ "VJhT":
/*!*************************************************************!*\
  !*** ./src/app/component/file-info/file-info.component.css ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJmaWxlLWluZm8uY29tcG9uZW50LmNzcyJ9 */");

/***/ }),

/***/ "VhRb":
/*!**************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/component/transformation-popup/transformation-popup.component.html ***!
  \**************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"mt1\"><strong>Please Select Columns to Encode:</strong></div>\n<!--p>{{dataSource.getDataHeader(variable.outputTable.data.length ? variable.outputTable.data[0] : variable.listOfDraggedFiles.data[0].data[0])}}</p-->\n<table>\n    <tr *ngFor=\"let info of dataSource.getDataHeader(variable.outputTable.data.length ? variable.outputTable.data[0] : variable.listOfDraggedFiles.data[0].data[0])\">\n        <td><input class=\"w100\" type=\"checkbox\" [value]=\"info\" (change)=\"onCheckboxChange($event)\" [title]=\"info\"/></td>\n        <td>{{info}}</td>\n    </tr>\n</table>\n<button (click)=\"dataSource.saveAction(selectedCheckboxes)\" class=\"mt1\">Save</button>\n");

/***/ }),

/***/ "VzVu":
/*!**************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"wrapper\">\n\t<div class=\"col\">\n    <app-sidemenu></app-sidemenu>\n\t</div>\n\t<div class=\"col-right\">\n\t\t<div class=\"menu\">\n\t\t\t<ul class=\"floatLeft\">\n\t\t\t\t<li class=\"selected\"><h1 class=\"m1\">DATA SOURCE</h1></li>\n\t\t\t</ul>\n      <button class=\"floatRight m1\" (click)=\"crud.getData('/getData')\">Refresh</button>\n      <button class=\"floatRight m1\" (click)=\"variable.editor.clearModuleSelected()\">Clear</button>\n      <button class=\"floatRight m1\" [disabled]=\"!variable.listOfDraggedFiles.data.length || !variable.listOfDraggedFiles.action\" (click)=\"dataSourceService.openPopup('OUTPUT', 'output')\"><i class=\"fas fa-play\"></i> Run</button>\n\t\t</div>\n\t\t<div id=\"drawflow\" (drop)=\"dragDropService.drop($event)\" (dragover)=\"dragDropService.allowDrop($event)\">\n\t\t\t<div class=\"bar-zoom\">\n\t\t\t\t<i class=\"fas fa-search-minus\" (click)=\"variable.editorzoom_out()\"></i>\n\t\t\t\t<i class=\"fas fa-search\" (click)=\"variable.editorzoom_reset()\"></i>\n\t\t\t\t<i class=\"fas fa-search-plus\" (click)=\"variable.editorzoom_in()\"></i>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n<div class=\"popupWrapper\" [class.active]=\"variable.popupAction === 'output'\" *ngIf=\"variable.popupFlag\">\n  <div class=\"popupContainer\">\n    <table class=\"w100 noBorder m0\">\n      <tr>\n        <td class=\"p0\"><h2 class=\"m0\">{{variable.popupTitle | uppercase}}</h2></td>\n        <td class=\"text-right p0\"><span class=\"closeIcon\" (click)=\"variable.popupFlag = false\"></span></td>\n      </tr>\n    </table>\n    <app-input-popup *ngIf=\"variable.popupAction === 'input'\"></app-input-popup>\n    <app-action-popup *ngIf=\"variable.popupAction === 'action'\"></app-action-popup>\n    <app-analysis-popup *ngIf=\"variable.popupAction === 'analysis'\"></app-analysis-popup>\n    <app-transformation-popup *ngIf=\"variable.popupAction === 'transformation'\"></app-transformation-popup>\n    <app-output-popup *ngIf=\"variable.popupAction === 'output'\"></app-output-popup>\n    <app-file-data *ngIf=\"variable.popupAction === 'file-data'\"></app-file-data>\n    <app-file-info *ngIf=\"variable.popupAction === 'file-info'\"></app-file-info>\n    <app-file-head *ngIf=\"variable.popupAction === 'file-head'\"></app-file-head>\n    <app-detail *ngIf=\"variable.popupAction === 'detail'\"></app-detail>\n  </div>\n</div>\n");

/***/ }),

/***/ "ZA/X":
/*!*********************************************!*\
  !*** ./src/app/service/variable.service.ts ***!
  \*********************************************/
/*! exports provided: VariableService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VariableService", function() { return VariableService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");


let VariableService = class VariableService {
    constructor() {
        this.id = null;
        this.editor = null;
        this.transform = "";
        this.mobile_item_selec = "";
        this.mobile_last_move = null;
        this.popupFlag = false;
        this.popupTitle = null;
        this.popupSubTitle = null;
        this.popupAction = null;
        this.selectedData = null;
        this.listOfDraggedFiles = {
            data: [],
            action: null,
            actionCommonColumns: []
        };
        this.selectedNode = null;
        this.uploadedDataList = null;
        this.uploadedDataListBckUp = null;
        this.actionCommonColumns = [];
        this.outputTable = {
            data: [],
            header: []
        };
        /*Header Section*/
        this.columnSeparatorArray = [{ columnHeader: '', charRange: '' }];
        this.headersQuestion = {
            q1: 'Yes',
            q2: ''
        };
        this.accuracy = null;
        this.encodeString = null;
        this.Correlation_matrix_encodedString = null;
        this.High_Correaltion_graph_encodedString = null;
        this.Low_Correaltion_graph_encodedString = null;
        this.Medium_Correaltion_graph_encodedString = null;
        this.separatorList = [' ', ',', ';', "'", '"', '!', '@', '~', '#', '$'];
        this.selectedRecordForDetail = null;
        this.stateWiseData = {
            'merge': [],
            'sort': [],
            'projection': [],
            'decision_tree': [],
            'regression': [],
            'correlation': [],
            'uppercase': [],
            'lowercase': [],
            'encode': []
        };
    }
};
VariableService.ctorParameters = () => [];
VariableService = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    })
], VariableService);



/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "cUpR");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "s7LF");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "IheW");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _hello_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./hello.component */ "1VHI");
/* harmony import */ var _teste_teste_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./teste/teste.component */ "179K");
/* harmony import */ var _interceptor_api_interceptor__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./interceptor/api.interceptor */ "oypX");
/* harmony import */ var _component_sidemenu_sidemenu_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./component/sidemenu/sidemenu.component */ "VENg");
/* harmony import */ var _component_input_popup_input_popup_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./component/input-popup/input-popup.component */ "g/J9");
/* harmony import */ var _component_action_popup_action_popup_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./component/action-popup/action-popup.component */ "mRi9");
/* harmony import */ var _component_analysis_popup_analysis_popup_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./component/analysis-popup/analysis-popup.component */ "dAk3");
/* harmony import */ var _component_transformation_popup_transformation_popup_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./component/transformation-popup/transformation-popup.component */ "GeIU");
/* harmony import */ var _component_output_popup_output_popup_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./component/output-popup/output-popup.component */ "jOw8");
/* harmony import */ var _component_file_info_file_info_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./component/file-info/file-info.component */ "OLKl");
/* harmony import */ var _component_file_head_file_head_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./component/file-head/file-head.component */ "EXnY");
/* harmony import */ var _component_file_data_file_data_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./component/file-data/file-data.component */ "uxJT");
/* harmony import */ var _component_detail_detail_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./component/detail/detail.component */ "1Eu6");









// var styleDrawflow = require("drawflow/dist/drawflow.min.css");










let AppModule = class AppModule {
};
AppModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["BrowserModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"]],
        declarations: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"], _hello_component__WEBPACK_IMPORTED_MODULE_6__["HelloComponent"], _teste_teste_component__WEBPACK_IMPORTED_MODULE_7__["TesteComponent"], _component_sidemenu_sidemenu_component__WEBPACK_IMPORTED_MODULE_9__["SidemenuComponent"], _component_input_popup_input_popup_component__WEBPACK_IMPORTED_MODULE_10__["InputPopupComponent"], _component_action_popup_action_popup_component__WEBPACK_IMPORTED_MODULE_11__["ActionPopupComponent"], _component_analysis_popup_analysis_popup_component__WEBPACK_IMPORTED_MODULE_12__["AnalysisPopupComponent"], _component_transformation_popup_transformation_popup_component__WEBPACK_IMPORTED_MODULE_13__["TransformationPopupComponent"], _component_output_popup_output_popup_component__WEBPACK_IMPORTED_MODULE_14__["OutputPopupComponent"], _component_file_info_file_info_component__WEBPACK_IMPORTED_MODULE_15__["FileInfoComponent"], _component_file_head_file_head_component__WEBPACK_IMPORTED_MODULE_16__["FileHeadComponent"], _component_file_data_file_data_component__WEBPACK_IMPORTED_MODULE_17__["FileDataComponent"], _component_detail_detail_component__WEBPACK_IMPORTED_MODULE_18__["DetailComponent"]],
        bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]],
        entryComponents: [_teste_teste_component__WEBPACK_IMPORTED_MODULE_7__["TesteComponent"]],
        providers: [
            { provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HTTP_INTERCEPTORS"], useClass: _interceptor_api_interceptor__WEBPACK_IMPORTED_MODULE_8__["ApiInterceptor"], multi: true }
        ]
    })
], AppModule);



/***/ }),

/***/ "apmx":
/*!**************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/component/analysis-popup/analysis-popup.component.html ***!
  \**************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<button (click)=\"dataSource.saveAction()\" class=\"mt1\">Proceed</button>\n");

/***/ }),

/***/ "bH5L":
/*!****************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/component/file-info/file-info.component.html ***!
  \****************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<span class=\"cursorPointer\" *ngIf=\"(variable.popupSubTitle === 'spreadsheet' || variable.popupSubTitle === 'database' || variable.popupSubTitle === 'text')\" (click)=\"dataSource.backToList()\"><- Back</span><br/>\n<span class=\"cursorPointer\" *ngIf=\"variable.popupSubTitle === 'merge'\" (click)=\"dataSource.backToAction()\"><- Back</span>\n<span class=\"cursorPointer\" *ngIf=\"variable.popupSubTitle === 'detail'\" (click)=\"dataSource.backToDetail()\"><- Back</span>\n<br/>\n<ng-container *ngIf=\"variable.selectedData.information\">\n  <textarea class=\"w100 mb2\" disabled>{{variable.selectedData.information}}</textarea>\n</ng-container>\n<ng-container *ngIf=\"!variable.selectedData.information\">\n  <strong>Add Information</strong>\n  <textarea class=\"w100 mb2\" [(ngModel)]=\"information\"></textarea>\n  <button class=\"btn-clear reset-button\" (click)=\"crud.updateInformation(information)\">Submit</button>\n</ng-container>\n");

/***/ }),

/***/ "crnd":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "crnd";

/***/ }),

/***/ "dAk3":
/*!**********************************************************************!*\
  !*** ./src/app/component/analysis-popup/analysis-popup.component.ts ***!
  \**********************************************************************/
/*! exports provided: AnalysisPopupComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnalysisPopupComponent", function() { return AnalysisPopupComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _raw_loader_analysis_popup_component_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! raw-loader!./analysis-popup.component.html */ "apmx");
/* harmony import */ var _analysis_popup_component_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./analysis-popup.component.css */ "7+2v");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _service_variable_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../service/variable.service */ "ZA/X");
/* harmony import */ var _service_data_source_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../service/data-source.service */ "Ad12");
/* harmony import */ var _service_crud_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../service/crud.service */ "+JMX");







let AnalysisPopupComponent = class AnalysisPopupComponent {
    constructor(variable, dataSource, crud) {
        this.variable = variable;
        this.dataSource = dataSource;
        this.crud = crud;
    }
    ngOnInit() {
    }
};
AnalysisPopupComponent.ctorParameters = () => [
    { type: _service_variable_service__WEBPACK_IMPORTED_MODULE_4__["VariableService"] },
    { type: _service_data_source_service__WEBPACK_IMPORTED_MODULE_5__["DataSourceService"] },
    { type: _service_crud_service__WEBPACK_IMPORTED_MODULE_6__["CrudService"] }
];
AnalysisPopupComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
        selector: 'app-analysis-popup',
        template: _raw_loader_analysis_popup_component_html__WEBPACK_IMPORTED_MODULE_1__["default"],
        styles: [_analysis_popup_component_css__WEBPACK_IMPORTED_MODULE_2__["default"]]
    })
], AnalysisPopupComponent);



/***/ }),

/***/ "e2BO":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/component/action-popup/action-popup.component.html ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!--pre>{{variable.uploadedDataList | json}}</pre-->\n<ng-container *ngIf=\"variable.popupSubTitle === 'merge' && variable.listOfDraggedFiles.data.length\">\n  <table>\n    <tr>\n      <td>DATASET</td>\n      <td>COMMON FIELD</td>\n      <td>More Details</td>\n    </tr>\n    <ng-container *ngFor=\"let data of variable.listOfDraggedFiles.data; let i = index\">\n      <tr>\n        <td>{{data.fileDetail.filename}}</td>\n        <td>\n          <select [(ngModel)]=\"variable.actionCommonColumns[i]\" style=\"padding: 5px 10px; margin-left: 10px; min-width: 200px;\">\n            <ng-container *ngFor=\"let head of data.header\">\n              <option [value]=\"head.columnHeader\">{{head.columnHeader}}</option>\n            </ng-container>\n          </select>\n        </td>\n        <td>\n          <span class=\"pointer\" (click)=\"dataSource.showInfo(data)\">Information</span> | \n          <span class=\"pointer\" (click)=\"dataSource.showHead(data)\">Header</span> | \n          <span class=\"pointer\" (click)=\"dataSource.showData(data)\">Data</span>\n        </td>\n      </tr>\n    </ng-container>\n  </table>\n  <button (click)=\"dataSource.saveAction()\" class=\"mt1\">Save</button>\n</ng-container>\n<ng-container *ngIf=\"variable.popupSubTitle === 'merge' && !variable.listOfDraggedFiles.data.length\">\n  <h2>No file is selected.</h2>\n</ng-container>\n<ng-container *ngIf=\"(variable.popupSubTitle === 'sort' || variable.popupSubTitle === 'projection') && (variable.listOfDraggedFiles.data.length || variable.outputTable.data.length)\">\n  <div class=\"mt1\"><strong>Please Select Columns:</strong></div>\n  <table>\n    <tr *ngFor=\"let info of dataSource.getDataHeader(variable.outputTable.data.length ? variable.outputTable.data[0] : variable.listOfDraggedFiles.data[0].data[0])\">\n      <td><input class=\"w100\" type=\"checkbox\" [value]=\"info\" (change)=\"onCheckboxChange($event)\" [title]=\"info\"/></td>\n      <td>{{info}}</td>\n    </tr>\n  </table>\n  <button (click)=\"dataSource.saveAction(selectedCheckboxes)\" class=\"mt1\">Save</button>\n</ng-container>\n");

/***/ }),

/***/ "g/J9":
/*!****************************************************************!*\
  !*** ./src/app/component/input-popup/input-popup.component.ts ***!
  \****************************************************************/
/*! exports provided: InputPopupComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InputPopupComponent", function() { return InputPopupComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _raw_loader_input_popup_component_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! raw-loader!./input-popup.component.html */ "inKm");
/* harmony import */ var _input_popup_component_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./input-popup.component.css */ "8PFa");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _service_variable_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../service/variable.service */ "ZA/X");
/* harmony import */ var _service_crud_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../service/crud.service */ "+JMX");
/* harmony import */ var _service_data_source_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../service/data-source.service */ "Ad12");







let InputPopupComponent = class InputPopupComponent {
    constructor(variable, crud, dataSource) {
        this.variable = variable;
        this.crud = crud;
        this.dataSource = dataSource;
    }
    ngOnInit() {
        // this.crud.getData('./'+this.variable.popupSubTitle);
        this.crud.getData('/getData');
    }
};
InputPopupComponent.ctorParameters = () => [
    { type: _service_variable_service__WEBPACK_IMPORTED_MODULE_4__["VariableService"] },
    { type: _service_crud_service__WEBPACK_IMPORTED_MODULE_5__["CrudService"] },
    { type: _service_data_source_service__WEBPACK_IMPORTED_MODULE_6__["DataSourceService"] }
];
InputPopupComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
        selector: 'app-input-popup',
        template: _raw_loader_input_popup_component_html__WEBPACK_IMPORTED_MODULE_1__["default"],
        styles: [_input_popup_component_css__WEBPACK_IMPORTED_MODULE_2__["default"]]
    })
], InputPopupComponent);



/***/ }),

/***/ "hN/g":
/*!**************************!*\
  !*** ./src/polyfills.ts ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var zone_js_dist_zone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! zone.js/dist/zone */ "pDpN");
/* harmony import */ var zone_js_dist_zone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(zone_js_dist_zone__WEBPACK_IMPORTED_MODULE_0__);
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/docs/ts/latest/guide/browser-support.html
 */
/***************************************************************************************************
 * BROWSER POLYFILLS
 */
/** IE9, IE10 and IE11 requires all of the following polyfills. **/
// import 'core-js/es6/symbol';
// import 'core-js/es6/object';
// import 'core-js/es6/function';
// import 'core-js/es6/parse-int';
// import 'core-js/es6/parse-float';
// import 'core-js/es6/number';
// import 'core-js/es6/math';
// import 'core-js/es6/string';
// import 'core-js/es6/date';
// import 'core-js/es6/array';
// import 'core-js/es6/regexp';
// import 'core-js/es6/map';
// import 'core-js/es6/set';
/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run `npm install --save classlist.js`.
/** IE10 and IE11 requires the following to support `@angular/animation`. */
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.
/** Evergreen browsers require these. **/
// import 'core-js/es6/reflect';
// import 'core-js/es7/reflect';
/**
 * Web Animations `@angular/platform-browser/animations`
 * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 */
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.
/***************************************************************************************************
 * Zone JS is required by Angular itself.
 */
 // Included with Angular CLI.
/***************************************************************************************************
 * APPLICATION IMPORTS
 */
/**
 * Date, currency, decimal and percent pipes.
 * Needed for: All but Chrome, Firefox, Edge, IE11 and Safari 10
 */
// import 'intl';  // Run `npm install --save intl`.


/***/ }),

/***/ "inKm":
/*!********************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/component/input-popup/input-popup.component.html ***!
  \********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<table class=\"w100 noBorder\">\n  <tr>\n    <td class=\"border-strip\" width=\"40%\">\n      <strong>Upload File From Local Device</strong>\n      <div class=\"fileUploadContainer mt1 mb1\">\n        <input id=\"my-file-selector\" type=\"file\" (change)=\"crud.uploadData($event)\" name=\"uploadExcel\" />\n        <div class=\"customFileUpload\">\n          <svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" width=\"48\"><path d=\"M22.6 37.9h3V27.85l4.1 4.1 2.1-2.1-7.8-7.6-7.7 7.7 2.1 2.1 4.2-4.2ZM11 44q-1.2 0-2.1-.9Q8 42.2 8 41V7q0-1.2.9-2.1Q9.8 4 11 4h18.05L40 14.95V41q0 1.2-.9 2.1-.9.9-2.1.9Zm16.55-27.7V7H11v34h26V16.3ZM11 7v9.3V7v34V7Z\"/></svg>\n          <span>Upload File</span>\n        </div>\n      </div>\n    </td>\n    <td class=\"text-center\">OR</td>\n    <td class=\"border-strip\">\n      <strong>Upload File From URL</strong>\n      <div class=\"mt1 mb1\">\n        <table class=\"w100\">\n          <tr>\n            <td width=\"70%\">\n              <input id=\"my-file-selector\" type=\"text\" name=\"uploadExcelURL\" placeholder=\"http://www.domain_path/filename.extension\" />\n            </td>\n            <td>\n              <button>Upload File</button>\n            </td>\n          </tr>\n        </table>\n      </div>\n    </td>\n  </tr>\n</table>\n<hr class=\"mt2 mb2\"/>\n<h2 class=\"text-center mb1 mt2\">PREVIOUSLY UPLOADED {{variable.popupSubTitle | uppercase}} FILES</h2>\n<div class=\"border-strip uploaded-file-list\" *ngFor=\"let resp of variable.uploadedDataList\">\n  <div class=\"card summary flex justify-content-between\" style=\"height: auto; position: relative;\">\n    <span style=\"position: absolute; right: 10px; cursor: pointer;\" (click)=\"crud.deleteRecord(resp)\"><i title=\"Delete\" class=\"fas fa-trash\"></i></span>\n    <div class=\"flex\" style=\"flex-direction: column;\">\n      <div class=\"title\" title=\"{{resp?.fileDetail?.filename}}\">{{resp?.fileDetail?.filename}}</div>\n      <span class=\"detail\">Number of records: {{resp?.data.length}}</span>\n      <div class=\"flex align-items-center uploadedFileDetails\">\n        <button title=\"Information\" (click)=\"dataSource.showInfo(resp)\" type=\"button\" label=\"Information\" style=\"margin: 10px 10px 0 0\"><i title=\"Information\" class=\"fas fa-info-circle\"></i></button>\n        <button title=\"Heading\" (click)=\"dataSource.showHead(resp)\" type=\"button\" label=\"Headers\" style=\"margin: 10px 10px 0 0\"><i title=\"Heading\" class=\"fas fa-heading\"></i></button>\n        <button title=\"View Details\" (click)=\"dataSource.showData(resp)\" type=\"button\" label=\"View Details\" style=\"margin: 10px 10px 0 0\"><i title=\"View Details\" class=\"fas fa-eye\"></i></button>\n        <button (click)=\"dataSource.selectFile(resp)\" type=\"button\" label=\"Select File\" style=\"margin: 10px 10px 0 0\"><i title=\"Select\" class=\"fas fa-check\"></i></button>\n        <button type=\"button\" title=\"Refresh\" style=\"margin: 10px 10px 0 0\">\n          <svg style=\"height: 14px; fill: #F7882F;\" title=\"Refresh\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d=\"M464 16c-17.67 0-32 14.31-32 32v74.09C392.1 66.52 327.4 32 256 32C161.5 32 78.59 92.34 49.58 182.2c-5.438 16.81 3.797 34.88 20.61 40.28c16.89 5.5 34.88-3.812 40.3-20.59C130.9 138.5 189.4 96 256 96c50.5 0 96.26 24.55 124.4 64H336c-17.67 0-32 14.31-32 32s14.33 32 32 32h128c17.67 0 32-14.31 32-32V48C496 30.31 481.7 16 464 16zM441.8 289.6c-16.92-5.438-34.88 3.812-40.3 20.59C381.1 373.5 322.6 416 256 416c-50.5 0-96.25-24.55-124.4-64H176c17.67 0 32-14.31 32-32s-14.33-32-32-32h-128c-17.67 0-32 14.31-32 32v144c0 17.69 14.33 32 32 32s32-14.31 32-32v-74.09C119.9 445.5 184.6 480 255.1 480c94.45 0 177.4-60.34 206.4-150.2C467.9 313 458.6 294.1 441.8 289.6z\"/></svg>\n        </button>\n      </div>\n    </div>\n  </div>\n</div>\n<div class=\"border-strip p2 text-center\" *ngIf=\"!variable.uploadedDataList.length\">\n  No Record Found\n</div>\n<div class=\"clearFloat\"></div>");

/***/ }),

/***/ "jOw8":
/*!******************************************************************!*\
  !*** ./src/app/component/output-popup/output-popup.component.ts ***!
  \******************************************************************/
/*! exports provided: OutputPopupComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OutputPopupComponent", function() { return OutputPopupComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _raw_loader_output_popup_component_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! raw-loader!./output-popup.component.html */ "sjBc");
/* harmony import */ var _output_popup_component_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./output-popup.component.css */ "V2Eu");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _service_variable_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../service/variable.service */ "ZA/X");
/* harmony import */ var _service_data_source_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../service/data-source.service */ "Ad12");
/* harmony import */ var _service_crud_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../service/crud.service */ "+JMX");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/platform-browser */ "cUpR");








let OutputPopupComponent = class OutputPopupComponent {
    constructor(variable, dataSource, crud, sanitizer) {
        this.variable = variable;
        this.dataSource = dataSource;
        this.crud = crud;
        this.sanitizer = sanitizer;
        this.viewData = true;
        // this.variable.encodeString = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBYRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAACgKADAAQAAAABAAAB4AAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgB4AKAAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMABgYGBgYGCgYGCg4KCgoOEg4ODg4SFxISEhISFxwXFxcXFxccHBwcHBwcHCIiIiIiIicnJycnLCwsLCwsLCwsLP/bAEMBBwcHCwoLEwoKEy4fGh8uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLv/dAAQAKP/aAAwDAQACEQMRAD8A+qaKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/9D6pooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//0fqmiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA4ZvHCNqF9YWWkajef2fN5E0sCwlA+1XwA0yueGH8NdBoev6Z4is2vdMcsqO0UiOpSSKRPvI6MAVYdwf5VxvhC7tbXWPFbXMyRAapkl2C8fZ4uea8/1G/vpNN8beJ/DbMLK7urOKKeNigZIgkV1KjgHC4JHmKD0LDpQB9F0V4j4f0i4s/Eml3uj2mm6XbsJFuFtdQa4N3GYyV+QxJvZWAbfknGe1SeBNO8MatpcWu+I/Km14XT/AGqSeTE0NwspCxgEgoFwAqjAIxwc0AewQXDzTTxNBJEIWCq77dsgKg5TDE4GcHcAcjpjmppnMUTyqjSFVJCLjc2B0GSBk9skCvHJ7JtSfxxYJepp7T3lqgnkbYoJgg+ViCpAk+4cHOG45qrpz6bpy654fTSrOwvRpMtw0unzGWCSPBX5gVQq+TkBgSRnmgD2u3laeCOZ42hZ1DGN8bkJGdrbSRkdDgkehqavB7eKx1Gbwdo/iQj+yZNEWSOKRtsM12qRAK4yA22MkqDWLrIiXwj4x0rSJWbSLa9s47NlYusbs8JmSNiT8qOeAOASRQB9JVkavqlxpiRvb6ddagXJBW18rKY7t5skYwfbNcFJouneGfHWgrokZtxqEd5HdYZj53lxq6NJknc4b+I88nmvVKAOF0Lxx/wkDr9j0XUkh854HmkFuI0eNir7sTlsKQQcKfau6r5yuIBc/D9rYsyeb4mKbkJVl3X5GVI5BHY1seLdItdJ13SNBsNPtv7KuluJ3t5rhrWC4uwEUea4STewQZCsPm5POKAPdaK+er2LxDoHhPxH/Z/2e0ti9q0NtZ3jT/ZI3YLckP5amJWX5hhTt+YgcVr+H9Iu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J6AUAUND1bSdasftujNug8yRD+7aIiRWIkBV1Vgd2c5HWtevMvhtrmjajb6la2F5DPL/AGnfz7I3DN5Uly5R8D+FgQQe+a9NoAKKKKACiiigAooooAKKKKACuX07xX4a1K/S2s5j9ouFIjLwyRCZY8tiN3RVkCgk/KTgZNdRXkeneK/D/jXxNaTRajapbadM5srfzU+0XVxsaMybM7ljVWYIMZbO44AGQD1yiiigAooooAKKKKACiiigAooooA5nVvFHh7S5jaas7p5e13dreV4U5BVnlCGNcHByWGOtdKCGAZTkHkEV5Z8RdV0yewvNIXWvst0kDq2nqqs13vUFYyu3ziHB25iZTyec9PSNPLmwtzJF5DGJN0XXyztGV/4D0oAuUUUUAFFFFABRRRQAUUUUAFIxVVLMQABkk9MUtcn4wsdb1LT4rHSIoZo5JR9rjlmaDzIACTGHVJMBjgN8vK5HGcgA09B1nRtcsPtWgyrLaxuYQVRkUFOCFDAcDsRwR0rZrzX4bSak0WspfWsNsq6pc7RFKZPnLfOuDGmFXjB/iz0GOfSqACiiigAooooAKKKKACiiigCKeeK2gkuZztjiUuxwThVGScDnpWDoniPRdccnSVn/AHqCfzJLS4gR1IUBhJLGisSMYwSSPYVral9l/s65+3Nst/JfzWGeE2nceMngV5l4audNg8R2WmeDtRm1HTBaSC6RpmuYYPL2CHbIxOxj8w2BsYGdoxQB61RRRQAUUUUAFFFFABRRRQAUUUUAf//T+qaKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiivKfFOs+INQsfEtvpSWwstLt5IJhMHMsztbiV9jBgqBVcYyrbjnoOaAPVqK8VvvHN34d0mF7Wa3nSxsreSa1W2uJZdvlKxDTx5jhJXld64xgkgGujsbjxFcfEDUooL2H+z47Wxl8iSKRjskM2dh80KjkqdzbDkbRj5ckA9Horyux8d3Mmv2Vg81ve2l/PJbo9vbXMaxsqO6kTyZhmB2EHbg9wCAa9UoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//U+qaKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACuM1jwPp+sT3spu7u1TUoxHdxW8irHNhdgZtyMQ23AO0jIADZFdnRQB57efDfSru1urAXt9Ba30SR3EMUiKkjJGsSyHMZYNtVcgEKccqRkVvt4bgGsJrVtdXFvL5UcEyRmMxzxxFigkDox43typU89a6OigDg7L4fabZS6ey3t7JFpUvm2cDyIY4hsZNgAQFlw3BYlhgAMBkHvKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Z';
    }
    ngOnInit() {
    }
    getImgUrl(param) {
        return this.sanitizer.bypassSecurityTrustUrl(param);
    }
};
OutputPopupComponent.ctorParameters = () => [
    { type: _service_variable_service__WEBPACK_IMPORTED_MODULE_4__["VariableService"] },
    { type: _service_data_source_service__WEBPACK_IMPORTED_MODULE_5__["DataSourceService"] },
    { type: _service_crud_service__WEBPACK_IMPORTED_MODULE_6__["CrudService"] },
    { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["DomSanitizer"] }
];
OutputPopupComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
        selector: 'app-output-popup',
        template: _raw_loader_output_popup_component_html__WEBPACK_IMPORTED_MODULE_1__["default"],
        styles: [_output_popup_component_css__WEBPACK_IMPORTED_MODULE_2__["default"]]
    })
], OutputPopupComponent);



/***/ }),

/***/ "mRi9":
/*!******************************************************************!*\
  !*** ./src/app/component/action-popup/action-popup.component.ts ***!
  \******************************************************************/
/*! exports provided: ActionPopupComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionPopupComponent", function() { return ActionPopupComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _raw_loader_action_popup_component_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! raw-loader!./action-popup.component.html */ "e2BO");
/* harmony import */ var _action_popup_component_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./action-popup.component.css */ "QvDl");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _service_variable_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../service/variable.service */ "ZA/X");
/* harmony import */ var _service_data_source_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../service/data-source.service */ "Ad12");
/* harmony import */ var _service_crud_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../service/crud.service */ "+JMX");







let ActionPopupComponent = class ActionPopupComponent {
    constructor(variable, dataSource, crud) {
        this.variable = variable;
        this.dataSource = dataSource;
        this.crud = crud;
        this.sortColumnNames = '';
        this.selectedCheckboxes = [];
    }
    ngOnInit() {
    }
    onCheckboxChange(e) {
        if (e.target.checked) {
            this.selectedCheckboxes.push(e.target.value);
        }
        else {
            this.selectedCheckboxes.splice(this.selectedCheckboxes.indexOf(e.target.value), 1);
        }
    }
};
ActionPopupComponent.ctorParameters = () => [
    { type: _service_variable_service__WEBPACK_IMPORTED_MODULE_4__["VariableService"] },
    { type: _service_data_source_service__WEBPACK_IMPORTED_MODULE_5__["DataSourceService"] },
    { type: _service_crud_service__WEBPACK_IMPORTED_MODULE_6__["CrudService"] }
];
ActionPopupComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
        selector: 'app-action-popup',
        template: _raw_loader_action_popup_component_html__WEBPACK_IMPORTED_MODULE_1__["default"],
        styles: [_action_popup_component_css__WEBPACK_IMPORTED_MODULE_2__["default"]]
    })
], ActionPopupComponent);



/***/ }),

/***/ "oypX":
/*!************************************************!*\
  !*** ./src/app/interceptor/api.interceptor.ts ***!
  \************************************************/
/*! exports provided: ApiInterceptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiInterceptor", function() { return ApiInterceptor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "IheW");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "qCKp");




let ApiInterceptor = class ApiInterceptor {
    constructor() {
        this.mockData = [];
    }
    intercept(request, next) {
        if (request.method === 'POST' && request.url === '/login') {
            const reqData = request.body;
            let responseData = {};
            if (reqData.username === 'admin' && reqData.password === 'admin') {
                responseData = {
                    name: 'admin'
                };
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]({ status: 200, body: responseData }));
            }
            else if (reqData.username === 'guest' && reqData.password === 'guest') {
                responseData = {
                    name: 'guest'
                };
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]({ status: 200, body: responseData }));
            }
            else {
                responseData = {
                    err: 'Wrong User credentals'
                };
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]({ status: 200, body: responseData }));
            }
        }
        else if (request.method === 'GET' && request.url === '/getData') {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]({ status: 200, body: JSON.parse(localStorage.getItem('mockData')) }));
        }
        else if (request.method === 'POST' && request.url === '/action') {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]({ status: 200, body: 'Hello' }));
        }
        else if (request.method === 'POST' && request.url === '/getData') {
            this.mockData = JSON.parse(localStorage.getItem('mockData'));
            if (!this.mockData) {
                this.mockData = [];
            }
            const dataResp = request.body;
            dataResp.id = this.createId();
            this.mockData.push(dataResp);
            localStorage.setItem('mockData', JSON.stringify(this.mockData));
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]({ status: 200, body: this.mockData }));
        }
        else if (request.method === 'PUT' && request.url === '/getData') {
            this.mockData = JSON.parse(localStorage.getItem('mockData'));
            if (!this.mockData) {
                this.mockData = [];
            }
            for (let i = 0; i < this.mockData.length; i++) {
                if (this.mockData[i].id === request.body.id) {
                    this.mockData[i] = request.body;
                }
            }
            console.log(this.mockData);
            localStorage.setItem('mockData', JSON.stringify(this.mockData));
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]({ status: 200, body: this.mockData }));
        }
        else if (request.method === 'DELETE' && request.url.includes('/getData')) {
            this.mockData = JSON.parse(localStorage.getItem('mockData'));
            if (!this.mockData) {
                this.mockData = [];
            }
            const urlFragments = request.url.split('/');
            const deleteId = urlFragments[urlFragments.length - 1];
            if (this.mockData.length) {
                this.mockData = this.mockData.filter(mock => mock.id !== deleteId);
            }
            localStorage.setItem('mockData', JSON.stringify(this.mockData));
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]({ status: 200, body: this.mockData }));
        }
        return next.handle(request);
    }
    createId() {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
};
ApiInterceptor = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])()
], ApiInterceptor);



/***/ }),

/***/ "sjBc":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/component/output-popup/output-popup.component.html ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"w100\">\n  <!--button class=\"mr1 mb1\" [class.active]=\"viewData\" (click)=\"viewData = true\">Show Data</button>\n  <button class=\"mb1\" [class.active]=\"!viewData\" (click)=\"viewData = false\">Analysis Result</button-->\n  <div class=\"floatRight\">\n    <button class=\"mb1\" (click)=\"dataSource.exportTable()\">Download File</button>\n  </div>\n</div>\n<!--ng-container *ngIf=\"viewData\">\n  <!--====<pre>{{variable.listOfDraggedFiles | json}}</pre>====-- >\n  <!-- ====<pre>{{variable.outputTable | json}}</pre>==== -- >\n  <div class=\"w100\" style=\"overflow: auto;\">\n    <table class=\"w100\" id=\"outputTable\">\n      <tr>\n        <th *ngFor=\"let header of variable.outputTable.header\">\n          {{header}}\n        </th>\n      </tr>\n      <tr *ngFor=\"let data of variable.outputTable.data\">\n        <td *ngFor=\"let header of variable.outputTable.header\">{{data[header]}}</td>\n      </tr>\n    </table>\n  </div>\n</ng-container>\n<ng-container *ngIf=\"!viewData\"-->\n<ng-container *ngIf=\"variable.Correlation_matrix_encodedString\">\n  <div class=\"w100 encodedImages\">\n    <img  [src]=\"getImgUrl(variable.Medium_Correaltion_graph_encodedString)\">\n    <img  [src]=\"getImgUrl(variable.Low_Correaltion_graph_encodedString)\">\n    <img  [src]=\"getImgUrl(variable.High_Correaltion_graph_encodedString)\">\n    <img  [src]=\"getImgUrl(variable.Correlation_matrix_encodedString)\">\n\n  </div>\n</ng-container>\n<ng-container *ngIf=\"variable.accuracy\">\n  <div class=\"w100\">\n    Prediction Accuracy of Salary based on Decision Tree Model : {{variable.accuracy}}\n  </div>\n</ng-container>\n<!--/ng-container-->\n\n");

/***/ }),

/***/ "spTY":
/*!***********************************************************!*\
  !*** ./src/app/component/sidemenu/sidemenu.component.css ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzaWRlbWVudS5jb21wb25lbnQuY3NzIn0= */");

/***/ }),

/***/ "uxJT":
/*!************************************************************!*\
  !*** ./src/app/component/file-data/file-data.component.ts ***!
  \************************************************************/
/*! exports provided: FileDataComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileDataComponent", function() { return FileDataComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _raw_loader_file_data_component_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! raw-loader!./file-data.component.html */ "UpZD");
/* harmony import */ var _file_data_component_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./file-data.component.css */ "UlLe");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _service_variable_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../service/variable.service */ "ZA/X");
/* harmony import */ var _service_data_source_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../service/data-source.service */ "Ad12");






let FileDataComponent = class FileDataComponent {
    constructor(variable, dataSource) {
        this.variable = variable;
        this.dataSource = dataSource;
    }
    ngOnInit() {
    }
};
FileDataComponent.ctorParameters = () => [
    { type: _service_variable_service__WEBPACK_IMPORTED_MODULE_4__["VariableService"] },
    { type: _service_data_source_service__WEBPACK_IMPORTED_MODULE_5__["DataSourceService"] }
];
FileDataComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
        selector: 'app-file-data',
        template: _raw_loader_file_data_component_html__WEBPACK_IMPORTED_MODULE_1__["default"],
        styles: [_file_data_component_css__WEBPACK_IMPORTED_MODULE_2__["default"]]
    })
], FileDataComponent);



/***/ }),

/***/ "vgQ+":
/*!*******************************************!*\
  !*** ./src/app/teste/teste.component.css ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJ0ZXN0ZS5jb21wb25lbnQuY3NzIn0= */");

/***/ }),

/***/ "yDZ9":
/*!**************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/component/sidemenu/sidemenu.component.html ***!
  \**************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- to display all the items inside the pallette -->\n\n<fieldset class=\"mb1\">\n  <legend>INPUT</legend>\n  <div class=\"drag-drawflow\" draggable=\"true\" (dragstart)=\"dragDropService.drag($event)\" data-node=\"spreadsheet\">\n    <i class=\"fas fa-file-excel\"></i><span> SpreadSheet</span>\n  </div>\n  <div class=\"drag-drawflow\" draggable=\"true\" (dragstart)=\"dragDropService.drag($event)\" data-node=\"database\">\n    <i class=\"fas fa-server\"></i><span> Database</span>\n  </div>\n  <div class=\"drag-drawflow\" draggable=\"true\" (dragstart)=\"dragDropService.drag($event)\" data-node=\"text\">\n    <i class=\"fas fa-file-alt\"></i><span> Text File</span>\n  </div>\n</fieldset>\n<fieldset class=\"mb1\">\n  <legend>ACTION</legend>\n  <div class=\"drag-drawflow\" draggable=\"true\" (dragstart)=\"dragDropService.drag($event)\" data-node=\"merge\">\n    <i class=\"fas fa-network-wired\"></i><span> Merge</span>\n  </div>\n  <div class=\"drag-drawflow\" draggable=\"true\" (dragstart)=\"dragDropService.drag($event)\" data-node=\"sort\">\n    <i class=\"fas fa-sort\"></i><span> Sort</span>\n  </div>\n  <div class=\"drag-drawflow\" draggable=\"true\" (dragstart)=\"dragDropService.drag($event)\" data-node=\"projection\">\n    <i class=\"fas fa-sort\"></i><span> Projection</span>\n  </div>\n</fieldset>\n<fieldset class=\"mb1\">\n  <legend>ANALYSIS</legend>\n  <div class=\"drag-drawflow\" draggable=\"true\" (dragstart)=\"dragDropService.drag($event)\" data-node=\"decision_tree\">\n    <i class=\"fas fa-network-wired\"></i><span> Decision Tree</span>\n  </div>\n  <div class=\"drag-drawflow\" draggable=\"true\" (dragstart)=\"dragDropService.drag($event)\" data-node=\"regression\">\n    <i class=\"fas fa-sort\"></i><span> Regression</span>\n  </div>\n  <div class=\"drag-drawflow\" draggable=\"true\" (dragstart)=\"dragDropService.drag($event)\" data-node=\"correlation\">\n    <i class=\"fas fa-sort\"></i><span> Correlation</span>\n  </div>\n</fieldset>\n<fieldset class=\"mb1\">\n  <legend>TRANSFORMATION</legend>\n  <div class=\"drag-drawflow\" draggable=\"true\" (dragstart)=\"dragDropService.drag($event)\" data-node=\"uppercase\">\n    <span>Uppercase <strong>[TEXT]</strong></span>\n  </div>\n  <div class=\"drag-drawflow\" draggable=\"true\" (dragstart)=\"dragDropService.drag($event)\" data-node=\"lowercase\">\n    <span>Lowercase <strong>[text]</strong></span>\n  </div>\n  <div class=\"drag-drawflow\" draggable=\"true\" (dragstart)=\"dragDropService.drag($event)\" data-node=\"encode\">\n    <span>Encode <strong>[Text]</strong></span>\n  </div>\n</fieldset>\n<fieldset class=\"mb1\">\n  <legend>OUTPUT</legend>\n  <div class=\"drag-drawflow\" draggable=\"true\" (dragstart)=\"dragDropService.drag($event)\" data-node=\"spreadsheetOutput\">\n    <i class=\"fas fa-file-excel\"></i><span> SpreadSheet</span>\n  </div>\n  <div class=\"drag-drawflow\" draggable=\"true\" (dragstart)=\"dragDropService.drag($event)\" data-node=\"databaseOutput\">\n    <i class=\"fas fa-server\"></i><span> Database</span>\n  </div>\n  <div class=\"drag-drawflow\" draggable=\"true\" (dragstart)=\"dragDropService.drag($event)\" data-node=\"textOutput\">\n    <i class=\"fas fa-file-alt\"></i><span> Text File</span>\n  </div>\n</fieldset>\n");

/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./polyfills */ "hN/g");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "wAiw");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");



Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"]).then(ref => {
    // Ensure Angular destroys itself on hot reloads.
    if (window['ngRef']) {
        window['ngRef'].destroy();
    }
    window['ngRef'] = ref;
    // Otherwise, log the boot error
}).catch(err => console.error(err));


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main-es2015.js.map