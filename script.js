const dropList = document.querySelectorAll('.drop-list select');
const fromCurrency = document.querySelector('.from select');
const toCurrency = document.querySelector('.to select');
const getButton = document.querySelector('form button');


let dropListLength = dropList.length;
for (let i = 0; i < dropListLength; i++) {
  for (currency_code in country_code) {
    let selected;
    if (i == 0) {
      selected = currency_code == "USD" ? "selected" : "";
    }else if (i == 1) {
      selected = currency_code == "VND" ? "selected" : "";
    }
    let optionTags = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    dropList[i].insertAdjacentHTML("beforeend", optionTags);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target);
  })
}

function loadFlag(element) {
  for(code in country_code) {
    if (code == element.value) {
      let imgTag = element.parentElement.querySelector('img');
      imgTag.src = `https://www.countryflags.io/${country_code[code]}/flat/64.png`;
    }
  }
}

const exchangeIcon = document.querySelector('.drop-list .icon');
exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;

  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});


function getExchangeRate() {
  const amount = document.querySelector('.amount input');
  const exchangeRateTxt = document.querySelector('.exchange-rate');
  let amountVal = amount.value;

  if(amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = "1";
  }

  // Key API để học(a5e5....) => nếu làm thực tế thì sẽ lưu vào chỗ khác cho mục đích bảo mật
  let url = `https://v6.exchangerate-api.com/v6/a5e502421ecef1bac6ed1fdd/latest/${fromCurrency.value}`;
  exchangeRateTxt.innerText = "Getting exchange rate ...";
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExchangeRate = (exchangeRate * amountVal).toFixed(2);
      exchangeRateTxt.innerText =  `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    })
    .catch(() => {
      exchangeRateTxt.innerText = "Something went wrong";
    })
}


/*==============Running==================*/
window.addEventListener("load", () => {
  getExchangeRate();
});

getButton.addEventListener("click", e => {
  e.preventDefault();
  getExchangeRate();
});

