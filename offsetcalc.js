//let offsetChart; // Declare the variable globally

/*
window.onload = function () {
    const interestRateInput = document.getElementById('OffsetInterestRate');
    const calculateButton = document.getElementById('offsetcalculateButton');

    const initialAmountInput = document.getElementById('loanAmount');
    const offsetBalanceInput = document.getElementById('offsetBalance');
    const paymentFrequencySelect = document.getElementById('PaymentFrequency');
    const loanTermInput = document.getElementById('loanTerm');

    const contributionAmount = 100;
    const investmentPeriod = 5;

    //calculateDataPoints(initialAmount, offsetBalance, paymentFrequency, loanTerm, loanRate)

    drawGraph(500000, 0, monthly, 30, 0.05);

    drawGraph(
        parseFloat(500000),
        parseFloat(0),
        paymentFrequencySelect.value,
        parseFloat(30),
        parseFloat(0.05)
    );

    interestRateInput.addEventListener('input', function () {
        customSlider();
        drawGraph(
            parseFloat(initialAmountInput.value),
            parseFloat(offsetBalanceInput.value),
            paymentFrequencySelect.value,
            parseFloat(loanTermInput.value),
            parseFloat(interestRateInput.value)
        );
    });

    calculateButton.addEventListener('click', function () {
        drawGraph(
            parseFloat(initialAmountInput.value),
            parseFloat(offsetBalanceInput.value),
            paymentFrequencySelect.value,
            parseFloat(loanTermInput.value),
            parseFloat(interestRateInput.value)
        );
    });

    function customSlider() {
        const maxVal = interestRateInput.getAttribute("max");
        const val = (interestRateInput.value / maxVal) * 15; // Limit the range to 0 to 20
        const roundedVal = val.toFixed(2) + "%"; // Round to 2 decimal places

        OffsetInterestRateLabel.innerHTML = roundedVal;
    }
};
*/

function drawGraph(initialAmount, offsetBalance, paymentFrequency, loanTerm, loanRate) {
    const ctx = document.getElementById('offset-data-set').getContext('2d');

    if (offsetChart) {
        offsetChart.destroy();
    }

    const dataPointsTotal = calculateDataPoints(initialAmount, 0, paymentFrequency, loanTerm, loanRate);
    const dataPointsOffset = calculateDataPoints(initialAmount, offsetBalance, paymentFrequency, loanTerm, loanRate);

    offsetChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: (loanTerm) + 1 }, (_, i) => `Year ${i}`),
            datasets: [{
                label: 'Total Amount Owed',
                data: dataPointsTotal,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                label: 'Remaining Loan Balance (with Offset)',
                data: dataPointsOffset,
                borderColor: 'rgba(255, 99, 71, 0.2)',
                borderWidth: 2,
                fill: true,
                backgroundColor: 'rgba(255, 99, 71, 0.2)',
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.ceil(Math.max(...dataPointsTotal, ...dataPointsOffset) * 1.1),
                }
            }
        }
    });
}

function calculateDataPoints(initialAmount, offsetBalance, paymentFrequency, loanTerm, loanRate) {
    const values = [];
    let currentValue = initialAmount;
    let monthlyInterest = 0;

    for (let i = 0; i <= loanTerm; i++) {
        if (i % paymentFrequency === 0) {
            values.push(currentValue);
            const payment = CalculatePayment(currentValue, loanRate / 12, loanTerm * paymentFrequency - i);
            currentValue -= payment;
        }
        monthlyInterest += dailyInterest(currentValue + monthlyInterest, loanRate / 12);
        if (i % 30 === 0) {
            currentValue += monthlyInterest;
            monthlyInterest = 0;
        }
    }

    return values;
}

function CalculatePayment(principal, interestRate, nPayments) {
    return principal * (interestRate * (1 + interestRate) ** nPayments) / (((1 + interestRate) ** nPayments) - 1);
}

function dailyInterest(currentValue, loanRate) {
    return (currentValue * (1 + loanRate)) - currentValue;
}
