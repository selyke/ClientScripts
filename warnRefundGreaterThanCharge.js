function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading) return;

    var field = control.fieldName; // the field we're in
    var raw = g_form.getValue(field) || ''; // e.g. "USD;14"
    var parts = raw.split(';');
    if (parts.length !== 2) return; // nothing to do

    var currency = parts[0],
        amtNum = parseFloat(parts[1]);

    if (isNaN(amtNum)) {
        // Bad number → revert
        g_form.setValue(field, oldValue);
        return;
    }

    // ---- enforce exactly two decimals ----
    var decimalPart = parts[1].split('.')[1] || '';
    if (decimalPart.length === 0) {
        // whole number: add .00
        amtNum = amtNum;
    } else if (decimalPart.length === 1) {
        // single‐digit decimal → error + revert
        g_form.showFieldMsg(
            field,
            'Must include two decimal places (e.g. 5.00).',
            'error'
        );
        g_form.setValue(field, oldValue);
        return;
    }
    // round anything >2 decimals
    amtNum = parseFloat(amtNum.toFixed(2));

    // ---- write it back for real ----
    var newRaw = currency + ';' + amtNum.toFixed(2);
    if (newRaw !== raw) {
        g_form.setValue(field, newRaw);
    }

    // ---- if this is refund, enforce refund ≤ charge ----
    if (field === 'u_refund_amount') {
        var chargeRaw = g_form.getValue('u_charge_amount') || '',
            chargeNum = parseFloat((chargeRaw.split(';')[1] || '0'));

        if (amtNum > chargeNum) {
            g_form.showFieldMsg(
                'u_refund_amount',
                'Refund amount must be less than or equal to charge amount.',
                'error'
            );
            // revert to last valid
            g_form.setValue('u_refund_amount', oldValue);
        }
    }
}
