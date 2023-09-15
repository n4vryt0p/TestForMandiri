"use strict"
var gridInstance;
$(document).ready(function () {
    var antiForgeryToken = document.getElementsByName("__RequestVerificationToken")[0].value;
    gridInstance = $('#roleGrid').dxDataGrid({
        dataSource: DevExpress.data.AspNet.createStore({
            key: 'id',
            loadUrl: `/Onetomany/Read`,
            insertUrl: `/Onetomany/Create`,
            updateUrl: `/Onetomany/Edit`,
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
            },
            {
                dataField: 'users',
                caption: 'Bawahan',
                allowSorting: false,
                allowFiltering: false,
                editCellTemplate: tagBoxEditorTemplate2,
                lookup: {
                    dataSource: window.$users,
                    valueExpr: 'id',
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
                        caption: "Edit Bawahan",
                        colSpan: 2,
                        items: ['users'],
                    }
                ],
            },
        }
    }).dxDataGrid("instance");
});

function tagBoxEditorTemplate2(cellElement, cellInfo) {
    return $('<div>').dxTagBox({
        dataSource: window.$users,
        value: cellInfo.value,
        valueExpr: 'id',
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