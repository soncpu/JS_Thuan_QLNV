class commonJs {
    // Định dạng ngày Tháng
    // @param (Date) Date
    static formatDate(date) {
            const newDate = new Date(date);
            var day = newDate.getDate();
            var month = newDate.getMonth() + 1;
            var year = newDate.getFullYear();
            day = (day < 10 ? `0${day}` : day);
            month = (month < 10 ? `0${month}` : month);
            return `${month}/${day}/${year}`;
        }
        //Dịnh Dạng tiền
    static formatMoney(money) {
            let salary = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money);
            return salary;
        }
        // định dạng lại ngày, tháng, năm để hiển thị lên form
    static formatDateShow(date) {
        if (date) {
            const d1 = new Date(date);
            return d1.getFullYear() + '-' + ("0" + (d1.getMonth() + 1)).slice(-2) + '-' + ("0" + (d1.getDate())).slice(-2);
        } else {
            const d2 = new Date();
            d2.setDate(1);
            d2.setMonth(1);
            d2.setFullYear(1970);
            return d2.getFullYear() + '-' + ("0" + (d2.getMonth())).slice(-2) + '-' + ("0" + (d2.getDate())).slice(-2);
        }
    }
}