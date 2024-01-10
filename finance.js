let compoundChart; // Declare the variable globally
//const calculateButton = document.getElementById('calculateButton'); // Moved the declaration here

window.onload = function () {
    const interestRateInput = document.getElementById('interestRate');
    const interestRateLabel = document.getElementById('interestRateLabel');
    const calculateButton = document.getElementById('calculateButton'); // Moved the declaration here

    const initialAmount = 5000;
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
        const initialAmount = parseFloat(document.getElementById('initialAmount').value);
        const contributionAmount = parseFloat(document.getElementById('contributionAmount').value);
        const contributionInterval = document.getElementById('compoundInterval').value;
        const investmentPeriod = parseFloat(document.getElementById('investmentPeriod').value);

        // Call drawGraph with updated values
        drawGraph(initialAmount, interestRate, contributionAmount, contributionInterval, investmentPeriod);
    });

    function customSlider() {
        const maxVal = interestRateInput.getAttribute("max");
        const val = (interestRateInput.value / maxVal) * 15; // Limit the range to 0 to 20
        const roundedVal = val.toFixed(2) + "%"; // Round to 2 decimal places

        interestRateLabel.innerHTML = roundedVal;
    }
};

function updateChart() {
    drawGraph();
}

function drawGraph(initialAmount, interestRate, contributionAmount, contributionInterval, investmentPeriod) {
    const ctx = document.getElementById('data-set').getContext('2d');

    // Destroy the existing Chart instance if it exists
    if (compoundChart) {
        compoundChart.destroy();
    }

    const dataPoints = calculateDataPoints(initialAmount, interestRate, contributionAmount, contributionInterval, investmentPeriod);

    compoundChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: investmentPeriod + 1 }, (_, i) => `Year ${i}`), // Updated labels for x-axis (years)
            datasets: [{
                label: 'Savings Estimate',
                data: dataPoints,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true, // Fill the area below the line
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color for the filled area
            }]
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

function calculateDataPoints(initialAmount, interestRate, contributionAmount, contributionInterval, investmentPeriod) {
    const values = [];
    let currentValue = initialAmount;
    const periodsPerYear = getPeriodsPerYear('monthly'); // Interest calculated daily, contributions added monthly
    const effectiveInterestRate = (1 + interestRate / periodsPerYear) ** periodsPerYear - 1;

    for (let i = 0; i <= investmentPeriod * periodsPerYear; i++) {
        values.push(currentValue);
        currentValue = calculateCompoundInterest(currentValue, effectiveInterestRate, contributionAmount, periodsPerYear);
    }

    return values;
}


function calculateCompoundInterest(principal, interestRate, contributionAmount, periodsPerYear) {
    for (let i = 0; i < periodsPerYear; i++) {
        principal = principal * (1 + interestRate / 365); // Interest calculated daily
    }

    principal += contributionAmount; // Add contribution at the end of each month
    return principal;
}



function getPeriodsPerYear(contributionInterval) {
    switch (contributionInterval) {
        case 'annually':
            return 1;
        case 'monthly':
            return 12;
        case 'weekly':
            return 52;
        case 'daily':
            return 365;
        default:
            return 1;
    }
}
