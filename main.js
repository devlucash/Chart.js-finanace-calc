let savingsChart; // Declare the variable globally
let offsetChart;
let RepaymentsChart;


window.onload = function () {
    CreateInitialGraphs();
    //StartSavingsCalc() // initialise the savings calc graph and declares variables
    //drawGraph(10000, 0.05, 100, 'weekly', 5);
    //console.log("Initialised savings calculator graph")
};

const interestRate = 0.05; // 5%

document.getElementById('savings-rate-slider').addEventListener('input', function () {
    customSlider(savings-rate-label);
    console.log("updating slider for savings");
});

document.getElementById('offset-rate-slider').addEventListener('input', function () {
    customSlider(offset-rate-label);
    console.log("updating slider for offset");
});

document.getElementById('morgage-rate-slider').addEventListener('input', function () {
    customSlider(repayments-rate-label);
    console.log("updating slider for repayments");
});

function CreateInitialGraphs() {
    console.log("Creating Initial Graphs");
    CreateSavingsGraph();
    CreateOffsetGraph();
    CreateRepaymentsGraph();
}

function CreateSavingsGraph(){
    
    console.log("Creating Savings Graphs");
    const compoundctx = document.getElementById('savings-data-set').getContext('2d');
    const dataPoints = CreateSavingsDataPoints(10000, 0.05, 1000, 'Yearly', 5);
    compoundChart = new Chart(compoundctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 5 + 1 }, (_, i) => `Year ${i}`), // Updated labels for x-axis (years)
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

function CreateSavingsDataPoints(initialAmount, interestRate, contributionAmount, contributionInterval, investmentPeriod) {
    const values = [];
    let currentValue = initialAmount;
    const periodsPerYear = getPeriodsPerYear('monthly'); // Interest calculated daily, contributions added monthly
    const effectiveInterestRate = (1 + interestRate / periodsPerYear) ** periodsPerYear - 1;

    for (let i = 0; i <= investmentPeriod * periodsPerYear; i++) {
        if (getPeriodsPerYear(contributionInterval) === 1) {
            values.push(currentValue);
            currentValue = calculateCompoundInterest(currentValue, effectiveInterestRate, contributionAmount, periodsPerYear);
        }
        if (getPeriodsPerYear(contributionInterval) === 12) {
            if (i % 12 === 0) {
                values.push(currentValue);
                currentValue = calculateCompoundInterest(currentValue, effectiveInterestRate, contributionAmount, periodsPerYear);
            }
        }
        if (getPeriodsPerYear(contributionInterval) === 26) {
            if (i % 26 === 0) {
                values.push(currentValue);
                currentValue = calculateCompoundInterest(currentValue, effectiveInterestRate, contributionAmount, periodsPerYear);
            }
        }
        if (getPeriodsPerYear(contributionInterval) === 52) {
            if (i % 52 === 0) {
                values.push(currentValue);
                currentValue = calculateCompoundInterest(currentValue, effectiveInterestRate, contributionAmount, periodsPerYear);
            }
        }
        if (getPeriodsPerYear(contributionInterval) === 365) {
            if (i % 365 === 0) {
                values.push(currentValue);
                currentValue = calculateCompoundInterest(currentValue, effectiveInterestRate, contributionAmount, periodsPerYear);
            }
        }
    }
    return values;
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

function CreateOffsetGraph(){

    console.log("Creating Offset Graphs");
    const offsetctx = document.getElementById('offset-data-set').getContext('2d');
    const dataPointsTotal = generateMortgageDataPoints(500000, 0.05, 30);
    const dataPointsOffset = generateMortgageDataPointsWithOffset(500000, 0.05, 30, 50000);
    //console.log(dataPointsTotal);
    //console.log(dataPointsOffset);

    offsetChart = new Chart(offsetctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 30 + 1 }, (_, i) => `Year ${i}`), // Updated labels for x-axis (years)
            datasets: [{
                label: 'With Offset',
                data: dataPointsOffset,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                label: 'Without Offset',
                data: dataPointsTotal,
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
    console.log('offset graph created');
}

function calculateMonthlyRepayment(loanAmount, interestRate, loanTerm) {
    // Convert interest rate from percentage to decimal
    const monthlyInterestRate = interestRate / 12;
    
    // Convert loan term from years to months
    const loanTermMonths = loanTerm * 12;
    
    // Calculate monthly payment using the formula for fixed-rate mortgage
    const monthlyPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));
    
    return monthlyPayment;
}

function generateMortgageDataPoints(loanAmount, interestRate, loanTerm) {
    const monthlyInterestRate = interestRate / 12;
    const loanTermYears = loanTerm;
    
    const monthlyPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -loanTermYears * 12));
    
    const dataPoints = [];
    let remainingLoanAmount = loanAmount;

    for (let year = 0; year <= loanTermYears; year++) {
        dataPoints.push(remainingLoanAmount);
        
        for (let month = 0; month < 12; month++) {
            const monthlyInterest = remainingLoanAmount * monthlyInterestRate;
            const principalPayment = monthlyPayment - monthlyInterest;
            remainingLoanAmount -= principalPayment;
            
            if (remainingLoanAmount <= 0) {
                remainingLoanAmount = 0; // Ensure loan amount doesn't go below 0
                break; // Exit the loop if the loan is fully paid off
            }
        }
    }

    return dataPoints;
}

function generateMortgageDataPointsWithOffset(loanAmount, interestRate, loanTerm, offsetBalance) {
    const monthlyInterestRate = interestRate / 12;
    const loanTermYears = loanTerm;
    
    const monthlyPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -loanTermYears * 12));
    
    const dataPoints = [];
    let remainingLoanAmount = loanAmount;
    let offsetRemaining = offsetBalance;

    for (let year = 0; year <= loanTermYears; year++) {
        dataPoints.push(remainingLoanAmount);
        
        for (let month = 0; month < 12; month++) {
            const monthlyInterest = remainingLoanAmount * monthlyInterestRate;
            const principalPayment = monthlyPayment - monthlyInterest;
            remainingLoanAmount -= principalPayment;

            // Apply offset balance towards remaining loan amount
            if (offsetRemaining > 0) {
                const offsetReduction = Math.min(offsetRemaining, principalPayment);
                remainingLoanAmount -= offsetReduction;
                offsetRemaining -= offsetReduction;
            }
            
            if (remainingLoanAmount <= 0) {
                remainingLoanAmount = 0; // Ensure loan amount doesn't go below 0
                break; // Exit the loop if the loan is fully paid off
            }
        }
    }

    return dataPoints;
}

function CalculateYearDifference(loanAmount, interestRate, loanTerm, offsetBalance) {
    const dataPointsOffset = generateMortgageDataPointsWithOffset(loanAmount, interestRate, loanTerm, offsetBalance);
    return dataPointsOffset.reduce((count, value) => {
        if (value === 0) {
            return count + 1;
        }
        return count;
    }, 0);
}


function CreateRepaymentsGraph(){

    console.log("Creating Repayments Graphs");
    const repaymentsctx = document.getElementById('repayments-data-set').getContext('2d');
    const repaymentsdatapoints = generateMortgageDataPoints(500000, 0.05, 30);
    console.log(repaymentsdatapoints);

    repaymentsChart = new Chart(repaymentsctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 30 + 1 }, (_, i) => `Year ${i}`), // Updated labels for x-axis (years)
            datasets: [{
                label: 'Amount remaining on morgage',
                data: repaymentsdatapoints,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.ceil(Math.max(...repaymentsdatapoints) * 1.1),
                }
            }
        }
    });
    console.log('repayments graph created');
    
}

function customSlider(RateLabelId) {
    const RateLabel = document.getElementById(RateLabelId);
    const maxVal = parseFloat(RateLabel.getAttribute("max"));
    const val = (parseFloat(RateLabel.value) / maxVal) * 15; // Limit the range to 0 to 20
    const roundedVal = (val * 100).toFixed(2) + "%"; // Convert to percentage format and round to 2 decimal places
    RateLabel.innerHTML = roundedVal;
}

