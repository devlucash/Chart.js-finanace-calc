let compoundChart; // Declare the variable globally
//const calculateButton = document.getElementById('calculateButton'); // Moved the declaration here

window.onload = function () {
    const interestRateInput = document.getElementById('OffsetInterestRate');
    const interestRateLabel = document.getElementById('OffsetInterestRateLabel');
    const calculateButton = document.getElementById('offsetcalculateButton'); // Moved the declaration here

    const initialAmount = document.getElementById('offsetcalculateButton');
    const interestRate = 0.05; // 5%
    const contributionAmount = 100;
    const contributionInterval = document.getElementById('compoundInterval').value;
    const investmentPeriod = 5;

    drawGraph(initialAmount, interestRate, contributionAmount, contributionInterval, investmentPeriod);

    interestRateInput.addEventListener('input', function () {
        customSlider();
        drawGraph(initialAmount, parseFloat(interestRateInput.value), contributionAmount, contributionInterval, investmentPeriod);
    });

    calculateButton.addEventListener('click', function () {
        // Get other input values
        const initialAmount = parseFloat(document.getElementById('loanAmount').value);
        const offsetBalance = parseFloat(document.getElementById('offsetBalance').value);
        const PaymentFreuency = document.getElementById('PaymentFrequency').value;
        const loanTerm = parseFloat(document.getElementById('loanTerm').value);
        const LoanRate = parseFloat(document.getElementById('OffsetInterestRate').value);


        // Call drawGraph with updated values
        drawGraph(initialAmount, offsetBalance, PaymentFreuency, loanTerm, LoanRate);
    });

    function customSlider() {
        const maxVal = interestRateInput.getAttribute("max");
        const val = (interestRateInput.value / maxVal) * 15; // Limit the range to 0 to 20
        const roundedVal = val.toFixed(2) + "%"; // Round to 2 decimal places

        OffsetInterestRate.innerHTML = roundedVal;
    }
};

function updateChart() {
    drawGraph();
}

function drawGraph(initialAmount, offsetBalance, PaymentFreuency, loanTerm, LoanRate) {
    const ctx = document.getElementById('offset-data-set').getContext('2d');

    // Destroy the existing Chart instance if it exists
    if (offsetChart) {
        offsetChart.destroy();
    }

    const dataPoints = calculateDataPoints(initialAmount, 0, PaymentFreuency, loanTerm, LoanRate);
    const offSetDataPoints = calculateDataPoints(initialAmount, offsetBalance, PaymentFreuency, loanTerm, LoanRate);

    offsetChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: investmentPeriod + 1 }, (_, i) => `Year ${i}`), // Updated labels for x-axis (years)
            datasets: [{
                label: 'Owing With Offset',
                data: offSetDataPoints,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true, // Fill the area below the line
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color for the filled area
            },
            {
                label: 'Owing Without Offset',
                data: dataPoints,
                borderColor: 'rgba(255, 99, 71, 0.2)',
                borderWidth: 2,
                fill: true, // Fill the area below the line
                backgroundColor: 'rgba(255, 99, 71, 0.2)', // Color for the filled area
            }
        ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.ceil(Math.max(...dataPoints) * 1.1), // Set the y-axis maximum to 110% of the highest data point
                }
                
            }
        }
    });
}



// Rest of the code remains unchanged

function calculateDataPoints(initialAmount, offsetBalance, PaymentFreuency, loanTerm, LoanRate) {
    const values = [];
    let currentValue = initialAmount;
    

    for (let i = 0; i <= loanTerm*365; i++) {
        if(i % 365 === 0) {
            values.push(currentValue); // adds data point for each year 
            currentValue -= (CalculatePayment(principal, interestRate, nPayments) * repaymentFrequency(PaymentFreuency));
        }
            monthlyInterest += dailyInterest(currentValue + monthlyInterest, LoanRate); // sums daily interest to be added at end of monthg
        if(i % 30 === 0) {
            currentValue + monthlyInterest; // adds interest at end of month
            monthlyInterest = 0;    // resets monthly interest

        }
    return values;
}
}


// principal == Principal (starting balance) of the loan
// interestRate == Annual interest rate (APRC)/12 (months)
// nPayments == Number of payments in total (changes on repayment freuqency)

// formula for repayments
function CalculatePayment(principal, interestRate, nPayments) {
    return principal * ((interestRate(1 + interestRate)) ** nPayments) / (((1 + interestRate)** nPayments) - 1) 
}

function dailyInterest(currentValue, LoanRate){
    return (currentValue * 1+LoanRate) - currentValue;
}

function repaymentFrequency(PaymentFreuency) {
    switch (PaymentFreuency) {
        case 'monthly':
            return 12;
        case 'fornightly':
            return 26;
        case 'weekly':
            return 52;
        default:
            return 12;
    }
}
