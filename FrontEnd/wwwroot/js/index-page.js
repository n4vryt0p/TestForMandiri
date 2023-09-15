"use strict"
$(document).ready(function () {
    $('#oneGrid').dxDataGrid({
        dataSource: DevExpress.data.AspNet.createStore({
            key: 'id',
            loadUrl: `/Read`,
            insertUrl: `/Create`,
            updateUrl: `/Edit`,
            deleteUrl: `/Delete`,
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
                dataField: 'userName',
                caption: 'User Name',
                validationRules: [{
                    type: 'required',
                    message: 'User Name harus diisi.',
                }],
            },
            {
                dataField: 'pass',
                caption: 'Password',
                validationRules: [{
                    type: 'required',
                    message: 'Password harus diisi.',
                }],
                visible: false
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
                dataField: 'namaLengkap',
                caption: 'Nama Lengkap',
                validationRules: [{
                    type: 'required',
                    message: 'Nama Lengkap harus diisi.',
                }],
            },
            {
                dataField: 'noKtp',
                caption: 'No. KTP',
                dataType: "number",
                validationRules: [{
                    type: 'required',
                    message: 'No. KTP harus diisi.',
                }],
            },
            {
                dataField: 'alamat',
                caption: 'Alamat'
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
                        caption: "Detail",
                        colSpan: 2,
                        items: ['namaLengkap', 'noKtp', 'alamat'],
                    }
                ],
            },
        },
    });
});