"use strict"
$(document).ready(function () {
    $('#roleGrid').dxDataGrid({
        dataSource: DevExpress.data.AspNet.createStore({
            key: 'id',
            loadUrl: `/Index/Read`,
            insertUrl: `/Index/RoleManage/Create`,
            updateUrl: `/Index/RoleManage/Edit`,
            deleteUrl: `/Index/RoleManage/Delete`,
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
    });
});