const formula = document.querySelector('.js-formula');
const result = document.querySelector('.js-result');
const numberArea = document.querySelector('.js-numberBtn');
const calculatingArea = document.querySelector('.js-calculatingBtn');
const functionKeyArea = document.querySelector('.js-functionKeyBtn');


let formulaArr = [];
let formulaTxt = '';
let resultTxt = '';
let calcStatus = '';
let numberA = '';
let numberB = '';
//監聽數字按鈕
numberArea.addEventListener('click', (e) => {
  let num = e.target.getAttribute('data-number');
  if (e.target.getAttribute('data-number') === null) {
    return;
  } else if (resultTxt === '' && e.target.getAttribute('data-number') === '00') {
    //輸入的第1個數字不得為00
    return;
  } else if (resultTxt === '' && e.target.getAttribute('data-number') === '.') {
    //輸入的第1個數字不得為.
    return;
  } else if (resultTxt !== '' && Number(resultTxt) === 0 && e.target.getAttribute('data-number') === '0') {
    //當輸入的第1個數字為0時不能再輸入0
    return;
  } else if (resultTxt !== '' && Number(resultTxt) === 0 && e.target.getAttribute('data-number') === '00') {
    //當輸入的第1個數字為0時不能再輸入00
    return;
  } else if (numberA === '' && calcStatus === '') {
    //第1個數字
    resultTxt += num;
    formulaTxt += num;
  } else if (calcStatus === 'equal') {
    //等於後按下數字直接重置
    reset();
    resultTxt += num;
    formulaTxt += num;
  } else if (numberA !== '' && resultTxt === '') {
    //運算符號後的數字，加入空白
    formulaTxt += ` ${num}`;
    resultTxt += num;
  } else if (numberA !== '') {
    //運算符號後的數字
    resultTxt += num;
    formulaTxt += num;
  }
  formula.textContent = formulaTxt;
  result.textContent = toCurrency(resultTxt);
})
//監聽運算符號按鈕
calculatingArea.addEventListener('click', (e) => {
  formulaArr = formulaTxt.split(' ');
  if (e.target.getAttribute('data-calculating') === null) {
    return;
  } else if (resultTxt === '' && numberA === '') {
    return;
  } else if (calcStatus === '') {
    calcStatus = e.target.getAttribute('data-calculating');
    formulaArr.push(e.target.getAttribute('data-text'));
    numberA = Number(resultTxt);
    resultTxt = '';
  } else if (calcStatus === 'equal') {
    //等於後按下數字直接重置
    calcStatus = e.target.getAttribute('data-calculating');
    formulaArr = [];
    formulaArr.push(numberA.toString());
    formulaArr.push(e.target.getAttribute('data-text'));
    resultTxt = '';
  } else if (calcStatus !== '' && resultTxt === '') {
    //換運算符號
    calcStatus = e.target.getAttribute('data-calculating');
    if (formulaArr[formulaArr.length-1] === '') {
      formulaArr.splice(-2, 2);
    } else {
      formulaArr.pop();
    }
    formulaArr.push(e.target.getAttribute('data-text'));
  } else if (calcStatus !== '' && resultTxt !== '') {
    //加入第二個之後的運算符號
    formulaArr.push(e.target.getAttribute('data-text'));
    numberB = Number(resultTxt);
    calc(calcStatus);
    calcStatus = e.target.getAttribute('data-calculating');
    result.textContent = toCurrency(resultTxt);
    numberA = Number(resultTxt);
    resultTxt = '';
    numberB = '';
  }
  formulaTxt = formulaArr.join(' ');
  formula.textContent = formulaTxt;
})
//按下功能鍵
functionKeyArea.addEventListener('click', (e) => {
  if (e.target.getAttribute('data-functionKey') === null) {
    return;
  } else if (e.target.getAttribute('data-functionKey') === 'reset') {
    reset();
  } else if (e.target.getAttribute('data-functionKey') === 'delete') {
    if (resultTxt === '' && numberA !== '') {
      result.textContent = 0;
    } else if (resultTxt !== '') {
      resultTxt = resultTxt.substring(0,resultTxt.length-1);
      formulaTxt = formulaTxt.substring(0,formulaTxt.length-1);
      formula.textContent = formulaTxt;
      result.textContent = toCurrency(resultTxt);
    }
  } else if (e.target.getAttribute('data-functionKey') === 'equal') {
    if (calcStatus === 'equal' || calcStatus === '') {
      return;
    }
    formulaArr = formulaTxt.split(' ');
    formulaArr.push('=');
    numberB = Number(resultTxt);
    calc(calcStatus);
    calcStatus = 'equal';
    result.textContent = toCurrency(resultTxt);
    numberA = Number(resultTxt);
    formulaTxt = formulaArr.join(' ');
    formula.textContent = formulaTxt;
    resultTxt = '';
    numberB = '';
  }
})

//計算
function calc(status) {
  if (status === 'divided') {
    resultTxt = decimalPoint(numberA / numberB);
  } else if (status === 'times') {
    resultTxt = decimalPoint(numberA * numberB);
  } else if (status === 'add') {
    resultTxt = decimalPoint(numberA + numberB);
  } else if (status === 'minus') {
    resultTxt = decimalPoint(numberA - numberB);
  }
}

//最多保留小數點3位
function decimalPoint(num) {
  return Math.round(num * 1000) / 1000;
}

//千分位
function toCurrency(num){
  var parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

//重置
function reset() {
  formulaArr = [];
  formulaTxt = '';
  resultTxt = '';
  calcStatus = '';
  numberA = '';
  numberB = '';
  formula.textContent = '';
  result.textContent = '';
}