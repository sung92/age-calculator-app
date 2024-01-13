import dayjs from 'dayjs';
import { intervalToDuration } from 'date-fns';

const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const date = dayjs()

const form = document.querySelector('.js-form');

const day = document.getElementById('day');
const month = document.getElementById('month');
const year = document.getElementById('year');
// raw values of the date
let dayV;
let monthV;
let yearV;

form.addEventListener('submit', e => {
	e.preventDefault();
	
    // Validate inputs
	if(checkInputs()) {
        // If there are no empty inputs, validate year/ month/ day
        const yearvalidation = validateYear(); 
        const monthvalidation = validateMonth(); 
        const mdayvalidation = validateDay();
        
        if( (yearvalidation && monthvalidation && mdayvalidation) === true) {
            //validate if the day of that month exists in that year
            if(validateDate() === true) {
                calculateAge();
            }
        }
    }
    
});

function checkInputs() {

    // Assignate input values to their variables
    dayV = day.value.trim();
    monthV = month.value.trim();
    yearV = year.value.trim();
	
	if(dayV === '') {
		setErrorFor(day, 'This field is required');
	} else {
        setSuccessFor(day);
    }
    if (monthV === '') {
		setErrorFor(month, 'This field is required');
	} else {
        setSuccessFor(month);
    }
    if (yearV === '') {
		setErrorFor(year, 'This field is required');
	} else {
        setSuccessFor(year);
    }

    if(dayV === '' || monthV === '' || yearV === '') return false;
    return true;
}

function setErrorFor(input, message, dateValid = false) {
    if(dateValid === false) {
        const formControl = input.parentElement;
        const small = formControl.querySelector('small');
        formControl.classList.add("error");
        small.innerText = message;
    } // Only true when the date is after today's date
    if(dateValid === true) {
        setTimeout(() => {
            input.classList.toggle('hidden');
        }, 2000);
        input.innerText = message;
        input.classList.toggle('hidden');
    }
}

function setSuccessFor(input) {
    const formControl = input.parentElement;
	formControl.classList.remove("error");
}

function validateYear() {
    if(yearV > date.year()) {
        setErrorFor(year, 'Must be in the past');
        return false;
    }
    if( yearV.length > 4 ) {
        setErrorFor(year, 'Incorrect format');
        return false;
    }
    setSuccessFor(year);
    return true;
}

function validateMonth() {
    if( (0 < monthV && monthV <= 12) === false ) {
        setErrorFor(month, 'Must be a valid month');
        return false;
    }
    if( monthV.length > 2 ) {
        setErrorFor(month, 'Incorrect format');
        return false;
    }
    setSuccessFor(month);
    return true;
}

function validateDay() {
    if( (0 < dayV && dayV <= 31) === false) {
        setErrorFor(day, 'Must be a valid day');
        return false;
    }
    if( dayV.length > 2 ) {
        setErrorFor(day, 'Incorrect format');
        return false;
    }
    setSuccessFor(day);
    return true;
}

function validateDate() {
    // Alternative solution below in comments.
    // const dateString = `${yearV}-${monthV}-${dayV}`;
    // if(dateString !== dayjs(dateString).format("YYYY-MM-DD"))

    // Validate if the day exists in that month of the that year
    const daysInThatMonth = dayjs(`${yearV}-${monthV}-'01'`).daysInMonth();

    if( dayV > daysInThatMonth) {
        setErrorFor(day, 'Must be a valid date');
        return false;
    }
    return true;
}

function calculateAge() {
    const currentDate = dayjs();

    const formattedDate = currentDate.format('YYYY-MM-DD');
    const inputDate = `${yearV}-${monthV}-${dayV}`;
    const calculatedDay = formattedDate;
    
    // Check if current date is higher than the input Date
    if(!dayjs(inputDate).isBefore(dayjs(formattedDate))) {
        // Mejorar el output error de esto, quizás un tercer argumento.
        const dateValidation = document.querySelector('.date');
        setErrorFor(dateValidation, `Today's date must precede the current day`, true);
        return false;
    }

    // SHOW OUTPUT

    // Get the duration between inputDate and currentDate using date-fns package
    const start = new Date(inputDate);
    const end = new Date(currentDate);

    let { years, months, days } = intervalToDuration({ start, end });
    if(years === undefined) years = '0';
    if(months === undefined) months = '0';
    if(days === undefined) days = '0';

    // console.log(`${years} years : ${months} months : ${days} days remaining`);
    
    document.querySelector('.year-output').innerHTML = years;
    document.querySelector('.month-output').innerHTML = months;
    document.querySelector('.day-output').innerHTML = days;
}