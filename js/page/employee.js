$(document).ready(function() {
    new EmployeePage();
});
class EmployeePage {
    TitlePage = "Danh Sách Khách Hàng";
    FomeMode = null;
    employeeDelete = null;
    employeeSelect = null;
    employeeCode = null;
    currentPageIndex = 1;
    maxPageIndex = 5;
    constructor() {
        this.loadData();
        this.loadcomboxDepartment();
        this.loadcomboboxPosition();
        this.initEvents();

    }
    loadData(pageNumber) {
            // goi ajax lấy dữ liệu->sử dụng ajax
            $('tbody').empty();
            var meload = this;
            let employees = [];
            //lấy ra giá tri của sreach text 
            let searchText = $('#txtSreach').val();
            //lấy thông tin phân trang
            let pageSize = $('#cbxPageSize').val();
            if (!pageNumber)
                pageNumber = 1;
            searchText = (searchText ? searchText : "");
            let apiUrl = `http://amis.manhnv.net/api/v1/Employees/filter?pageSize=${pageSize}&pageNumber=${pageNumber}&employeeFilter=${searchText}`;
            $.ajax({
                type: "GET",
                url: apiUrl,
                success: function(response) {
                    let totalrecord = response.TotalRecord;
                    let totalpage = response.TotalPage;
                    //tính toán hiển thị số trang  trong pagingbar
                    //nếu tổng số trang hơn hơn số button hiển thị  trên giao diện -> render ra 5 button
                    //nếu tổng số trang nhỏ hơn số button hiển thị  trên giao diện -> render ra totalpage button
                    $('.m-paging-number').empty();
                    if (meload.maxPageIndex <= totalpage) {
                        //lấy thông tin trang hiên tại
                        let currentPageIndex = meload.currentPageIndex;
                        //xác định xem trang hiện tại nằm ở phạm vi nào:
                        let totalRange = Number.parseInt(totalpage / pageSize) + (totalpage % pageSize) > 0 ? 1 : 0;
                        let currentRange = 0;
                        if (currentPageIndex % meload.maxPageIndex != 0) {
                            currentRange = Number.parseInt(currentPageIndex / meload.maxPageIndex) + 1;
                        } else {
                            currentRange = Number.parseInt(currentPageIndex / meload.maxPageIndex);
                        }
                        //xác định button bắt đầu bằng số trang bao nhiêu
                        let endButton = currentRange * meload.maxPageIndex;
                        for (let index = 0; index < meload.maxPageIndex; index++) {
                            let buttonHTML = $(`<div class="m-number ">${endButton}</div>`);
                            buttonHTML.data('value', endButton);
                            if (endButton <= totalpage) {
                                if (endButton == currentPageIndex)
                                    buttonHTML.addClass('m-paging-number-avtive')
                                $('.m-paging-number').prepend(buttonHTML);
                            }
                            endButton--;
                        }
                    } else {
                        $('.m-paging-number').empty();
                        for (let index = 0; index < totalpage; index++) {
                            let buttonHTML = `<div class="m-number ">1</div>`;
                            $('.m-paging-number').append(buttonHTML);
                        }
                    }
                    employees = response.Data;
                    for (const emp of employees) {
                        var trHTML = $(`<tr>
                           <td class="text-align-center"><input id ="btncheckbox" type="checkbox"></td>
                                     <td class="text-align-left">${emp.EmployeeCode}</td>
                                     <td class="text-align-left">${emp.EmployeeName}</td>
                                     <td class="text-align-left">${emp.GenderName||""}</td>
                                     <td class="text-align-center">${commonJs.formatDate(emp.DateOfBirth)}</td>
                                     <td class="text-align-left" style="width: 50px; ">${emp.IdentityNumber}</td>
                                     <td class="text-align-left" style="width: 50px; ">${emp.PositionName || ""}</td>
                                     <td class="text-align-left">${emp.DepartmentName ||""}</td>
                                     <td class="text-align-left" style="width: 100px; ">${emp.BankAccountNumber}</td>                        
                                     <td class="text-align-left" style="width: 100px; ">${emp.BankName|| ""}</td>
                                     <td class="text-align-left" style="width: 150px; ">${emp.BankBranchName}</td>
                                     <td class="text-align-right" style="width: 100px;   id ="Option">
                                     <div style="display: flex; ">
                                     <button id="btnUpdate" >sửa</button>
                                     <div id="div-optiondelete" class="mcombobox" style="";>
                            <button id = "cbxDelete" tabindex="-1" class="m-combobox-button"><i class="fas fa-chevron-down"></i></button>
                            <div id="m-combobox-data-1" class="m-combobox-data">
                                <div class="m-combobox-item" value="1">xóa</div>
                                <div class="222" value="0">sao Lưu</div>
                            </div>
                        </div>
                                 </div>
                                 </div>
                                     </td>
                                   </tr>`);
                        trHTML.data("emplyeeId", emp.EmployeeId);
                        trHTML.data("employee", emp);
                        trHTML.data('departmentId', emp.DepartmentId);
                        trHTML.data('positionId', emp.PositionId);
                        trHTML.data("genderId", emp.Gender);
                        trHTML.data('employeeCode', emp.EmployeeCode)
                        $('tbody').append(trHTML);
                        //hiển thị tổng số nhân viên
                        $('#paging-left-number').empty();
                        $('#paging-left-number').append("Số Lượng:" + totalrecord)
                    }

                },
                error: function() {
                    console.log("lỗi API");
                }


            });

        }
        // thực hiện load dữ liệu
        // loadData() {
        //         // goi ajax lấy dữ liệu->sử dụng ajax
        //         $('tbody').empty();
        //         //lấy ra giá tri của sreach text 


    //         $.ajax({
    //             type: "GET",
    //             async: true,
    //             url: "http://cukcuk.manhnv.net/api/v1/Employees",
    //             success: function(response) {
    //                 if (response) {
    //                     var employees = response;
    //                     for (const emp of employees) {
    //                         var trHTML = $(`<tr>
    //                        <td class="text-align-center"><input id ="btncheckbox" type="checkbox"></td>
    //                                  <td class="text-align-left">${emp.EmployeeCode}</td>
    //                                  <td class="text-align-left">${emp.FullName}</td>
    //                                  <td class="text-align-left">${emp.GenderName||""}</td>
    //                                  <td class="text-align-center">${commonJs.formatDate(emp.DateOfBirth)}</td>
    //                                  <td class="text-align-left" style="width: 50px; ">${emp.IdentityNumber}</td>
    //                                  <td class="text-align-left" style="width: 50px; ">${emp.PositionName}</td>
    //                                  <td class="text-align-left">${emp.DepartmentName ||""}</td>
    //                                  <td class="text-align-left" style="width: 100px; ">${emp.BankAccountNumber}</td>                        
    //                                  <td class="text-align-left" style="width: 100px; ">${emp.BankName|| ""}</td>
    //                                  <td class="text-align-left" style="width: 150px; ">${emp.BankBranchName}</td>
    //                                  <td class="text-align-right" style="width: 100px;   id ="Option">
    //                                  <div style="display: flex; position: relative;">
    //                                  <button id="btnUpdate" >sửa</button>
    //                                  <div id="div-optiondelete" class="mcombobox" style="";>
    //                         <button tabindex="-1" class="m-combobox-button"><i class="fas fa-chevron-down"></i></button>
    //                         <div id="m-combobox-data-1" class="m-combobox-data">
    //                             <div class="m-combobox-item" value="1">xóa</div>
    //                             <div class="222" value="0">sao Lưu</div>
    //                         </div>
    //                     </div>
    //                              </div>
    //                              </div>
    //                                  </td>
    //                                </tr>`);
    //                         trHTML.data("emplyeeId", emp.EmployeeId);
    //                         trHTML.data("employee", emp);
    //                         trHTML.data('departmentId', emp.DepartmentId);
    //                         trHTML.data('positionId', emp.PositionId);
    //                         trHTML.data("genderId", emp.Gender);
    //                         $('tbody').append(trHTML);
    //                     }
    //                     $('#paging-left-number').append(employees.length)
    //                 }
    //             },
    //             error: function() {
    //                 console.log("lỗi API");
    //             }
    //         });
    //     }
    // Gán các sự kiện trong thành phần trong trang
    loadcomboxDepartment() {
            $('#comboDeparment').empty();
            let combos = [];
            $.ajax({
                type: "GET",
                url: "http://amis.manhnv.net/api/v1/Departments",
                success: function(response) {
                    for (const res of response) {
                        let optionHTML = `<div class="m-combobox-item" value="${res.DepartmentId}">${res.DepartmentName}</div>`;
                        $('#m-combobox-data').append(optionHTML)
                    }
                },
            });
        }
        // //load combobox vị trí trong thêm mới nhân viên
    loadcomboboxPosition() {
        $('#txtPosition').empty();
        let combo = [];
        $.ajax({
            type: "GET",
            url: "http://cukcuk.manhnv.net/api/v1/Positions",
            async: false,
            data: "data",
            dataType: "json",
            success: function(response) {
                combo = response
            }
        });
        for (const em of combo) {
            let comboPositon = `<option value="${em.PositionId}">${em.PositionName}</option>`;
            $('#txtPosition').append(comboPositon);
        }
    }
    initEvents() {
        //button add
        $('#btnaddemployee').click(this.btnAddOnClick.bind(this))
            //button close
        $('#insert-btn-x').click(this.btnCloseClick);
        //db click tr load thông tin chi tiết nhân viên
        $('.m-table tbody').on('click', 'tr td button#btnUpdate', this.rowDbClick.bind(this));
        //click ẩn thông tin insert đã nhập
        $('#btn-cancel').click(this.btnCancelClick);
        //thực hiện lưu thông tin đã nhập sửa hoặc thêm mới trong form insert
        $('#btn-save').click(this.btnSaveClick.bind(this));
        //thực hiên xóa dữ liệu trong td
        $('.m-table tbody').on('click', 'tr td input#btncheckbox', this.rowDeleteOnClick.bind(this));
        //thực hiên load lai dữ liệu
        $('#btn-refesh').on('click', this.btnRefeshClick.bind(this));
        //thực hiện hiển thị form xác nhận xóa hay không
        $('table.m-table').on('click', 'tbody tr .m-combobox-item', this.btnDelete.bind(this));
        //thực hiện hủy from xóa
        $('#btnCloseDialog').click(this.btnexitDelete)
            //Thưc hiện hủy xóa nhân viên
        $('#btnNext').click(this.btnexitDelete)
            //thực hiện xác nhận xóa thông tin
        $('#btnClose').click(this.delete.bind(this));
        //thực hiện lấy dữ liệu từ inputsreach
        // $('#txtSreach').on('blur', this.getValueSearch.bind(this));

        $('#txtSreach').on('blur', this.getValueSearch.bind(this))
            //thực hiện chuyển trang 
        var me = this;
        $('.m-button-next').click(function() {
            let currentButtonActive = $(this).siblings('.m-paging-number').children('.m-paging-number-avtive');
            $(currentButtonActive).removeClass('m-paging-number-avtive')
            $(currentButtonActive).next().addClass('m-paging-number-avtive');
            let buttonactive = $(currentButtonActive).next();
            var value = buttonactive.data('value');
            me.currentPageIndex = value;
            me.loadData(value);
        })
        $('.m-button-prev').click(function() {
            let currentButtonActive = $(this).siblings('.m-paging-number').children('.m-paging-number-avtive');
            $(currentButtonActive).removeClass('m-paging-number-avtive')
            $(currentButtonActive).prev().addClass('m-paging-number-avtive');
            let buttonactive = $(currentButtonActive).prev();
            let value = buttonactive.data('value');
            me.currentPageIndex = value;
            me.loadData(value);
        })
        $('#cbxPageSize').change(function() {
            me.loadData(me.currentPageIndex);
        })
    }
    getValueSearch() {
            var me = this;
            me.loadData();
        }
        // nextPage() {
        //     debugger

    //     //chuyển forcue sang trang tiếp theo
    //     //xác định button hiện tại
    //     // $(this).siblings('.m-paging-number').children();
    //     let currentButtonActive = $(this).siblings('.m-paging-number').children('.m-paging-number-avtive');
    //     $(currentButtonActive).removeClass('m-paging-number-avtive')
    //     $(currentButtonActive).next().addClass('m-paging-number-avtive');
    //     let buttonactive = $(currentButtonActive).next();
    //     var value = buttonactive.data('value');
    //     this.currentPageIndex = value;
    //     this.loadData(value);

    // }
    // prevPage() {

    //     var me = this;
    //     let currentButtonActive = $(this).siblings('.m-paging-number').children('.m-paging-number-avtive');
    //     $(currentButtonActive).removeClass('m-paging-number-avtive')
    //     $(currentButtonActive).prev().addClass('m-paging-number-avtive');
    //     let buttonactive = $(currentButtonActive).prev();
    //     let value = buttonactive.data('value');

    //     me.loadData(value);
    // }

    btnAddOnClick() {
            //Gán lại giá trị cho fomeMode
            this.FomeMode = Enum.FomeMode.Add;
            //load mã nhân viên khi mới 
            $.ajax({
                type: "GET",
                url: "http://amis.manhnv.net/api/v1/Employees/NewEmployeeCode",
                success: function(response) {
                    $('#txtEmployeeCode').val(response);
                    $('#txtEmployeeCode').focus();

                }
            });
            //load mã nhân viên mới lên dialog
            $('#m-dialog-modal').show();
        }
        //hủy form thêm mới xóa hết thông tin đã nhập trong input
    btnCloseClick() {
            $('input').val(null);
            $('input[type=radio]').removeAttr('checked');
            $('#m-dialog-modal').hide();
        }
        //đóng form thêm nhưng vẫn lưu thông tin
    btnCancelClick() {
            $('#m-dialog-modal').hide();
        }
        //cập nhật lại dữ liêu
    btnRefeshClick() {

            $('.m-table tbody').empty();

            this.loadData()
        }
        //thực hiện lấy id khi click vào checkbox
    rowDeleteOnClick(sender) {
            let currentRow = sender.currentTarget;
            // var test = $(currentRow).siblings('tbody tr');
            var test = currentRow.parentElement;
            // $(test.parentElement).siblings().removeClass('row-selected');
            // $(test.parentElement).addClass('row-selected');
            // Lấy Id của nhân viên tương ứng:
            this.employeeDelete = $(test.parentElement).data('emplyeeId');
            this.employeeCode = $(test.parentElement).data('employeeCode');
            // this.employeeCode = $(test.parentElement).data('employeeCode');
            $('.m-popup-text').empty();
            $('.m-popup-text').append("Bạn có chắc chắn muốn xóa nhân viên " + this.employeeCode + " này hay không?")
            console.log(test.parentElement)
        }
        //thực hiện show ra form xác nhận xóa
    btnDelete() {
        $('.m-popup').show();
    }
    btnexitDelete() {
        $('.m-popup').hide();
    }
    btnCancelDelete() {
        $('.m-popup').hide();
    }
    rowDbClick(sender) {
            this.FomeMode = Enum.FomeMode.Update;
            let currentcol = sender.currentTarget.parentElement;
            let currentTd = currentcol.parentElement;
            let currentRow = currentTd.parentElement;
            let employeeId = $(currentRow).data('emplyeeId');
            var genderid = $(currentRow).data('genderId');
            var departmentId = $(currentRow).data('departmentId');
            var positionId = $(currentRow).data('positionId');
            this.employeeSelect = employeeId;
            console.log(genderid)
            switch (genderid) {
                case 0:
                    $('input#female').attr('checked', true);
                    break;
                case 1:
                    $('input#male').attr('checked', true);
                    break;
                default:
                    $('input#different').attr('checked', true);
                    break;
            }
            $.ajax({
                type: "GET",
                url: `http://amis.manhnv.net/api/v1/Employees/${employeeId}`,
                success: function(employee) {

                    $('#txtEmployeeCode').val(employee.EmployeeCode);
                    $('#txtEmployeeFullName').val(employee.EmployeeName);
                    $('#dtDateOfBird').val(commonJs.formatDateShow(employee.DateOfBirth));
                    $('#txtIndentityNumber').val(employee.IdentityNumber);
                    $('#dtIndentityDate').val(commonJs.formatDateShow(employee.IdentityDate));
                    $('#txtIndentityPlace').val(employee.IdentityPlace);
                    $('#txtAddress').val(employee.Address);
                    $('#txtPhoneNumber').val(employee.PhoneNumber);
                    $('#txtEmali').val(employee.Email);
                    $('#txtSalary').val(employee.Salary);
                    $('#txtJoinDate').val(commonJs.formatDateShow(employee.JoinDate));
                    $('#txtPersonalTax').val(employee.PersonalTaxCode);
                }
            });
            $.ajax({
                type: "GET",
                url: `http://cukcuk.manhnv.net/api/v1/Departments/${departmentId}`,
                success: function(emp) {
                    // biding dữ liệu lên form chi tiết tương ứng với từng thông tin đối tượng:
                    $('#departmentId').val(emp.DepartmentName);
                }
            });
            $('#m-dialog-modal').show();
        }
        // rowDbClick(sender) {
        //     let currentCol = sender.currentTarget;
        //     let employeId = $(currentCol).data('emplyeeId');
        //     this.employeeSelect = employeId;
        //     console.log(employeId);
        // }
    btnSaveClick() {
        var me = this;
        // Thu thập thông tin đã nhập liệu
        const employeecode = $('#txtEmployeeCode').val();
        const fullname = $('#txtEmployeeFullName').val();
        const dateofbirth = $('#dtDateOfBird').val();
        const gender = $('input[name="gender"]:checked').val();
        const email = $('#txtEmali').val();
        const phonenumber = $('#txtPhoneNumber').val();
        const address = $('#address').val();
        const department = $('#div-department').data('value');
        const salary = $('#txtSalary').val();
        // tao object chứa dữ liệu
        let employee = {
            "EmployeeCode": employeecode,
            "EmployeeName": fullname,
            "Gender": gender,
            "DateOfBirth": dateofbirth,
            "PhoneNumber": phonenumber,
            "Email": email,
            "Address": address,
            "Salary": salary,
            "DepartmentId": department

            // "DepartmentId": department
        };
        if (this.FomeMode == Enum.FomeMode.Add) {
            // sử dụng ajax post dữ liệu lên server
            $.ajax({
                type: "POST",
                url: "http://amis.manhnv.net/api/v1/Employees",
                data: JSON.stringify(employee),
                dataType: "json",
                contentType: "application/json",
                success: function(response) {
                    me.loadData();
                    // bỏ validate 
                    $('#txtEmployeeFullName').removeClass('m-input-error');
                    $('#departmentId').removeClass('m-input-error');
                    $('.m-dialog-modal').hide();
                    // $('#addSucess').show();
                    // setTimeout(function() { $('#addSucess').hide(); }, 3000);
                },
                error: function(response) {

                    let status = response.status;
                    switch (status) {
                        // thêm mới thành công
                        case 200:
                            alert("Thêm mới thành công");
                            break;
                            // lỗi thiếu trường dữ liệu
                        case 400:
                            // alert(response.responseJSON.userMsg);
                            //  thực hiện validate
                            let txtFullName = $('#txtEmployeeFullName').val();
                            let txtDeparment = $('#departmentId').data('value');
                            // Nếu trường tên trống thực hiện validate cho input fullname 
                            if (txtFullName == '') {
                                $('#txtEmployeeFullName').addClass('m-input-error');
                                $('.m-validate-name').show();
                            }
                            if (txtDeparment == null) {
                                $('#departmentId').addClass('m-input-error');
                            }
                            //Nếu trường đơn vị trống thực hiện validate cho input departmen
                            break;
                    }
                }
            });
        } else {
            $.ajax({
                type: "PUT",
                url: `http://amis.manhnv.net/api/v1/Employees/${this.employeeSelect}`,
                data: JSON.stringify(employee),
                dataType: "json",
                contentType: "application/json",
                success: function(response) {
                    console.log(response);
                    $('.m-dialog-modal').hide();
                }
            });
            this.loadData();
        };
    }
    delete(sender) {
        let me = this
        let employeeId = this.employeeDelete;
        $.ajax({
            type: "DELETE",
            url: `http://amis.manhnv.net/api/v1/Employees/${employeeId}`,
            success: function(response) {
                me.loadData();
                $('.m-popup').hide();
            }
        });
    }
}


// $(document).ready(function() {
//         loadData();
//         loadcombobox()
//         loadcomboboxPosition()
//         loadcomboboxDepartment()
//         fix()
//             //thêm mới nhân viên button
//         $('#btnaddemployee').click(function() {
//             $('#m-dialog-modal').show();
//             $('.input-box').val(null);
//             // hiện thị nhập vào ô đầu tiên
//             $.ajax({
//                 type: "GET",
//                 url: "http://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
//                 success: function(response) {
//                     $('#txtemployeecode').val(response);
//                     $('#txtemployeecode').focus();
//                 }
//             });
//         });
//         //Đóng thêm mới nhân viên
//         $('#insert-btn-x').click(function() {
//             $('#m-dialog-modal').hide();
//         });
//     })
//     //thực hiên lưu dữ liệu
// $('#btn-save').click(function() {
//     //lấy dữ liệu nhập
//     const employeeCode = $('#txtemployeecode').val();
//     const fullName = $('#txtfullname').val();
//     const dateofBird = $('#dtdateofbirth').val();
//     const genDer = $('#cbxgender').val();
//     const identitynumber = $('#txtidentitynumber').val();
//     const identityDate = $('#dtidentitydate').val();
//     const identityPlace = $('#txtidentityplace').val();
//     const Email = $('#txtemail').val();
//     const phoneNumber = $('#txtphonenumber').val();
//     const position = $('#cbxpositionName').val();
//     const department = $('#cbxdepartmentName').val();
//     const personaltaxcode = $('#txtpersonaltaxcode').val();
//     const salary = $('#txtsalary').val();
//     const joinDate = $('#dtjoindate').val();
//     const workStatus = $('#cbxworkstatus').val();

//     //buil obj
//     let employee = {
//         "EmployeeCode": employeeCode,
//         "FullName": fullName,
//         "Gender": genDer,
//         "DateOfBirth": dateofBird,
//         "PhoneNumber": phoneNumber,
//         "Email": Email,
//         "IdentityNumber": identitynumber,
//         "IdentityDate": identityDate,
//         "IdentityPlace": identityPlace,
//         "JoinDate": joinDate,
//         "DepartmentName": department,
//         "PositionName": position,
//         "WorkStatus": workStatus,
//         "PersonalTaxCode": personaltaxcode,
//         "Salary": salary
//     }
//     console.log(employee);
//     $.ajax({
//         type: "POST",
//         url: "http://cukcuk.manhnv.net/api/v1/Employees",
//         data: JSON.stringify(employee),
//         dataType: "json",
//         contentType: "application/json",
//         success: function(response) {
//             console.log(response);
//         },
//         error: function(response) {
//             console.log(response);
//         }
//     });
//     loadData();
//     $('#m-dialog-modal').hide();
// });
// //load data
// function loadData() {
//     // Làm trống dữ liệu hiển thị trên table:
//     $('tbody').empty();
//     // Lấy dữ liệu về:
//     let employees = [];
//     // Sử dụng fetch trong js:
//     // await fetch('http://cukcuk.manhnv.net/api/v1/Employees')
//     //     .then(res => {
//     //         debugger
//     //         return res.json()
//     //     })
//     //     .then(data => {
//     //         employees = data;
//     //         console.log(data);
//     //     })
//     //     .catch(res => {});
//     // sử dụng ajax:
//     $.ajax({
//         type: "GET", // GET - lấy dữ liệu; POST - Thêm mới; PUT - sửa; DELETE - xóa
//         url: "http://cukcuk.manhnv.net/api/v1/Employees",
//         // data: "json", // Tham số truyền lên cho Api (nếu có)
//         async: false,
//         dataType: "json",
//         success: function(response) {
//             employees = response;
//             console.log("2")
//         },
//         error: function(res) {
//             console.log("Lỗi Api");
//         }
//     });
//     console.log("3");
//     // do something with myJson
//     // Xử lý dữ liệu:

//     // Build dữ liệu hiển thị lên table:


//     // Mapping từng thông tin của từng đối tượng trong mảng vào chuỗi HTML:
//     for (const emp of employees) {
//         // Xử lý dữ liệu:
//         //1. Xử lý dữ liệu ngày tháng (phải hiển thị dạng Ngày/Tháng/Năm)
//         let dateOfBirth = new Date(emp.DateOfBirth);
//         let date = dateOfBirth.getDate();
//         let month = dateOfBirth.getMonth() + 1;
//         let year = dateOfBirth.getFullYear();
//         // Bổ sung thêm ký tự '0' nếu ngày hoặc tháng nhỏ hơn 10
//         date = (date < 10 ? `0${date}` : date);
//         month = (month < 10 ? `0${month}` : month);
//         dateOfBirth = `${date}/${month}/${year}`;

//         // 2. Định dạng tiền tệ: (có dấu chấm phân cách hàng nghìn:)
//         // let salary = (emp.Salary).toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
//         let salary = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(emp.Salary);

//         // Xác định các thông tin được thể hiện ở dạng HTML như thế nào?:
//         let trHTML = $(`<tr>
//         <td class="text-align-center"><input type="checkbox"></td>
//                 <td class="text-align-left">${emp.EmployeeCode}</td>
//                 <td class="text-align-left">${emp.FullName}</td>
//                 <td class="text-align-left">${emp.GenderName||""}</td>
//                 <td class="text-align-center">${dateOfBirth}</td>
//                 <td class="text-align-left" style="width: 50px; ">${emp.IdentityNumber}</td>
//                 <td class="text-align-left" style="width: 50px; ">${emp.PositionName}</td>
//                 <td class="text-align-left">${emp.DepartmentName ||""}</td>
//                 <td class="text-align-left" style="width: 100px; ">tài khoản ngân hàng</td>                        
//                 <td class="text-align-left" style="width: 100px; ">Tên Ngân Hàng</td>
//                 <td class="text-align-left" style="width: 150px; ">Chi Nhánh Ngân hàng</td>
//                 <td class="text-align-right" style="width: 70px; ">Chức Năng</td>
//               </tr>`);
//         trHTML.data('employeeId', emp.EmployeeId);
//         trHTML.data("employee", emp);
//         $('tbody').append(trHTML);
//     }
//     console.log("4");
// }
// var employees = [{
//             "EmployeeCode": "NV-001",
//             "FullName": "Vũ Văn Sơn",
//             "Gender": 1,
//             "DateOfBirth": "2021-11-02T00:00:00",
//             "PhoneNumber": "090900900",
//             "Email": "vuvanson2205@gmail.com",
//             "Address": null,
//             "Salary": 100000,
//             "GenderName": "Nam"
//         },
//         {
//             "EmployeeCode": "NV-001",
//             "FullName": "Nguyễn Văn A",
//             "Gender": 1,
//             "DateOfBirth": "2021-11-02T00:00:00",
//             "PhoneNumber": "090900900",
//             "Email": "vuvanson2205@gmail.com",
//             "Address": null,
//             "Salary": 100000,
//             "GenderName": "Nam"
//         },
//         {
//             "EmployeeCode": "NV-001",
//             "FullName": "Nguyễn Văn B",
//             "Gender": 1,
//             "DateOfBirth": "2021-11-02T00:00:00",
//             "PhoneNumber": "090900900",
//             "Email": "vuvanson2205@gmail.com",
//             "Address": null,
//             "Salary": 100000,
//             "GenderName": "Nam"
//         },
//     ]
//     //load combox header nhân viên
// function loadcombobox() {
//     $('#1').empty();
//     let combos = [];
//     $.ajax({
//         type: "GET",
//         url: "http://cukcuk.manhnv.net/api/v1/Departments",
//         async: false,
//         data: "data",
//         dataType: "json",
//         success: function(response) {
//             combos = response
//             console.log(1)
//         },
//         error: function() {
//             console.log(2)
//         }
//     });
//     console.log(3)
//     for (const emp of combos) {
//         let trHTML = `<option value="">${emp.DepartmentName}</option>`;
//         $('#1').append(trHTML);
//     }
// }
// //load combobox vị trí trong thêm mới nhân viên
// function loadcomboboxPosition() {
//     $('#cbxpositionName').empty();
//     let combo = [];
//     $.ajax({
//         type: "GET",
//         url: "http://cukcuk.manhnv.net/api/v1/Positions",
//         async: false,
//         data: "data",
//         dataType: "json",
//         success: function(response) {
//             combo = response
//         }
//     });
//     for (const em of combo) {
//         let comboPositon = `<option value="${em.PositionId}">${em.PositionName}</option>`;
//         $('#cbxpositionName').append(comboPositon);
//     }
// }
// //load combobox phòng ban trong thêm mới nhân viên
// function loadcomboboxDepartment() {
//     $('#cbxdepartmentName').empty();
//     let combo = [];
//     $.ajax({
//         type: "GET",
//         url: "http://cukcuk.manhnv.net/api/v1/Departments",
//         async: false,
//         data: "data",
//         dataType: "json",
//         success: function(response) {
//             combo = response;
//         }
//     });
//     for (const emp of combo) {
//         let comboDepartment = `<option value="${emp.DepartmentId}">${emp.DepartmentName}</option>`;
//         $('#cbxdepartmentName').append(comboDepartment);
//     }
// }
// //lấy chi tiết thông tin nhân viên 
// // $('tbody tr').dblclick(function() {
// //     var employeeid = $(this).data('employeeId');
// //     $('#m-dialog-modal').show();
// //     var employee = $(this).data('employee');

// //     //lấy thông tin chi tiết
// //     $.ajax({
// //         type: "GET",
// //         url: `http://cukcuk.manhnv.net/api/v1/Employees/${employeeid}`,
// //         success: function(response) {
// //             console.log(response);
// //             $('#txtemployeecode').val(response.EmployeeCode);
// //             $('#txtfullname').val(response.FullName);
// //             $('#dtdateofbirth').val(response.DateOfBirth);
// //             //  $('#cbxgender').val();
// //             $('#txtidentitynumber').val(response.IdentityNumber);
// //             $('#dtidentitydate').val(response.identityDate);
// //             $('#txtidentityplace').val(response.IdentityPlace);
// //             $('#txtemail').val(response.Email);
// //             $('#txtphonenumber').val(response.PhoneNumber);
// //             //  $('#cbxpositionName').val();
// //             // $('#cbxdepartmentName').val();
// //             $('#txtpersonaltaxcode').val(response.PersonalTaxCode);
// //             $('#txtsalary').val(response.Salary);
// //             $('#dtjoindate').val(response.JoinDate);
// //             // $('#cbxworkstatus').val();
// //         }
// //     });
// // })
// function fix() {
//     $('tbody tr').dblclick(function() {
//         var employeeid = $(this).data('employeeId');
//         $('#m-dialog-modal').show();
//         var employee = $(this).data('employee');

//         //lấy thông tin chi tiết
//         $.ajax({
//             type: "GET",
//             url: `http://cukcuk.manhnv.net/api/v1/Employees/${employeeid}`,
//             success: function(response) {
//                 console.log(response);
//                 $('#txtemployeecode').val(response.EmployeeCode);
//                 $('#txtfullname').val(response.FullName);
//                 $('#dtdateofbirth').val(response.DateOfBirth);
//                 //  $('#cbxgender').val();
//                 $('#txtidentitynumber').val(response.IdentityNumber);
//                 $('#dtidentitydate').val(response.identityDate);
//                 $('#txtidentityplace').val(response.IdentityPlace);
//                 $('#txtemail').val(response.Email);
//                 $('#txtphonenumber').val(response.PhoneNumber);
//                 //  $('#cbxpositionName').val();
//                 // $('#cbxdepartmentName').val();
//                 $('#txtpersonaltaxcode').val(response.PersonalTaxCode);
//                 $('#txtsalary').val(response.Salary);
//                 $('#dtjoindate').val(response.JoinDate);
//                 // $('#cbxworkstatus').val();
//             }
//         });
//     })
// }