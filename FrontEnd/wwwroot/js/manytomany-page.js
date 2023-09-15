"use strict"
var roleInstance;
$(document).ready(function () {
    var antiForgeryToken = document.getElementsByName("__RequestVerificationToken")[0].value;
    roleInstance = $('#roleGrid').dxDataGrid({
        dataSource: DevExpress.data.AspNet.createStore({
            key: 'roleId',
            loadUrl: `/Manytomany/Read`,
            insertUrl: `/Manytomany/Create`,
            updateUrl: `/Manytomany/Edit`,
            deleteUrl: `/Manytomany/Delete`,
            onBeforeSend(method, ajaxOptions) {
                let antiForgeryToken = document.getElementsByName("__RequestVerificationToken")[0].value;
                if (antiForgeryToken) {
                    ajaxOptions.headers = {
                        "RequestVerificationToken": antiForgeryToken
                    };
                };
            },
        }),
        rowAlternationEnabled: true,
        paging: {
            pageSize: 10,
        },
        pager: {
            visible: true,
            allowedPageSizes: [5, 10, 'all'],
            showPageSizeSelector: true,
            showInfo: true,
            showNavigationButtons: true,
        },
        columns: [
            {
                dataField: 'roleName',
                caption: 'Nama Role',
                validationRules: [{
                    type: 'required',
                    message: 'Nama role harus diisi.',
                }],
            },
        ],
        editing: {
            mode: 'popup',
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            popup: {
                title: 'Role Info',
                showTitle: true,
                width: 700,
                height: 525,
            },
            form: {
                items: [{
                    itemType: 'group',
                    colSpan: 2,
                    items: ['roleName'],
                }],
            },
        },
    }).dxDataGrid("instance");

    userInstance = $('#userGrid').dxDataGrid({
        dataSource: DevExpress.data.AspNet.createStore({
            key: 'id',
            loadUrl: `/Onetomany/Read`,
            insertUrl: `/Onetomany/Create`,
            updateUrl: `/Manytomany/EditUser`,
            deleteUrl: `/Onetomany/Delete`,
            onBeforeSend(method, ajaxOptions) {
                if (antiForgeryToken) {
                    ajaxOptions.headers = {
                        "RequestVerificationToken": antiForgeryToken
                    };
                };
            },
        }),
        rowAlternationEnabled: true,
        searchPanel: {
            visible: false
        },
        paging: {
            pageSize: 10,
        },
        pager: {
            visible: true,
            allowedPageSizes: [5, 10, 'all'],
            showPageSizeSelector: true,
            showInfo: true,
            showNavigationButtons: true,
        },
        onEditorPreparing(e) {
            if (e.parentType === 'dataRow' && e.dataField === 'pass') {
                e.editorOptions.disabled = (typeof e.row.data.id != 'undefined');
            }
        },
        columns: [
            {
                dataField: 'pass',
                caption: 'Password',
                validationRules: [{
                    type: 'required',
                    message: 'Password is required.',
                }],
                visible: false
            },
            {
                dataField: 'namaLengkap',
                caption: 'Nama Lengkap',
                validationRules: [{
                    type: 'required',
                    message: 'Nama Lengkap harus diisi.',
                }],
            },
            {
                dataField: 'userName',
                caption: 'User Name',
                selectedFilterOperation: "contains",
                filterOperations: [],
                validationRules: [{
                    type: 'required',
                    message: 'User Name is required.',
                }],
            },
            {
                dataField: 'email',
                caption: 'Email',
                validationRules: [{
                    type: 'required',
                    message: 'Email harus diisi.',
                }],
                visible: false
            },
            {
                dataField: 'roles',
                caption: 'Roles',
                allowSorting: false,
                allowFiltering: false,
                editCellTemplate: tagBoxEditorTemplate,
                lookup: {
                    dataSource: window.$roles,
                    valueExpr: 'text',
                    displayExpr: 'text',
                },
                cellTemplate(container, options) {
                    const noBreakSpace = '\u00A0';
                    const text = (options.value || []).map((element) => options.column.lookup.calculateCellValue(element)).join(', ');
                    container.text(text || noBreakSpace).attr('title', text);
                },
            },
        ],
        editing: {
            mode: 'popup',
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            popup: {
                title: 'User Info',
                showTitle: true,
                width: 700,
                height: 525,
            },
            form: {
                items: [
                    {
                        itemType: 'group',
                        colCount: 2,
                        colSpan: 2,
                        items: ['userName', 'pass']
                    },
                    {
                        itemType: 'group',
                        colSpan: 2,
                        items: ['email']
                    },
                    {
                        itemType: 'group',
                        caption: "Edit Roles",
                        colSpan: 2,
                        items: ['roles'],
                    }
                ],
            },
        }
    }).dxDataGrid("instance");
});

function tagBoxEditorTemplate(cellElement, cellInfo) {
    return $('<div>').dxTagBox({
        dataSource: window.$roles,
        value: cellInfo.value,
        valueExpr: 'text',
        displayExpr: 'text',
        showSelectionControls: true,
        showMultiTagOnly: false,
        applyValueMode: 'useButtons',
        searchEnabled: true,
        onValueChanged(e) {
            cellInfo.setValue(e.value);
        },
        onSelectionChanged() {
            cellInfo.component.updateDimensions();
        },
    });
}