function onSubmit() {
    // pull and parse both fields
    function parseCur(field) {
        var raw = g_form.getValue(field) || '',
            num = parseFloat(raw.split(';')[1]);
        return isNaN(num) ? 0 : num;
    }



    var chargeNum = parseCur('u_charge_amount'),
        refundNum = parseCur('u_refund_amount');

    if (g_form.getValue('u_refund_type') == 'In-store') {

        if (chargeNum <= 0) {
            g_form.showFieldMsg(
                'u_charge_amount',
                'Charge amount must be greater than $0.00.',
                'error'
            );
            return false;
        }

        if (refundNum > chargeNum) {
            g_form.showFieldMsg(
                'u_refund_amount',
                'Cannot save: Refund amount cannot exceed charge amount.',
                'error'
            );
            return false;
        }

    }

    if (refundNum <= 0) {
        g_form.showFieldMsg(
            'u_refund_amount',
            'Refund amount must be greater than $0.00.',
            'error'
        );
        return false;
    }

    return true;
}
